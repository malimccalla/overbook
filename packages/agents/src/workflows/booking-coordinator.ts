import { LlmAgent } from '@google/adk';

import { createCalendarPreviewAgent } from '../agents/calendar-preview/agent.js';
import { createDraftReplyAgent } from '../agents/draft-reply/agent.js';
import { statusTrackerAgent } from '../agents/status-tracker/agent.js';

// Collaborative coordinator — delegates to sub-agents via ADK transfer tools
export const rootAgent = new LlmAgent({
  name: 'booking_coordinator',
  model: 'gemini-2.5-flash',
  description: 'Manages the active booking lifecycle by coordinating specialist sub-agents.',
  instruction: `You are Overbook, a professional music booking coordinator.
  
You manage active bookings through their full lifecycle. You have access to three specialist agents:

- calendar_preview_agent: Generate a visual calendar placement for a proposed date
- draft_reply_agent: Draft a professional reply email to a promoter
- status_tracker_agent: Update the status of a booking based on new information

When given a booking to manage:
1. Assess the current state and what action is needed
2. Delegate to the appropriate sub-agent
3. Summarise the outcome and recommend the next step

Always be proactive about flagging conflicts, missing information, or decisions that require human review.`,
  subAgents: [createCalendarPreviewAgent(), createDraftReplyAgent(), statusTrackerAgent],
});
