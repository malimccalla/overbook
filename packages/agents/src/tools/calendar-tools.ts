import { FunctionTool } from '@google/adk';
import { db } from '@overbook/db';
import { z } from 'zod';

export const checkCalendarTool = new FunctionTool({
  name: 'check_calendar',
  description: 'Checks if an artist has a conflict on a proposed date by looking at existing bookings and booking requests within ±14 days.',
  parameters: z.object({
    artist_id: z.string(),
    proposed_date: z.string().describe('Proposed show date in ISO 8601 format'),
  }),
  execute: async ({ artist_id, proposed_date }) => {
    const date = new Date(proposed_date);
    const windowStart = new Date(date.getTime() - 14 * 86400000);
    const windowEnd = new Date(date.getTime() + 14 * 86400000);

    const nearbyBookings = await db.booking.findMany({
      where: {
        artistId: artist_id,
        proposedDate: { gte: windowStart, lte: windowEnd },
        status: { notIn: ['DECLINED', 'LOST'] },
      },
      select: { id: true, proposedDate: true, venue: true, city: true, status: true },
    });

    const exactConflict = nearbyBookings.some(
      (b) => b.proposedDate && b.proposedDate.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    );

    return {
      has_conflict: exactConflict,
      conflict_type: exactConflict ? 'EXACT_DATE' : nearbyBookings.length > 0 ? 'NEARBY' : null,
      nearby_bookings: nearbyBookings.map((b) => ({
        id: b.id,
        date: b.proposedDate?.toISOString(),
        venue: b.venue,
        city: b.city,
        status: b.status,
      })),
    };
  },
});

export const getArtistCalendarTool = new FunctionTool({
  name: 'get_artist_calendar',
  description: 'Returns all existing bookings for an artist.',
  parameters: z.object({
    artist_id: z.string(),
  }),
  execute: async ({ artist_id }) => {
    const bookings = await db.booking.findMany({
      where: { artistId: artist_id, status: { notIn: ['DECLINED', 'LOST'] } },
      select: { id: true, proposedDate: true, venue: true, city: true, status: true },
      orderBy: { proposedDate: 'asc' },
    });

    return { bookings };
  },
});
