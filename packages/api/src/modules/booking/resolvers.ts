import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { BookingService } from './service.js';
import { BookingRef } from './types.js';

builder.queryField('bookings', (t) =>
  t.field({
    type: [BookingRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingService();
      return service.list(ctx.orgId!);
    },
  }),
);

builder.queryField('booking', (t) =>
  t.field({
    type: BookingRef,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingService();
      return service.getById(ctx.orgId!, args.id);
    },
  }),
);

builder.mutationField('createBooking', (t) =>
  t.field({
    type: BookingRef,
    args: { bookingRequestId: t.arg.string({ required: true }) },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new BookingService();
      return service.createFromRequest(ctx.orgId!, args.bookingRequestId);
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
