import { LlmAgent } from '@google/adk';

import { saveBookingRequestTool } from '../../tools/booking-tools.js';

export const assemblerAgent = new LlmAgent({
  name: 'queue_item_assembler_agent',
  model: 'gemini-2.5-flash',
  description: 'Assembles all enrichment results into a final booking request and persists it.',
  instruction: `You assemble enrichment data into a complete booking request.

Read from session state:
- extracted_offer: the structured offer fields
- roster_match: the matched artist
- conflict_report: any date conflicts
- completeness_report: data quality scores
- organization_id: the organization this request belongs to

Combine these into a booking request and call save_booking_request to persist it.

IMPORTANT: You MUST pass organization_id from session state when calling save_booking_request.

Map the extracted fields:
- promoter_name: from extracted_offer.promoter or extracted_offer.promoter_name
- suggested_artist_name: from extracted_offer.artist or extracted_offer.artist_name
- artist_id: from roster_match.matched_artist_id (may be null)
- venue, city, country: from extracted_offer
- proposed_date: ISO 8601 date from extracted_offer
- fee_amount: numeric fee in minor units (pence/cents) if available
- currency_code: e.g. GBP, EUR, USD
- raw_fee: the original fee text
- missing_fields: list of fields that could not be extracted
- conflict_flags: from conflict_report

Set status to NEEDS_REVIEW.`,
  tools: [saveBookingRequestTool],
  outputKey: 'queue_item',
});
