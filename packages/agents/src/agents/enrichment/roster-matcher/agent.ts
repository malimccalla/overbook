import { LlmAgent } from '@google/adk';

import { lookupRosterTool } from '../../../tools/roster-tools.js';

export const rosterMatcherAgent = new LlmAgent({
  name: 'roster_matcher_agent',
  model: 'gemini-2.5-flash',
  description: 'Matches the extracted offer to an artist on the roster.',
  instruction: `You match booking offers to artists on the roster.

Read the artist_name from the extracted_offer in session state.
Read organization_id from session state.

Call the lookup_roster tool with both artist_name and organization_id.
Store the result including confidence and any alternative matches.`,
  tools: [lookupRosterTool],
  outputKey: 'roster_match',
});
