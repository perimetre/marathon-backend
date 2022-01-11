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
      const rules = JSON.parse(module.rules);
      if (rules?.extensions?.left) {
        const extension = await db.module.findUnique({ where: { partNumber: rules.extensions.left } });
        if (extension) {
          await db.module.update({
            data: {
              defaultLeftExtensionId: extension.id
            },
            where: {
              partNumber: module.partNumber
            }
          });

          const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
          if (moduleIndex !== -1) {
            (seed.modules[moduleIndex] as any).defaultLeftExtension = rules.extensions.left;
            fs.writeFileSync(path.join(__dirname, `./seed.json`), JSON.stringify(seed, null, 2), { flag: 'w' });
          } else {
            console.warn(`Module ${module.partNumber} not in seed`);
          }
        }
      }

      if (rules?.extensions?.right) {
        const extension = await db.module.findUnique({ where: { partNumber: rules.extensions.right } });
        if (extension) {
          await db.module.update({
            data: {
              defaultRightExtensionId: extension.id
            },
            where: {
              partNumber: module.partNumber
            }
          });

          const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
          if (moduleIndex !== -1) {
            (seed.modules[moduleIndex] as any).defaultRightExtension = rules.extensions.right;
            fs.writeFileSync(path.join(__dirname, `./seed.json`), JSON.stringify(seed, null, 2), { flag: 'w' });
          } else {
            console.warn(`Module ${module.partNumber} not in seed`);
          }
        }
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
