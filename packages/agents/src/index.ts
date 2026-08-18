// Default entry: change this to any workflow to switch the `adk run` target
export { rootAgent } from './workflows/inbound-processor.js';

// Re-export runner for API consumption
export { InMemoryRunner } from '@google/adk';
