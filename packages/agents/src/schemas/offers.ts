import { z } from 'zod';

export const ClassificationResultSchema = z.object({
  category: z.enum(['BOOKING_INQUIRY', 'NOT_RELEVANT', 'AMBIGUOUS']),
  confidence: z.number(),
  reasoning: z.string(),
});
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

export const ExtractedOfferSchema = z.object({
  artist_name: z.string().nullable(),
  promoter: z.string().nullable(),
  venue: z.string().nullable(),
  proposed_date: z.string().nullable(),
  city: z.string().nullable(),
  fee: z.string().nullable(),
  hold_status: z.string().nullable(),
  travel_notes: z.string().nullable(),
  offer_terms: z.array(z.string()),
  missing_fields: z.array(z.string()),
  raw_email_excerpt: z.string(),
});
export type ExtractedOffer = z.infer<typeof ExtractedOfferSchema>;

export const QueueItemStatusSchema = z.enum([
  'NEEDS_REVIEW',
  'DISMISSED',
  'INFO_REQUESTED',
  'ROUTED',
  'CAPTURED',
]);
export type QueueItemStatus = z.infer<typeof QueueItemStatusSchema>;

export const QueueItemSchema = z.object({
  id: z.string(),
  source_email_id: z.string(),
  suggested_artist: z.string().nullable(),
  artist_id: z.string().nullable(),
  promoter: z.string().nullable(),
  venue: z.string().nullable(),
  proposed_date: z.string().nullable(),
  city: z.string().nullable(),
  fee: z.string().nullable(),
  status: QueueItemStatusSchema,
  confidence: z.number(),
  missing_fields: z.array(z.string()),
  conflict_flags: z.array(z.string()),
  recommended_next_action: z.string(),
  created_at: z.string(),
});
export type QueueItem = z.infer<typeof QueueItemSchema>;
