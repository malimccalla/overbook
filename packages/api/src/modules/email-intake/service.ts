import { InMemoryRunner, rootAgent } from '@overbook/agents';
import { db } from '@overbook/db';

const runner = new InMemoryRunner({ agent: rootAgent, appName: 'overbook' });

export class EmailIntakeService {
  async processEmail(orgId: string, emailText: string) {
    const message = `organization_id: ${orgId}\n\n${emailText}`;

    for await (const _event of runner.runEphemeral({
      userId: 'system',
      newMessage: { parts: [{ text: message }] },
    })) {
      // Consume all events until pipeline completes
    }

    // Return the most recently created BookingRequest for this org
    const request = await db.bookingRequest.findFirst({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      include: { artist: true },
    });

    return request;
  }
}
