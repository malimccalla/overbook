import { FunctionTool } from '@google/adk';
import { z } from 'zod';

export const saveQueueItemTool = new FunctionTool({
  name: 'save_queue_item',
  description: 'Persists a completed queue item to the database.',
  parameters: z.object({
    id: z.string(),
    source_email_id: z.string(),
    suggested_artist: z.string().nullable(),
    artist_id: z.string().nullable(),
    promoter: z.string().nullable(),
    venue: z.string().nullable(),
    proposed_date: z.string().nullable(),
    city: z.string().nullable(),
    fee: z.string().nullable(),
    status: z.string(),
    confidence: z.number(),
    missing_fields: z.array(z.string()),
    conflict_flags: z.array(z.string()),
    recommended_next_action: z.string(),
    created_at: z.string(),
  }),
  execute: async (queueItem) => {
    // TODO: replace with real DB write
    console.log('[stub] Saving queue item:', queueItem.id);
    return { success: true, id: queueItem.id };
  },
});

export const createBookingTool = new FunctionTool({
  name: 'create_booking',
  description: 'Creates a new booking record from a captured queue item.',
  parameters: z.object({
    queue_item_id: z.string(),
    artist_id: z.string(),
    notes: z.string().optional(),
  }),
  execute: async ({ queue_item_id, artist_id, notes }) => {
    // TODO: replace with real DB write
    const id = `booking_${Date.now()}`;
    console.log('[stub] Creating booking:', id);
    return {
      id,
      queue_item_id,
      artist_id,
      status: 'CAPTURED',
      captured_at: new Date().toISOString(),
      notes: notes ?? '',
    };
  },
});
