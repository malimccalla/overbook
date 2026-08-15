import { LlmAgent } from '@google/adk';

import { CompletenessReportSchema } from '../../../schemas/enrichment.js';

export const completenessScorerAgent = new LlmAgent({
  name: 'completeness_scorer_agent',
  model: 'gemini-2.5-flash',
  description: 'Scores the data quality and completeness of an extracted booking offer.',
  instruction: `You score the completeness and quality of extracted booking offers.

Review the extracted_offer from session state and produce a completeness report:
- overall_confidence: 0.0–1.0 score reflecting data quality and completeness
- missing_critical_fields: Required fields that are absent (date, venue, fee are critical)
- missing_optional_fields: Nice-to-have absent fields (travel, hold status, etc.)
- flags: Any quality concerns such as vague terms, inconsistencies, or ambiguous data

Score 1.0 only if all critical fields are present and unambiguous.`,
  outputSchema: CompletenessReportSchema,
  outputKey: 'completeness_report',
  disallowTransferToParent: true,
  disallowTransferToPeers: true,
});
