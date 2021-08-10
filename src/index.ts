import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { env } from './env';
import routes from './routes';
import schema from './schema';
import { ApolloServer } from 'apollo-server-express';
import { Context } from './typings/context';
import logging from './utils/logging';
import { getDb } from './database';

// Helpers
const normalizePort = (val: string): number => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return 3001;
  }
  if (port >= 0) {
    return port;
  }
  return 3001;
};

const main = async () => {
  try {
    const prisma = getDb();

    const server = new ApolloServer({
      schema,
      // playground: env.NODE_ENV === 'development',
      // tracing: env.NODE_ENV === 'development',
      context: async (prevContext) => {
        const context: Context = {
          ...prevContext,
          prisma
        };

        return context;
      }
    });
    await server.start();

    // App
    const app = express();

    server.applyMiddleware({
      app,
      bodyParserConfig: { limit: '20mb' },
      cors: {
        origin:
          /*env.NODE_ENV === 'development' ? */ /.*/ /* : getAllowedOrigins().map((url) => `${url.protocol}//${url.host}`)*/,
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'ignoreas'],
        maxAge: 86400, // 1 day
        credentials: true
      }
    });

    app.use(
      cors({
        origin:
          /*env.NODE_ENV === 'development' ? */ /.*/ /* : getAllowedOrigins().map((url) => `${url.protocol}//${url.host}`) */,
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'ignoreas'],
        maxAge: 86400, // 1 day
        credentials: true
      })
    );
    app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
    app.use(bodyParser.json({ limit: '20mb' }));

    // Initializing routes
    app.use(routes);

    // Server start
    const port = normalizePort(env.PORT);

    await new Promise<void>((resolve) => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}`);
  } catch (error) {
    logging.error(error);
    process.exit(1);
  }
};

main();
