// This is the main entry point for our GraphQL server.

// Import necessary packages
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http'; // Required for WebSocket server

// Imports for WebSocket support
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';


// Import our schema and resolvers
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const startServer = async () => {
  // Create an Express application.
  const app = express();

  // Create an HTTP server. This will be used by both Express and the WebSocket server.
  const httpServer = http.createServer(app);

  // Create a WebSocket server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql', // The path for WebSocket connections, same as our HTTP server.
  });

  // Set up the GraphQL-over-WebSocket server.
  // `useServer` comes from the `graphql-ws` package. It connects our schema
  // with the WebSocket server, enabling real-time communication.
  const serverCleanup = useServer({ schema: { typeDefs, resolvers } }, wsServer);

  // Create a new instance of ApolloServer.
  // We add the `ApolloServerPluginDrainHttpServer` plugin to ensure that the
  // HTTP server, and by extension the WebSocket server, shuts down gracefully.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // This plugin drains the HTTP server when Apollo Server shuts down.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // This plugin handles the cleanup of the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // Start the Apollo Server.
  await server.start();

  // Set up the Express middleware.
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  // Define the port to listen on.
  const PORT = 4000;

  // Start the HTTP server (which now includes WebSocket support).
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
};

// Call the function to start the server.
startServer();
