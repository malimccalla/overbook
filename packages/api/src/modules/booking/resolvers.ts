import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { BookingRequestService } from './service.js';
import { BookingRef } from './types.js';

const BookingStatusEnum = builder.enumType('BookingStatus', {
  values: ['INBOX', 'NEEDS_REVIEW', 'PENCILLED', 'SENT_TO_ARTIST', 'APPROVED', 'CONFIRMED', 'CONTRACTED', 'DECLINED', 'LOST'] as const,
});

builder.queryField('bookings', (t) =>
  t.field({
    type: [BookingRef],
    args: {
      status: t.arg({ type: BookingStatusEnum, required: false }),
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

builder.queryField('booking', (t) =>
  t.field({
    type: BookingRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.getById(ctx.orgId!, args.id);
    },
  }),
);

builder.queryField('bookingCount', (t) =>
  t.int({
    args: {
      status: t.arg({ type: BookingStatusEnum, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.count(ctx.orgId!, args.status ?? undefined);
    },
  }),
);

builder.mutationField('updateBookingStatus', (t) =>
  t.field({
    type: BookingRef,
    args: {
      id: t.arg.string({ required: true }),
      status: t.arg({ type: BookingStatusEnum, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingRequestService();
      return service.updateStatus(ctx.orgId!, args.id, args.status);
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
