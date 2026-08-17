import { FunctionTool } from '@google/adk';
import { db } from '@overbook/db';
import { z } from 'zod';

export const lookupRosterTool = new FunctionTool({
  name: 'lookup_roster',
  description: 'Looks up an artist on the roster by name and returns match details.',
  parameters: z.object({
    artist_name: z.string().describe('The artist name to search for'),
    organization_id: z.string().optional().describe('The organization ID to scope the search'),
  }),
  execute: async ({ artist_name, organization_id }) => {
    const hint = artist_name.toLowerCase();
    const artists = await db.artist.findMany({
      where: organization_id ? { organizationId: organization_id } : {},
    });

    const scored = artists
      .map((a) => {
        const names = [a.name, ...a.aliases].map((n) => n.toLowerCase());
        const exact = names.some((n) => n === hint);
        const partial = names.some((n) => n.includes(hint) || hint.includes(n));
        const confidence = exact ? 1.0 : partial ? 0.7 : 0;
        return { artist: a, confidence };
      })
      .filter((s) => s.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence);

    const best = scored[0];
    return {
      matched_artist_id: best?.artist.id ?? null,
      matched_artist_name: best?.artist.name ?? null,
      confidence: best?.confidence ?? 0,
      alternatives: scored.slice(1, 4).map((s) => ({
        id: s.artist.id,
        name: s.artist.name,
        confidence: s.confidence,
      })),
    };
  },
});
