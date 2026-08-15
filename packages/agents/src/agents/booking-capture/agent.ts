import { LlmAgent } from '@google/adk';

import { createBookingTool } from '../../tools/booking-tools.js';

export function createBookingCaptureAgent() {
  return new LlmAgent({
    name: 'booking_capture_agent',
  model: 'gemini-2.5-flash',
  description: 'Creates a Booking record from a captured or pencilled queue item.',
  instruction: `You capture bookings from queue items.

Read the queue_item from session state.
Use the create_booking tool to create a new booking record.
Pass the queue_item_id, artist_id, and any relevant notes.

The initial booking status will be set to CAPTURED.`,
    tools: [createBookingTool],
    outputKey: 'booking',
  });
}
