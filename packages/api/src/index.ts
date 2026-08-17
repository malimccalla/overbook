import http from 'http';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express from 'express';

import { clerkWebhookHandler } from './webhooks/clerk.js';

const typeDefs = `#graphql
  type Query {
    health: String
  }
`;

const resolvers = {
  Query: {
    health: () => 'ok',
  },
};

const app = express();
const httpServer = http.createServer(app);

// Webhook route needs raw body for signature verification
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhookHandler);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('API ready at http://localhost:4000/graphql');
