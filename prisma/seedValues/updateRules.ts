/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import seed from './seed.json';

console.log('Initializing db...');
const db = new PrismaClient();

const getFiles = (inpath: string) => {
  const rules: any = [];

  const readF = (file: string, currpath: string) => {
    const newPath = path.join(currpath, file);

    if (fs.existsSync(newPath)) {
      if (fs.statSync(newPath).isDirectory()) {
        fs.readdirSync(newPath).forEach((file) => readF(file, newPath));
      } else if (path.extname(newPath) === '.json') {
        const content = JSON.parse(fs.readFileSync(newPath, { encoding: 'utf8' }));
        rules.push(content);
      }
    }
  };

  if (fs.existsSync(inpath)) {
    fs.readdirSync(inpath).forEach((file) => readF(file, inpath));
  }

  return rules;
};

const main = async () => {
  const rules = ['area', 'autograph', 'imprint'].flatMap((collection) =>
    getFiles(path.join(__dirname, `../modules/${collection}`))
  );

  let ind = 1;
  for (const rule of rules) {
    try {
      console.log(`Updating ${ind} of ${rules.length}: ${rule.partNumber}`);
      await db.module.update({
        data: {
          rules: rule
        },
        where: {
          partNumber: rule.partNumber
        }
      });

      const moduleIndex = seed.modules.findIndex((x) => x.partNumber === rule.partNumber);
      if (moduleIndex !== -1) {
        seed.modules[moduleIndex].rules = JSON.stringify(rule);
        fs.writeFileSync(path.join(__dirname, `./seed.json`), JSON.stringify(seed, null, 2), { flag: 'w' });
      } else {
        console.warn(`Module ${rule.partNumber} not in seed`);
      }
    } catch (err) {
      console.log('-------------');
      console.error(`ERROR ${ind} of ${rules.length}: ${rule.partNumber}`);
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
