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
import { nylasCallback, nylasConnect } from './routes/nylas-auth.js';
import { clerkWebhookHandler } from './webhooks/clerk.js';
import { nylasWebhookChallenge, nylasWebhookHandler } from './webhooks/nylas.js';

const app = express();
const httpServer = http.createServer(app);

// Webhook routes need raw body — must come before any body parsers
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhookHandler);
app.get('/webhooks/nylas', nylasWebhookChallenge);
app.post('/webhooks/nylas', express.raw({ type: 'application/json' }), nylasWebhookHandler);

// Clerk middleware extracts auth from Bearer token
app.use(clerkMiddleware());

// Nylas OAuth routes
app.get('/auth/nylas/connect', nylasConnect);
app.get('/auth/nylas/callback', nylasCallback);

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
