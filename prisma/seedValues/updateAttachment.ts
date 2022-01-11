/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import seed from './seed.json';

console.log('Initializing db...');
const db = new PrismaClient();

const main = async () => {
  let ind = 1;

  console.log('Fetching data...');
  const modules = await db.module.findMany({
    include: {
      finish: true,
      collection: true,
      moduleCategories: {
        include: {
          category: true
        }
      },
      defaultLeftExtension: true,
      defaultRightExtension: true,
      moduleAttachments: true
    }
  });

  for (const module of modules) {
    try {
      console.log(`Updating ${ind} of ${seed.modules.length}: ${module.partNumber}`);

      const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
      if (moduleIndex < 0) {
        const seedModule = {
          partNumber: module.partNumber,
          bundlePath: module.bundleUrl || undefined,
          finish: module.finish.slug,
          collection: module.collection.slug,
          rules: JSON.stringify(module.rules),
          isSubmodule: module.isSubmodule,
          hasPegs: module.hasPegs,
          isMat: module.isMat,
          isExtension: module.isExtension,
          shouldHideBasedOnWidth: module.shouldHideBasedOnWidth,
          imageUrl: module.thumbnailUrl,
          categorySlug: module.moduleCategories.flatMap((x) => x.category.slug),
          defaultLeftExtension: module.defaultLeftExtension?.partNumber,
          defaultRightExtension: module.defaultRightExtension?.partNumber
        };

        seed.modules.push(seedModule as any);
        fs.writeFileSync(path.join(__dirname, `./seed.json`), JSON.stringify(seed, null, 2), { flag: 'w' });
      }

      const rules = (module.rules as any).rules;

      if (rules.queue?.append && !module.attachmentToAppendId) {
        // const attachmentAppend = await db.module.findUnique({ where: { partNumber: rules.queue.append } });
        await db.module.update({
          data: {
            attachmentToAppend: { connect: { partNumber: rules.queue.append } }
          },
          where: {
            partNumber: module.partNumber
          }
        });

        const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
        if (moduleIndex !== -1) {
          (seed.modules[moduleIndex] as any).attachmentToAppend = rules.queue.append;
        } else {
          console.warn(`Module ${module.partNumber} not in seed`);
        }
      }

      if (rules.queue?.modules && (!module.moduleAttachments || module.moduleAttachments.length <= 0)) {
        const attachments = await db.module.findMany({ where: { partNumber: { in: rules.queue.modules } } });

        const moduleToAttach = await db.module.findUnique({ where: { partNumber: module.partNumber } });

        if (moduleToAttach) {
          await db.moduleAttachments.createMany({
            data: attachments.map((x) => ({
              moduleId: moduleToAttach.id,
              attachmentId: x.id
            }))
          });

          const moduleIndex = seed.modules.findIndex((x) => x.partNumber === module.partNumber);
          if (moduleIndex !== -1) {
            (seed.modules[moduleIndex] as any).moduleAttachments = rules.queue.modules;
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
