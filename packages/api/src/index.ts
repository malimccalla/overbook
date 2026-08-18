import http from 'http';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { db } from '@overbook/db';
import cors from 'cors';
import express from 'express';

import type { ApiContext } from './graphql/context.js';
import { schema } from './graphql/schema.js';
import { clerkWebhookHandler } from './webhooks/clerk.js';

const app = express();
const httpServer = http.createServer(app);

// Webhook route needs raw body — must come before any body parsers
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhookHandler);

// Clerk middleware extracts auth from Bearer token
app.use(clerkMiddleware());

const server = new ApolloServer<ApiContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<ApiContext> => {
      const auth = getAuth(req);
      let orgId: string | null = null;

      if (auth.orgId) {
        const org = await db.organization.findUnique({ where: { clerkOrgId: auth.orgId } });
        orgId = org?.id ?? null;
      }

      return {
        db,
        userId: auth.userId ?? null,
        orgId,
      };
    },
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('API ready at http://localhost:4000/graphql');
