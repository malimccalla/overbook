import { GraphQLError } from 'graphql';

import { builder } from '../../graphql/builder.js';
import { ArtistRef } from '../booking-request/types.js';
import { ArtistService } from './service.js';

builder.queryField('artists', (t) =>
  t.field({
    type: [ArtistRef],
    resolve: async (_root, _args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new ArtistService();
      return service.list(ctx.orgId!);
    },
  }),
);

builder.mutationField('createArtist', (t) =>
  t.field({
    type: ArtistRef,
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, ctx) => {
      requireAuth(ctx.orgId);
      const service = new ArtistService();
      return service.create(ctx.orgId!, { name: args.name });
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
