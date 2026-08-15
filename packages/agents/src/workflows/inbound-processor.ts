import { type BaseAgent, LlmAgent, ParallelAgent, RoutedAgent, SequentialAgent } from '@google/adk';
import type { InvocationContext } from '@google/adk';

import { assemblerAgent } from '../agents/assembler/agent.js';
import { emailClassifierAgent } from '../agents/email-classifier/agent.js';
import { completenessScorerAgent } from '../agents/enrichment/completeness-scorer/agent.js';
import { conflictDetectorAgent } from '../agents/enrichment/conflict-detector/agent.js';
import { rosterMatcherAgent } from '../agents/enrichment/roster-matcher/agent.js';
import { fieldExtractorAgent } from '../agents/field-extractor/agent.js';
import type { ClassificationResult } from '../schemas/offers.js';

// Runs field extraction → parallel enrichment → assembly
const fieldExtractionPipeline = new SequentialAgent({
  name: 'field_extraction_pipeline',
  description: 'Extracts offer fields and runs parallel enrichment before assembly.',
  subAgents: [
    fieldExtractorAgent,
    // TODO (ADK 2.0): replace with JoinNode-backed parallel fan-out
    new ParallelAgent({
      name: 'enrichment_parallel',
      description: 'Runs roster matching, conflict detection, and completeness scoring in parallel.',
      subAgents: [rosterMatcherAgent, conflictDetectorAgent, completenessScorerAgent],
    }),
    assemblerAgent,
  ],
});

// Routes NOT_RELEVANT emails to dismissal; all others proceed to enrichment
const classifyRouter = new RoutedAgent({
  name: 'classify_router',
  description: 'Routes emails based on classification result.',
  agents: {
    enrich: fieldExtractionPipeline,
    dismiss: new LlmAgent({
      name: 'dismiss_agent',
      model: 'gemini-2.5-flash',
      description: 'Marks an email as not relevant and ends processing.',
      instruction: 'The email has been classified as NOT_RELEVANT. Confirm it has been dismissed.',
    }),
  },
  router: (_agents: Readonly<Record<string, BaseAgent>>, context: InvocationContext) => {
    const result = context.session.state['classification'] as ClassificationResult | undefined;
    return result?.category === 'NOT_RELEVANT' ? 'dismiss' : 'enrich';
  },
});

// TODO (ADK 2.0): replace SequentialAgent + RoutedAgent with Workflow graph edges
export const rootAgent = new SequentialAgent({
  name: 'overbook_inbound_workflow',
  description: 'Processes inbound booking emails: classify → extract → enrich → queue.',
  subAgents: [emailClassifierAgent, classifyRouter],
});
