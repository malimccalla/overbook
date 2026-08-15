import { LlmAgent } from '@google/adk';

import { saveQueueItemTool } from '../../tools/booking-tools.js';

export const assemblerAgent = new LlmAgent({
  name: 'queue_item_assembler_agent',
  model: 'gemini-2.5-flash',
  description: 'Assembles all enrichment results into a final queue item and persists it.',
  instruction: `You assemble enrichment data into a complete queue item.

Read from session state:
- extracted_offer: the structured offer fields
- roster_match: the matched artist
- conflict_report: any date conflicts
- completeness_report: data quality scores

Combine these into a queue item and call save_queue_item to persist it.

Set status to NEEDS_REVIEW by default.
Set recommended_next_action based on completeness and conflicts:
- If missing critical fields: "REQUEST_INFO"
- If has conflicts: "ROUTE"
- Otherwise: "CAPTURE" or "PENCIL"

Generate a unique ID (e.g. "qi_<timestamp>") and set created_at to the current ISO timestamp.`,
  tools: [saveQueueItemTool],
  outputKey: 'queue_item',
});
