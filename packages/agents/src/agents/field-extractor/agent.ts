import { LlmAgent } from '@google/adk';

import { ExtractedOfferSchema } from '../../schemas/offers.js';

export const fieldExtractorAgent = new LlmAgent({
  name: 'field_extractor_agent',
  model: 'gemini-2.5-flash',
  description: 'Extracts structured offer fields from a booking inquiry email.',
  instruction: `You extract structured booking offer data from emails.

Extract all available fields:
- artist_name: The artist being inquired about
- promoter: The promoter or organiser name
- venue: The venue name
- proposed_date: The proposed show date in ISO 8601 format (YYYY-MM-DD)
- city: The city of the show
- fee: The proposed fee (preserve original currency and format)
- hold_status: Any hold or pencil status mentioned
- travel_notes: Travel or accommodation details
- offer_terms: Any specific deal terms as a list
- missing_fields: Field names that are absent from the email
- raw_email_excerpt: The most relevant excerpt from the email (max 500 chars)

Extract only what is explicitly stated. Use null for missing fields.`,
  outputSchema: ExtractedOfferSchema,
  outputKey: 'extracted_offer',
  disallowTransferToParent: true,
  disallowTransferToPeers: true,
});
