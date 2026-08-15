import { FunctionTool } from '@google/adk';
import { z } from 'zod';

export const draftEmailTool = new FunctionTool({
  name: 'draft_email',
  description: 'Creates a draft reply email for a booking inquiry.',
  parameters: z.object({
    to: z.string().describe('Recipient email address'),
    subject: z.string(),
    body: z.string(),
    queue_item_id: z.string(),
  }),
  execute: async ({ to, queue_item_id }) => {
    // TODO: replace with real email draft API
    const draft_id = `draft_${Date.now()}`;
    console.log('[stub] Drafting email to:', to, 'for queue item:', queue_item_id);
    return { success: true, draft_id };
  },
});
