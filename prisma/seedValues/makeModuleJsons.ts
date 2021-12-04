/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { uniqBy } from 'lodash';

console.log('Initializing db...');
const db = new PrismaClient();

const deep = [
  '04-PEGBOARD-BIR-H',
  '04-PEGBOARD-BIR-J',
  '04-PEGBOARD-BIR-L',
  '04-PEGBOARD-BIR-N',
  '04-PEGBOARD-WAL-H',
  '04-PEGBOARD-WAL-J',
  '04-PEGBOARD-WAL-L',
  '04-PEGBOARD-WAL-N',
  '04-PEG-BIR-H160',
  '04-PEG-WAL-H160',
  '04-AU-BIR-CD-B',
  '04-AU-WAL-CD-B',
  '04-AU-WAL-KH-B',
  '04-AU-BIR-KH-B',
  '04-AU-BIR-FLUTTED-B',
  '04-AU-WAL-FLUTTED-B',
  '04-AU-BIR-SLOTTED-B',
  '04-AU-WAL-SLOTTED-B',
  '04-AU-BIR-DIVIDER-H55',
  '04-AU-WAL-DIVIDER-H55',
  '04-PEG-BIR-H160',
  '04-PEG-WAL-H160',
  '04-AU-BIR-PARTN240-H125',
  '04-AU-BIR-PARTN448-H125',
  '04-AU-WAL-PARTN240-H125',
  '04-AU-WAL-PARTN448-H125',
  '04-AREA-CT-GM-D',
  '04-AREA-CT-GMT-D',
  '04-AREA-CT-SW-D',
  '04-AREA-UT-GM-D',
  '04-AREA-UT-GMT-D',
  '04-AREA-UT-SW-D',
  '04-AREA-CT-GM-E',
  '04-AREA-CT-GMT-E',
  '04-AREA-CT-SW-E',
  '04-AREA-UT-GM-E',
  '04-AREA-UT-GMT-E',
  '04-AREA-UT-SW-E',
  '04-AREA-CT-GM-F',
  '04-AREA-CT-GMT-F',
  '04-AREA-CT-SW-F',
  '04-AREA-UT-GM-F',
  '04-AREA-UT-GMT-F',
  '04-AREA-UT-SW-F',
  '04-AREA-CT-GM-F1',
  '04-AREA-CT-GMT-F1',
  '04-AREA-CT-SW-F1',
  '04-AREA-CT-GM-G',
  '04-AREA-CT-GMT-G',
  '04-AREA-CT-SW-G',
  '04-AREA-UT-GM-G',
  '04-AREA-UT-GMT-G',
  '04-AREA-UT-SW-G',
  '04-AREA-CT-GM-H',
  '04-AREA-CT-GMT-H',
  '04-AREA-CT-SW-H',
  '04-AREA-UT-GM-H',
  '04-AREA-UT-GMT-H',
  '04-AREA-UT-SW-H',
  '04-AREA-CT-GM-IJ',
  '04-AREA-CT-GMT-IJ',
  '04-AREA-CT-SW-IJ',
  '04-AREA-CT-GM-K',
  '04-AREA-CT-GMT-K',
  '04-AREA-CT-SW-K',
  '04-AREA-CT-GM-L',
  '04-AREA-CT-GMT-L',
  '04-AREA-CT-SW-L',
  '04-AREA-CT-GM-N',
  '04-AREA-CT-GMT-N',
  '04-AREA-CT-SW-N',
  '04-AREA-ST-SW-G',
  '04-AREA-ST-SW-H',
  '04-AREA-ST-GM-G',
  '04-AREA-ST-GM-H',
  '04-AREA-ST-GMT-G',
  '04-AREA-ST-GMT-H'
];

const shallow = [
  '04-SRMAT-GM',
  '04-SRMAT-SIL',
  '04-AU-BIR-CT4-D',
  '04-AU-WAL-CT4-D',
  '04-AU-BIR-CT5-D',
  '04-AU-WAL-CT5-D',
  '04-AU-USHAPE-BIR-B',
  '04-AU-USHAPE-WAL-B',
  '04-AU-BIR-CD-B',
  '04-AU-WAL-CD-B',
  '04-AU-WAL-KH-B',
  '04-AU-BIR-KH-B',
  '04-AU-BIR-FLUTTED-B',
  '04-AU-WAL-FLUTTED-B' + '',
  '04-AU-BIR-SLOTTED-B',
  '04-AU-WAL-SLOTTED-B',
  '04-AU-BIR-SPICERACK-B',
  '04-AU-WAL-SPICERACK-B',
  '04-AU-BIR-T100305H55',
  '04-AU-WAL-T100305H55',
  '04-AU-BIR-T200305H55',
  '04-AU-WAL-T200305H55',
  '04-AU-BIR-T210406H110',
  '04-AU-WAL-T210406H110',
  '04-AU-BIR-T210506H110',
  '04-AU-WAL-T210506H110',
  '04-AU-LSHAPE600-SW',
  '04-AU-LSHAPE600-MB',
  '04-AU-LSHAPE600-SD',
  '04-AU-LSHAPE600-AN',
  '04-AU-LSHAPE600-AU79',
  '04-AU-LSHAPE1200-SW',
  '04-AU-LSHAPE1200-MB',
  '04-AU-LSHAPE1200-SD',
  '04-AU-LSHAPE1200-AN',
  '04-AU-LSHAPE1200-AU79',
  '04-AU-BIR-T9494H36',
  '04-AU-WAL-T9494H36',
  '04-AU-BIR-T94266H36',
  '04-AU-WAL-T94266H36',
  '04-AU-BIR-FILLER-1501200',
  '04-AU-WAL-FILLER-1501200',
  '04-IM-BIR-CT2',
  '04-IM-BIR-CT3',
  '04-IM-BIR-CT4',
  '04-IM-WAL-CT2',
  '04-IM-WAL-CT3',
  '04-IM-WAL-CT4',
  '04-IM-BIR-CT5',
  '04-IM-WAL-CT5',
  '04-AREA-CT-GM-D',
  '04-AREA-CT-GMT-D',
  '04-AREA-CT-SW-D',
  '04-AREA-UT-GM-D',
  '04-AREA-UT-GMT-D',
  '04-AREA-UT-SW-D',
  '04-AREA-CT-GM-E',
  '04-AREA-CT-GMT-E',
  '04-AREA-CT-SW-E',
  '04-AREA-UT-GM-E',
  '04-AREA-UT-GMT-E',
  '04-AREA-UT-SW-E',
  '04-AREA-CT-GM-F',
  '04-AREA-CT-GMT-F',
  '04-AREA-CT-SW-F',
  '04-AREA-UT-GM-F',
  '04-AREA-UT-GMT-F',
  '04-AREA-UT-SW-F',
  '04-AREA-CT-GM-F1',
  '04-AREA-CT-GMT-F1',
  '04-AREA-CT-SW-F1',
  '04-AREA-CT-GM-G',
  '04-AREA-CT-GMT-G',
  '04-AREA-CT-SW-G',
  '04-AREA-UT-GM-G',
  '04-AREA-UT-GMT-G',
  '04-AREA-UT-SW-G',
  '04-AREA-CT-GM-H',
  '04-AREA-CT-GMT-H',
  '04-AREA-CT-SW-H',
  '04-AREA-UT-GM-H',
  '04-AREA-UT-GMT-H',
  '04-AREA-UT-SW-H',
  '04-AREA-CT-GM-IJ',
  '04-AREA-CT-GMT-IJ',
  '04-AREA-CT-SW-IJ',
  '04-AREA-CT-GM-K',
  '04-AREA-CT-GMT-K',
  '04-AREA-CT-SW-K',
  '04-AREA-CT-GM-L',
  '04-AREA-CT-GMT-L',
  '04-AREA-CT-SW-L',
  '04-AREA-CT-GM-N',
  '04-AREA-CT-GMT-N',
  '04-AREA-CT-SW-N',
  '04-AREA-ST-SW-G',
  '04-AREA-ST-SW-H',
  '04-AREA-ST-GM-G',
  '04-AREA-ST-GM-H',
  '04-AREA-ST-GMT-G',
  '04-AREA-ST-GMT-H'
];

const shouldHideBasedOnWidthArray = [
  '04-PEGBOARD-BIR-H',
  '04-PEGBOARD-BIR-J',
  '04-PEGBOARD-BIR-L',
  '04-PEGBOARD-BIR-N',
  '04-PEGBOARD-WAL-H',
  '04-PEGBOARD-WAL-J',
  '04-PEGBOARD-WAL-L',
  '04-PEGBOARD-WAL-N',
  '04-IM-BIR-CT2',
  '04-IM-BIR-CT3',
  '04-IM-BIR-CT4',
  '04-IM-WAL-CT2',
  '04-IM-WAL-CT3',
  '04-IM-WAL-CT4',
  '04-IM-BIR-CT5',
  '04-IM-WAL-CT5',
  '04-AREA-CT-GM-D',
  '04-AREA-CT-GMT-D',
  '04-AREA-CT-SW-D',
  '04-AREA-CT-GM-E',
  '04-AREA-CT-GMT-E',
  '04-AREA-CT-SW-E',
  '04-AREA-CT-GM-F',
  '04-AREA-CT-GMT-F',
  '04-AREA-CT-SW-F',
  '04-AREA-CT-GMT-F1',
  '04-AREA-CT-GM-F1',
  '04-AREA-CT-SW-F1',
  '04-AREA-CT-GM-G',
  '04-AREA-CT-GMT-G',
  '04-AREA-CT-SW-G',
  '04-AREA-CT-GM-H',
  '04-AREA-CT-GMT-H',
  '04-AREA-CT-SW-H',
  '04-AREA-CT-GM-IJ',
  '04-AREA-CT-GMT-IJ',
  '04-AREA-CT-SW-IJ',
  '04-AREA-CT-GM-K',
  '04-AREA-CT-GMT-K',
  '04-AREA-CT-SW-K',
  '04-AREA-CT-GM-L',
  '04-AREA-CT-GMT-L',
  '04-AREA-CT-SW-L',
  '04-AREA-CT-GM-N',
  '04-AREA-CT-GMT-N',
  '04-AREA-CT-SW-N'
];

const makeFile = (dir: string, fileName: string, content: any) => {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;

    fs.writeFile(path.join(dir, fileName), JSON.stringify(content, null, 2), { flag: 'w' }, (err) => {
      if (err) throw err;
    });
  });
};

const main = async () => {
  console.log(`Fetching data...`);
  const modules = await db.module.findMany({
    include: {
      moduleCategories: {
        include: {
          category: true
        }
      },
      collection: {
        include: {
          translations: true
        }
      },
      finish: {
        include: {
          translations: true
        }
      }
    }
  });

  console.log(`Done fetching`);

  let ind = 1;
  for (const module of modules) {
    console.log(`Generating ${ind} of ${modules.length}: ${module.partNumber}`);
    let drawerTypes: any[] | undefined = undefined;

    if (deep.includes(module.partNumber)) {
      if (!drawerTypes) {
        drawerTypes = [];
      }

      drawerTypes.push({
        id: 1,
        slug: 'deep',
        name: 'Deep'
      });
    }

    if (shallow.includes(module.partNumber)) {
      if (!drawerTypes) {
        drawerTypes = [];
      }

      drawerTypes.push({
        id: 2,
        slug: 'shallow',
        name: 'Shallow'
      });
    }

    const { partNumber, ...rules } = module.rules as any;

    const {
      translations: collectionTranslations,
      thumbnailUrl: collectionThumbnailUrl,
      ...collection
    } = module.collection;
    const collectionTranslation = collectionTranslations.find((x) => x.locale === 'en');

    const { translations: finishTranslations, thumbnailUrl: finishThumbnailUrl, ...finish } = module.finish;
    const finishTranslation = finishTranslations.find((x) => x.locale === 'en');

    const moduleJson = {
      partNumber,
      description: module.description,
      thumbnailPath: module.thumbnailUrl,
      bundlePath: module.bundleUrl,
      isSubmodule: module.isSubmodule,
      hasPegs: module.hasPegs,
      isMat: module.isMat,
      shouldHideBasedOnWidth: shouldHideBasedOnWidthArray.includes(module.partNumber),
      drawerTypes,
      collection: {
        ...collection,
        thumbnailPath: collectionThumbnailUrl,
        name: collectionTranslation?.name,
        subtitle: collectionTranslation?.subtitle,
        description: collectionTranslation?.description
      },
      finish: {
        ...finish,
        thumbnailPath: finishThumbnailUrl,
        name: finishTranslation?.name,
        description: finishTranslation?.description
      },
      categories: uniqBy(
        module.moduleCategories.map((x) => x.category),
        'slug'
      ).filter((x) => x.slug !== 'all'),
      ...(rules as any)
    };

    const dir = path.join(__dirname, `./output`, module.collection.slug, module.partNumber);

    makeFile(dir, `${module.partNumber}.json`, moduleJson);
    ind++;
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
