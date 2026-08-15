import { type BaseAgent, LlmAgent, RoutedAgent, SequentialAgent } from '@google/adk';
import type { InvocationContext } from '@google/adk';

import { createBookingCaptureAgent } from '../agents/booking-capture/agent.js';
import { createCalendarPreviewAgent } from '../agents/calendar-preview/agent.js';
import { createDraftReplyAgent } from '../agents/draft-reply/agent.js';

// Validates the requested action before routing
const validateActionAgent = new LlmAgent({
  name: 'validate_action_agent',
  model: 'gemini-2.5-flash',
  description: 'Validates that the requested action is a legal state transition.',
  instruction: `You validate queue item actions before they are executed.

Read the queue_item and requested_action from session state.
Confirm the action is valid for the current queue item status.
Valid actions: CAPTURE, PENCIL, REQUEST_INFO, DISMISS, ROUTE.

Store the validated action as selected_action in your response.`,
  outputKey: 'selected_action',
});

// Each RoutedAgent key needs its own agent instance (ADK enforces single-parent)
const captureFlow = new SequentialAgent({
  name: 'capture_flow',
  description: 'Captures a booking and generates a calendar preview.',
  subAgents: [createBookingCaptureAgent(), createCalendarPreviewAgent()],
});

const pencilFlow = new SequentialAgent({
  name: 'pencil_flow',
  description: 'Pencils a booking and generates a calendar preview.',
  subAgents: [createBookingCaptureAgent(), createCalendarPreviewAgent()],
});

// Routes the action to the appropriate handler
const actionRouter = new RoutedAgent({
  name: 'action_router',
  description: 'Routes a queue action to the appropriate handler.',
  agents: {
    capture: captureFlow,
    pencil: pencilFlow,
    request_info: createDraftReplyAgent(),
    dismiss: new LlmAgent({
      name: 'dismiss_queue_item_agent',
      model: 'gemini-2.5-flash',
      description: 'Marks a queue item as dismissed.',
      instruction: 'Mark the queue item in session state as DISMISSED. Confirm the dismissal.',
    }),
    route: new LlmAgent({
      name: 'route_to_desk_agent',
      model: 'gemini-2.5-flash',
      description: 'Routes a queue item to a team member.',
      instruction: 'Route the queue item from session state to the appropriate team desk. Confirm routing.',
    }),
  },
  router: (_agents: Readonly<Record<string, BaseAgent>>, context: InvocationContext) => {
    const action = context.session.state['selected_action'] as string | undefined;
    return action?.toLowerCase() ?? 'request_info';
  },
});

// TODO (ADK 2.0): replace SequentialAgent + RoutedAgent with Workflow graph edges
export const rootAgent = new SequentialAgent({
  name: 'overbook_queue_action_workflow',
  description: 'Handles agent actions on queue items: validate → route → execute.',
  subAgents: [validateActionAgent, actionRouter],
});
