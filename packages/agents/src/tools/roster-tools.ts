import { FunctionTool } from '@google/adk';
import { z } from 'zod';

export const lookupRosterTool = new FunctionTool({
  name: 'lookup_roster',
  description: 'Looks up an artist on the roster by name and returns match details.',
  parameters: z.object({
    artist_name: z.string().describe('The artist name to search for'),
  }),
  execute: async ({ artist_name }) => {
    // TODO: replace with real DB lookup
    return {
      matched_artist_id: null,
      matched_artist_name: artist_name,
      confidence: 0.0,
      alternatives: [],
    };
  },
});
