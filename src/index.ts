import cors from 'cors';
import express from 'express';
import { env } from './env';
import routes from './routes';

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
    // App
    const app = express();

    app.use(
      cors({
        origin:
          /*env.NODE_ENV === 'development' ? */ /.*/ /* : getAllowedOrigins().map((url) => `${url.protocol}//${url.host}`) */,
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', 'ignoreas'],
        maxAge: 86400, // 1 day
        credentials: true
      })
    );

    // Initializing routes
    app.use(routes);

    // Server start
    const port = normalizePort(env.PORT);

    await new Promise<void>((resolve) => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}`);
  } catch (error) {
    // logging.error(error);
    process.exit(1);
  }
};

main();
