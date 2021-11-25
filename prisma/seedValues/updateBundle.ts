import { PrismaClient } from '@prisma/client';
import bundles from './bundles.json';

const db = new PrismaClient();

const main = async () => {
  let ind = 1;
  for (const mod of bundles.list) {
    try {
      console.log(`Updating ${ind} of ${bundles.list.length}: ${mod.partNumber}`);
      await db.module.update({
        data: {
          bundleUrl: mod.bundlePath
        },
        where: {
          partNumber: mod.partNumber
        }
      });
    } catch (err) {
      console.log('-------------');
      console.error(`ERROR ${ind} of ${bundles.list.length}: ${mod.partNumber}`);
      console.error(err);
      console.log('-------------');
    } finally {
      ind++;
    }
  }
};

let error = false;

main()
  .catch((e) => {
    console.error(e);
    error = true;
  })
  .finally(async () => {
    await db.$disconnect();
    if (error) process.exit(1);
  });
