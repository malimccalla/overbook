import { FunctionTool } from '@google/adk';
import { db } from '@overbook/db';
import { z } from 'zod';

export const saveBookingTool = new FunctionTool({
  name: 'save_booking',
  description: 'Persists a completed booking to the database.',
  parameters: z.object({
    organization_id: z.string(),
    artist_id: z.string().nullable().describe('Matched artist ID from roster lookup'),
    suggested_artist_name: z.string().nullable(),
    promoter_name: z.string().nullable(),
    venue: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    proposed_date: z.string().nullable().describe('ISO 8601 date'),
    fee_amount: z.number().nullable(),
    currency_code: z.string().nullable().describe('e.g. GBP, EUR, USD'),
    raw_fee: z.string().nullable().describe('Original fee text from email'),
    missing_fields: z.array(z.string()),
    conflict_flags: z.array(z.string()),
    details: z.record(z.unknown()).optional().describe('Extra extracted fields'),
    raw_email_id: z.string().nullable().optional(),
  }),
  execute: async (params) => {
    const booking = await db.booking.create({
      data: {
        organizationId: params.organization_id,
        artistId: params.artist_id,
        promoter: params.promoter_name,
        venue: params.venue,
        city: params.city,
        country: params.country,
        proposedDate: params.proposed_date ? new Date(params.proposed_date) : null,
        feeAmount: params.fee_amount,
        currencyCode: params.currency_code ?? 'GBP',
        rawFee: params.raw_fee,
        status: 'NEEDS_REVIEW',
        missingFields: params.missing_fields,
        conflictFlags: params.conflict_flags,
        details: params.details ?? {},
        rawEmailId: params.raw_email_id ?? null,
      },
    });

    return { success: true, id: booking.id };
  },
});
