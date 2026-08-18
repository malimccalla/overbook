import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { BookingRequestRef } from '../booking-request/types.js';
import { EmailIntakeService } from './service.js';

builder.mutationField('processEmail', (t) =>
  t.field({
    type: BookingRequestRef,
    nullable: true,
    args: {
      emailText: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.orgId) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const service = new EmailIntakeService();
      return service.processEmail(ctx.orgId, args.emailText);
    },
  }),
);
