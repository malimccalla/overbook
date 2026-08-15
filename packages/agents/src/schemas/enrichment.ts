import { z } from 'zod';

export const ConflictReportSchema = z.object({
  has_conflict: z.boolean(),
  // DATE_CONFLICT | ROUTING_CONCERN | RADIUS_CLAUSE
  conflict_type: z.string().nullable(),
  conflicting_dates: z.array(z.string()),
  routing_concern: z.string().nullable(),
});
export type ConflictReport = z.infer<typeof ConflictReportSchema>;

export const CompletenessReportSchema = z.object({
  overall_confidence: z.number(),
  missing_critical_fields: z.array(z.string()),
  missing_optional_fields: z.array(z.string()),
  flags: z.array(z.string()),
});
export type CompletenessReport = z.infer<typeof CompletenessReportSchema>;

export const CalendarPreviewSchema = z.object({
  artist_id: z.string(),
  proposed_date: z.string(),
  existing_dates: z.array(z.record(z.string(), z.unknown())),
  has_conflict: z.boolean(),
});
export type CalendarPreview = z.infer<typeof CalendarPreviewSchema>;
