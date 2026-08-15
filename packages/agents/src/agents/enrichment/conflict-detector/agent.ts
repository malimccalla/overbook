import { LlmAgent } from '@google/adk';

import { checkCalendarTool } from '../../../tools/calendar-tools.js';

export const conflictDetectorAgent = new LlmAgent({
  name: 'conflict_detector_agent',
  model: 'gemini-2.5-flash',
  description: 'Checks for date conflicts against the artist calendar.',
  instruction: `You detect booking conflicts for artists.

Read the artist_id from roster_match and proposed_date from extracted_offer in session state.
Use the check_calendar tool to identify any conflicts.

Report:
- has_conflict: whether a conflict exists
- conflict_type: DATE_CONFLICT, ROUTING_CONCERN, or RADIUS_CLAUSE
- conflicting_dates: any dates in conflict
- routing_concern: description of any routing issue`,
  tools: [checkCalendarTool],
  outputKey: 'conflict_report',
});
