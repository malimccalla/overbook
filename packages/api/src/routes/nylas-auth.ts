import { getAuth } from '@clerk/express';
import { db } from '@overbook/db';
import type { Request, Response } from 'express';

import { nylas } from '../services/nylas.js';

export async function nylasConnect(req: Request, res: Response) {
  const auth = getAuth(req);
  let orgId: string | null = null;

  // Try Clerk auth first, fall back to query param for testing
  if (auth.orgId) {
    const org = await db.organization.findUnique({ where: { clerkOrgId: auth.orgId } });
    orgId = org?.id ?? null;
  } else if (req.query.orgId) {
    orgId = req.query.orgId as string;
  }

  if (!orgId) {
    res.status(401).json({ error: 'Not authenticated. Pass ?orgId=xxx for testing.' });
    return;
  }

  const authUrl = nylas.auth.urlForOAuth2({
    clientId: process.env.NYLAS_CLIENT_ID!,
    redirectUri: `${process.env.API_URL ?? 'http://localhost:4000'}/auth/nylas/callback`,
    state: orgId,
  });

  res.redirect(authUrl);
}

export async function nylasCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  const orgId = req.query.state as string;

  if (!code || !orgId) {
    res.status(400).json({ error: 'Missing code or state' });
    return;
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientId: process.env.NYLAS_CLIENT_ID!,
      redirectUri: `${process.env.API_URL ?? 'http://localhost:4000'}/auth/nylas/callback`,
      code,
    });

    const { grantId, email } = response;

    await db.connectedInbox.upsert({
      where: { organizationId_email: { organizationId: orgId, email: email! } },
      update: { nylasGrantId: grantId },
      create: {
        organizationId: orgId,
        email: email!,
        nylasGrantId: grantId,
        displayName: email,
      },
    });

    console.log('[nylas] Connected inbox: %s (grant: %s, org: %s)', email, grantId, orgId);

    // Redirect back to dashboard
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://app.overbook.test:3000';
    res.redirect(`${frontendUrl}/requests`);
  } catch (err) {
    console.error('[nylas] OAuth callback failed:', err);
    res.status(500).json({ error: 'Failed to connect inbox' });
  }
}
