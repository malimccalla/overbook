import { z } from 'zod';

export const RosterMatchSchema = z.object({
  matched_artist_id: z.string().nullable(),
  matched_artist_name: z.string().nullable(),
  confidence: z.number(),
  alternatives: z.array(z.record(z.string(), z.unknown())),
});
export type RosterMatch = z.infer<typeof RosterMatchSchema>;
