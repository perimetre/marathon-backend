/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import seed from './seed.json';

console.log('Initializing db...');
const db = new PrismaClient();

const main = async () => {
  let ind = 1;
  for (const module of seed.modules) {
    try {
      console.log(`Updating ${ind} of ${seed.modules.length}: ${module.partNumber}`);

      if (module.partNumber.toLowerCase().startsWith('04-area')) {
        module.shouldHideBasedOnWidth = true;
      }

      if (
        !module.categorySlug?.some((x) => x === 'all') &&
        !module.isEdge &&
        !module.isMat &&
        !module.isExtension &&
        !module.isSubmodule
      )
        module.categorySlug = [
          ...(module.categorySlug && module.categorySlug.length > 0 ? module.categorySlug : []),
          'all'
        ];

      const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
      if (moduleIndex !== -1) {
        seed.modules[moduleIndex] = module;
      } else {
        console.warn(`Module ${module.partNumber} not in seed`);
      }
    } catch (err) {
      console.log('-------------');
      console.error(`ERROR ${ind} of ${seed.modules.length}: ${module.partNumber}`);
      console.error(err);
      console.log('-------------');
    } finally {
      ind++;
    }
  }

  fs.writeFileSync(path.join(__dirname, `./seed.json`), JSON.stringify(seed, null, 2), { flag: 'w' });
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
