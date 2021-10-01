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
        let context: Context = {
          ...prevContext,
          prisma,
          locale: env.DEFAULT_LOCALE,
          platform: env.DEFAULT_PLATFORM
        };

        try {
          const auth = context.req.get('Authorization');
          // Validate the auth string
          if (auth && auth.includes('Bearer')) {
            // If has the Bearer word, split by spaces
            const splitAuth = auth.split(' ');

            // Must be exactly 2, the bearer word and the token
            if (splitAuth && splitAuth.length === 2) {
              // Get the second one(the token)
              const bearer = splitAuth[1];
              context = { ...context, bearer };
            }
          }
        } catch (error) {
          // Do nothing, because it wasn't authorized(the token is expired or wrong)
        }

        const locale = context.req.get('Locale');

        if (locale) {
          context = { ...context, locale };
        }

        const platform = context.req.get('Platform');

        if (platform) {
          context = { ...context, platform };
        }

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
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'Platform', 'Locale'],
        maxAge: 86400, // 1 day
        credentials: true
      }
    });

    app.use(
      cors({
        origin:
          /*env.NODE_ENV === 'development' ? */ /.*/ /* : getAllowedOrigins().map((url) => `${url.protocol}//${url.host}`) */,
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'Platform', 'Locale'],
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
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  } catch (error) {
    logging.error(error);
    process.exit(1);
  }
};

main();
