import { LlmAgent } from '@google/adk';

import { ClassificationResultSchema } from '../../schemas/offers.js';

export const emailClassifierAgent = new LlmAgent({
  name: 'email_classifier_agent',
  model: 'gemini-2.5-flash',
  description: 'Classifies inbound emails as BOOKING_INQUIRY, NOT_RELEVANT, or AMBIGUOUS.',
  instruction: `You are an expert booking agent classifier. Analyse the inbound email and classify it.

Categories:
- BOOKING_INQUIRY: The email contains a booking offer or show inquiry for an artist
- NOT_RELEVANT: Spam, unrelated, or clearly not a booking inquiry
- AMBIGUOUS: Could be a booking inquiry but lacks enough signal to be certain

Return your classification with a confidence score (0.0–1.0) and brief reasoning.`,
  outputSchema: ClassificationResultSchema,
  outputKey: 'classification',
  disallowTransferToParent: true,
  disallowTransferToPeers: true,
});
