import { PrismaClient } from '@prisma/client';
import { env } from '../env';

const initDb = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' && env.PRISMA_LOG_QUERY === 'true' ? ['query', 'info', 'warn'] : ['info', 'warn']
  });

let dbInstance: ReturnType<typeof initDb> | undefined;

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = initDb();
  }

  return dbInstance;
};
