import { LlmAgent } from '@google/adk';

import { getArtistCalendarTool } from '../../tools/calendar-tools.js';

export function createCalendarPreviewAgent() {
  return new LlmAgent({
    name: 'calendar_preview_agent',
  model: 'gemini-2.5-flash',
  description: 'Generates a calendar placement preview for a proposed booking date.',
  instruction: `You generate calendar previews for booking proposals.

Read the artist_id and proposed_date from session state (queue_item or booking).
Use the get_artist_calendar tool to fetch existing bookings for that artist.

Return a structured preview showing:
- The artist ID and proposed date
- All existing booked dates
- Whether the proposed date has a conflict`,
    // outputSchema omitted: combining outputSchema + tools requires Gemini 3.0+
    tools: [getArtistCalendarTool],
    outputKey: 'calendar_preview',
  });
}
