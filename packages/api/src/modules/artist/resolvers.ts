import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { ArtistRef } from '../booking-request/types.js';
import { ArtistService } from './service.js';

builder.queryField('artists', (t) =>
  t.field({
    type: [ArtistRef],
    resolve: async (_root, _args, ctx) => {
      if (!ctx.orgId) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const service = new ArtistService();
      return service.list(ctx.orgId);
    },
  }),
);
