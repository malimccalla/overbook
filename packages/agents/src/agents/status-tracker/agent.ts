import { LlmAgent } from '@google/adk';
import { z } from 'zod';

import { BookingStatusSchema } from '../../schemas/bookings.js';

export const statusTrackerAgent = new LlmAgent({
  name: 'status_tracker_agent',
  model: 'gemini-2.5-flash',
  description: 'Updates booking status fields based on current lifecycle state.',
  instruction: `You manage booking status transitions.

Review the current booking context and determine the appropriate status transition.

Valid statuses and their meanings:
- CAPTURED: Initial state when a booking is created
- AWAITING_REPLY: Waiting for a response from the promoter
- IN_NEGOTIATION: Actively negotiating terms
- PENCILLED: Tentatively agreed, awaiting confirmation
- AWAITING_ARTIST: Waiting for artist confirmation or availability
- AWAITING_PROMOTER: Waiting for promoter to confirm or sign
- CONTRACT_REQUESTED: Contract has been requested
- CONTRACT_RECEIVED: Contract has been received and is under review
- CONFIRMED: Booking is fully confirmed
- LOST: Booking did not proceed

Return the booking ID, the new status, and the reason for the transition.`,
  outputSchema: z.object({
    booking_id: z.string(),
    new_status: BookingStatusSchema,
    reason: z.string(),
  }),
  outputKey: 'status_update',
  disallowTransferToParent: true,
  disallowTransferToPeers: true,
});
