import { PrismaClient } from '@prisma/client';
import * as cron from 'node-cron';
import { env } from './env';
import { marathonService } from './services/marathon';
import logging from './utils/logging';

const scheduleJobs = async (prisma: PrismaClient): Promise<void> => {
  const { MARATHON_API_SYNC } = env;

  const daily = '0 4 * * *';

  const marathon = marathonService({ db: prisma });
  if (MARATHON_API_SYNC === 'true') {
    marathon.syncData();
  }

  cron.schedule(
    daily,
    async () => {
      console.log(`Daily job (${daily})`);

      if (MARATHON_API_SYNC === 'true') {
        try {
          await marathon.syncData();
        } catch (error) {
          logging.error(error, 'Daily cronjob has failed.');
        }
      }
    },
    {
      scheduled: true,
      timezone: 'America/Montreal'
    }
  );

  console.log('All jobs scheduled');
};

export default scheduleJobs;
