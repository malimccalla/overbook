import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { BookingRequestService } from './service.js';
import { BookingRequestRef } from './types.js';

const BookingRequestStatusEnum = builder.enumType('BookingRequestStatus', {
  values: ['NEEDS_REVIEW', 'DISMISSED', 'INFO_REQUESTED', 'CAPTURED'] as const,
});

// -- Queries --

builder.queryField('bookingRequests', (t) =>
  t.field({
    type: [BookingRequestRef],
    args: {
      status: t.arg({ type: BookingRequestStatusEnum, required: false }),
      limit: t.arg.int({ required: false }),
      offset: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.list(ctx.orgId!, {
        status: args.status ?? undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });
    },
  }),
);

builder.queryField('bookingRequest', (t) =>
  t.field({
    type: BookingRequestRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.getById(ctx.orgId!, args.id);
    },
  }),
);

builder.queryField('bookingRequestCount', (t) =>
  t.int({
    args: {
      status: t.arg({ type: BookingRequestStatusEnum, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.count(ctx.orgId!, args.status ?? undefined);
    },
  }),
);

// -- Mutations --

builder.mutationField('dismissBookingRequest', (t) =>
  t.field({
    type: BookingRequestRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.dismiss(ctx.orgId!, args.id);
    },
  }),
);

function requireAuth(orgId: string | null): asserts orgId is string {
  if (!orgId) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}
