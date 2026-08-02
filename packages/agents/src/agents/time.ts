import { LlmAgent } from '@google/adk';

export const timeAgent = new LlmAgent({
  name: 'time_agent',
  model: 'gemini-2.5-flash',
  description: 'Returns the current UTC time.',
  instruction: 'You are a time agent. Return the current UTC time and nothing else.',
});
