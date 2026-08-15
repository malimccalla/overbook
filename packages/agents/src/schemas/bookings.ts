import { z } from 'zod';

export const BookingStatusSchema = z.enum([
  'CAPTURED',
  'AWAITING_REPLY',
  'IN_NEGOTIATION',
  'PENCILLED',
  'AWAITING_ARTIST',
  'AWAITING_PROMOTER',
  'CONTRACT_REQUESTED',
  'CONTRACT_RECEIVED',
  'CONFIRMED',
  'LOST',
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  queue_item_id: z.string(),
  artist_id: z.string(),
  promoter: z.string().nullable(),
  venue: z.string().nullable(),
  date: z.string().nullable(),
  city: z.string().nullable(),
  fee: z.string().nullable(),
  status: BookingStatusSchema,
  notes: z.string(),
  captured_at: z.string(),
});
export type Booking = z.infer<typeof BookingSchema>;
