import { FunctionTool } from '@google/adk';
import { db } from '@overbook/db';
import { z } from 'zod';

export const saveBookingRequestTool = new FunctionTool({
  name: 'save_booking_request',
  description: 'Persists a completed booking request to the database.',
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
    status: z.string().default('PENDING_REVIEW'),
    missing_fields: z.array(z.string()),
    conflict_flags: z.array(z.string()),
    details: z.record(z.unknown()).optional().describe('Extra extracted fields'),
    raw_email_id: z.string().nullable().optional(),
  }),
  execute: async (params) => {
    const request = await db.bookingRequest.create({
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

    return { success: true, id: request.id };
  },
});

export const createBookingTool = new FunctionTool({
  name: 'create_booking',
  description: 'Creates a new booking record from a captured booking request.',
  parameters: z.object({
    booking_request_id: z.string(),
    artist_id: z.string(),
    notes: z.string().optional(),
  }),
  execute: async ({ booking_request_id, artist_id, notes }) => {
    const booking = await db.booking.create({
      data: {
        bookingRequestId: booking_request_id,
        artistId: artist_id,
        organizationId: (await db.bookingRequest.findUniqueOrThrow({ where: { id: booking_request_id } })).organizationId,
        status: 'CAPTURED',
        notes: notes ?? '',
      },
    });

    await db.bookingRequest.update({
      where: { id: booking_request_id },
      data: { status: 'CAPTURED' },
    });

    return { success: true, id: booking.id };
  },
});
