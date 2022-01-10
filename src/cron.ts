import { PrismaClient } from '@prisma/client';
import * as cron from 'node-cron';
import { marathonService } from './services/marathon';
import logging from './utils/logging';

const scheduleJobs = async (prisma: PrismaClient): Promise<void> => {
  const daily = '0 4 * * *';

  const marathon = marathonService({ db: prisma });
  // await marathon.syncData();

  // cron.schedule(daily, async () => {
  //   console.log(`Daily job (${daily}) `);
  //   try {
  //     await marathon.syncData();
  //   } catch (error) {
  //     logging.error(error, 'Daily cronjob has failed.');
  //   }
  // });

  console.log('All jobs scheduled');
};

export default scheduleJobs;
