import { LlmAgent } from '@google/adk';

import { draftEmailTool } from '../../tools/email-tools.js';

export function createDraftReplyAgent() {
  return new LlmAgent({
    name: 'draft_reply_agent',
  model: 'gemini-2.5-flash',
  description: 'Drafts a context-aware reply email for a booking inquiry.',
  instruction: `You draft professional booking reply emails on behalf of a music booking agency.

Read the queue_item from session state for context on the inquiry.

Write a concise, professional reply that:
- Acknowledges the inquiry
- Reflects the current status (e.g. requesting missing info, confirming receipt)
- Maintains a professional but personable tone

Use the draft_email tool to save the draft. Set the queue_item_id from session state.`,
    tools: [draftEmailTool],
  });
}
