import { InMemoryRunner, rootAgent } from '@overbook/agents';
import { db } from '@overbook/db';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';

import { nylas } from '../services/nylas.js';

const runner = new InMemoryRunner({ agent: rootAgent, appName: 'overbook-nylas' });

export function nylasWebhookChallenge(req: Request, res: Response) {
  const challenge = req.query.challenge as string;
  console.log('[nylas] GET challenge:', challenge ?? 'none');
  if (challenge) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(challenge);
    return;
  }
  res.status(200).send('ok');
}

export async function nylasWebhookHandler(req: Request, res: Response) {
  console.log('[nylas] ─── Webhook received ───');

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
  console.log('[nylas] Body size: %d bytes', rawBody.length);

  // Signature check (log only, don't reject)
  const signature = req.headers['x-nylas-signature'] as string;
  const webhookSecret = process.env.NYLAS_WEBHOOK_SECRET;
  if (webhookSecret && signature) {
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    console.log('[nylas] Signature match:', signature === expected);
  }

  const payload = JSON.parse(rawBody.toString());
  const eventType = payload.type as string;
  console.log('[nylas] Event type: %s', eventType);
  console.log('[nylas] Payload keys: %s', Object.keys(payload).join(', '));
  console.log('[nylas] Data keys: %s', payload.data ? Object.keys(payload.data).join(', ') : 'NO DATA');

  if (!eventType?.startsWith('message.created')) {
    console.log('[nylas] Ignoring non-message event');
    res.status(200).send('ignored');
    return;
  }

  const messageData = payload.data?.object;
  const grantId = messageData?.grant_id as string;

  console.log('[nylas] Grant ID: %s', grantId ?? 'MISSING');
  console.log('[nylas] Message data present: %s', !!messageData);
  if (messageData) {
    console.log('[nylas] Message keys: %s', Object.keys(messageData).join(', '));
    console.log('[nylas] Message ID: %s', messageData.id);
    console.log('[nylas] Message grant_id: %s', messageData.grant_id);
    console.log('[nylas] Thread ID: %s', messageData.thread_id);
    console.log('[nylas] Subject: %s', messageData.subject);
    console.log('[nylas] From: %j', messageData.from);
    console.log('[nylas] Has body: %s (%d chars)', !!messageData.body, (messageData.body as string)?.length ?? 0);
  }

  if (!grantId || !messageData) {
    console.log('[nylas] ✗ Missing grantId or messageData, skipping');
    res.status(200).send('ok');
    return;
  }

  try {
    const inbox = await db.connectedInbox.findUnique({ where: { nylasGrantId: grantId } });
    console.log('[nylas] Inbox lookup: %s', inbox ? `found (${inbox.email}, org: ${inbox.organizationId})` : 'NOT FOUND');

    if (!inbox) {
      res.status(200).send('ok');
      return;
    }

    const orgId = inbox.organizationId;
    const nylasMessageId = messageData.id as string;
    const threadId = messageData.thread_id as string | undefined;

    const existing = await db.rawEmail.findUnique({ where: { nylasMessageId } });
    if (existing) {
      console.log('[nylas] ✗ Duplicate message, skipping');
      res.status(200).send('ok');
      return;
    }

    if (threadId) {
      const existingEmail = await db.rawEmail.findFirst({
        where: { threadId },
        include: { bookingRequest: true },
      });
      if (existingEmail?.bookingRequest) {
        await saveRawEmail({ messageData, orgId, inboxId: inbox.id, nylasMessageId, threadId });
        console.log('[nylas] Reply on thread %s → request %s', threadId, existingEmail.bookingRequest.id);
        res.status(200).send('ok');
        return;
      }
    }

    let body = messageData.body as string | undefined;
    if (eventType.includes('truncated') || !body) {
      console.log('[nylas] Body missing or truncated, fetching full message...');
      const full = await nylas.messages.find({ identifier: grantId, messageId: nylasMessageId });
      body = full.data.body ?? '';
      console.log('[nylas] Fetched full body: %d chars', body.length);
    }

    const bodyText = stripHtml(body ?? '');
    console.log('[nylas] Stripped body: %d chars', bodyText.length);
    console.log('[nylas] Body preview: %s', bodyText.slice(0, 200));

    // Return 200 immediately — process async
    res.status(200).send('ok');
    console.log('[nylas] ✓ Returned 200, starting async pipeline...');

    processEmailAsync(orgId, inbox.id, nylasMessageId, threadId, messageData, bodyText, body ?? '');
  } catch (err) {
    console.error('[nylas] ✗ Error in webhook handler:', err);
    res.status(200).send('ok');
  }
}

async function processEmailAsync(
  orgId: string,
  inboxId: string,
  nylasMessageId: string,
  threadId: string | undefined,
  messageData: Record<string, unknown>,
  bodyText: string,
  bodyHtml: string,
) {
  console.log('[nylas-pipeline] Starting pipeline for message %s (org: %s)', nylasMessageId, orgId);

  try {
    const message = `organization_id: ${orgId}\n\n${bodyText}`;
    console.log('[nylas-pipeline] Agent input preview: %s', message.slice(0, 300));

    let isBooking = false;
    let eventCount = 0;

    for await (const event of runner.runEphemeral({
      userId: 'system',
      newMessage: { parts: [{ text: message }] },
    })) {
      eventCount++;
      const author = (event as { author?: string }).author;
      console.log('[nylas-pipeline] Event #%d from %s', eventCount, author ?? 'unknown');

      const state = (event as { actions?: { stateDelta?: Record<string, unknown> } }).actions?.stateDelta;
      if (state) {
        console.log('[nylas-pipeline] State delta keys: %s', Object.keys(state).join(', '));
      }

      if (state?.classification) {
        const classification = state.classification as { category?: string; confidence?: number };
        console.log('[nylas-pipeline] Classification: %s (confidence: %s)', classification.category, classification.confidence);
        if (classification.category === 'NOT_RELEVANT') {
          console.log('[nylas-pipeline] ✗ Email classified as NOT_RELEVANT, discarding');
          return;
        }
        isBooking = true;
      }
    }

    console.log('[nylas-pipeline] Pipeline complete. Events: %d, isBooking: %s', eventCount, isBooking);

    if (isBooking) {
      await saveRawEmail({ messageData, orgId, inboxId, nylasMessageId, threadId });
      console.log('[nylas-pipeline] ✓ Saved RawEmail for message %s', nylasMessageId);
    }

    // Check if a BookingRequest was created
    const newRequest = await db.bookingRequest.findFirst({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
    console.log('[nylas-pipeline] Latest BookingRequest: %s (status: %s)', newRequest?.id ?? 'NONE', newRequest?.status ?? '-');

  } catch (err) {
    console.error('[nylas-pipeline] ✗ Pipeline error:', err);
  }
}

async function saveRawEmail({ messageData, orgId, inboxId, nylasMessageId, threadId }: {
  messageData: Record<string, unknown>;
  orgId: string;
  inboxId: string;
  nylasMessageId: string;
  threadId?: string;
}) {
  const from = (messageData.from as { email?: string; name?: string }[])?.[0];
  const to = (messageData.to as { email?: string; name?: string }[])?.[0];
  const body = messageData.body as string ?? '';

  console.log('[nylas-save] Saving: from=%s, to=%s, subject=%s', from?.email, to?.email, messageData.subject);

  await db.rawEmail.upsert({
    where: { nylasMessageId },
    update: {},
    create: {
      organizationId: orgId,
      connectedInboxId: inboxId,
      nylasMessageId,
      threadId: threadId ?? null,
      subject: messageData.subject as string ?? null,
      bodyText: stripHtml(body),
      bodyHtml: body,
      fromEmail: from?.email ?? null,
      fromName: from?.name ?? null,
      toEmail: to?.email ?? null,
      toName: to?.name ?? null,
      receivedAt: new Date(((messageData.date as number) ?? Date.now() / 1000) * 1000),
      hasAttachments: ((messageData.attachments as unknown[])?.length ?? 0) > 0,
    },
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
