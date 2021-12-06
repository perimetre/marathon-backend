import * as cron from 'node-cron';
import { PrismaClient } from '.prisma/client';
import logging from './utils/logging';
import { marathonGraphql } from './utils/marathon';
import { GetProductListingQuery, GET_PRODUCT_LISTING } from './utils/marathon/queries';
import { convertInToMmFormatted, convertMmToInFormatted } from './utils/conversion';
import { Rule } from './typings/Rule';
import {
  FeatureBooleanSelect,
  FeatureInput,
  FeatureMultiselect,
  FeatureNumeric,
  FeatureQuantityValue,
  FeatureSelect
} from './typings/Product';

const genericFind = <T>(list: any, attr: string, value: string) => {
  return (list || []).find((item: any) => item[attr].includes(value)) as T;
};

const marathonProductCron = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetProductListingQuery>(GET_PRODUCT_LISTING);
  if (data) {
    const dbModules = await prisma.module.findMany({ select: { id: true, partNumber: true } });

    const modules = (data?.data?.getProductListing?.edges || []).map(({ node }) => {
      const nodeRule = node.configuratorAttributes.find((ca) => ca.description.includes('Rules') || ca.id === 10);
      const nodeDimensions = node.configuratorAttributes.find(
        (ca) => ca.description.includes('Dimensions') || ca.id === 1
      );
      const nodeFinishes = node.configuratorAttributes.find((ca) => ca.description.includes('Finishes') || ca.id === 1);
      const nodeLeftExtensions = node.configuratorAttributes.find(
        (ca) => ca.description.includes('Left Extensions') || ca.id === 5
      );
      const nodeRightExtensions = node.configuratorAttributes.find(
        (ca) => ca.description.includes('Right Extensions') || ca.id === 5
      );

      const netInteriorMax = genericFind<FeatureQuantityValue>(
        nodeRule?.features,
        'name',
        'net_interior_max'
      )?.quantityvalue;
      const netInteriorMin = genericFind<FeatureQuantityValue>(
        nodeRule?.features,
        'name',
        'net_interior_max'
      )?.quantityvalue;

      const dimensionsHeight = genericFind<FeatureQuantityValue>(
        nodeDimensions?.features,
        'name',
        'height'
      )?.quantityvalue;

      const dimensionsWidthMin = genericFind<FeatureQuantityValue>(
        nodeDimensions?.features,
        'name',
        'width_min'
      )?.quantityvalue;
      const dimensionsWidthMax = genericFind<FeatureQuantityValue>(
        nodeDimensions?.features,
        'name',
        'width_max'
      )?.quantityvalue;

      const dimensionsDepthMin = genericFind<FeatureQuantityValue>(
        nodeDimensions?.features,
        'name',
        'depth_min'
      )?.quantityvalue;
      const dimensionsDepthMax = genericFind<FeatureQuantityValue>(
        nodeDimensions?.features,
        'name',
        'depth_max'
      )?.quantityvalue;

      const collection = node.partNumber.includes('-AREA-')
        ? 'area'
        : node.partNumber.includes('-IN-')
        ? 'imprint'
        : node.partNumber.includes('-AU-')
        ? 'autograph'
        : null;

      const trimmable = genericFind<FeatureMultiselect>(nodeRule?.features, 'name', 'trimmable')?.selections;

      const rules: Rule = {
        partNumber: node.partNumber,
        finishes: (node.finishes || []).map((finish) => finish.element.partNumber),
        dimensions: {
          height: {
            inches:
              dimensionsHeight?.unit?.id === 'in'
                ? `${dimensionsHeight?.value}"`
                : convertMmToInFormatted(`${dimensionsHeight?.value}`),
            millimeters:
              dimensionsHeight?.unit?.id === 'mm'
                ? dimensionsHeight?.value
                : convertInToMmFormatted(`${dimensionsHeight?.value}`) || 0
          },
          width: {
            min:
              dimensionsWidthMin && dimensionsWidthMin.unit
                ? {
                    inches:
                      dimensionsWidthMin.unit.id === 'in'
                        ? `${dimensionsWidthMin?.value}"`
                        : convertMmToInFormatted(`${dimensionsWidthMin?.value}`),
                    millimeters:
                      dimensionsWidthMin.unit.id === 'mm'
                        ? dimensionsWidthMin?.value
                        : convertInToMmFormatted(`${dimensionsWidthMin?.value}`) || 0
                  }
                : null,
            max:
              dimensionsWidthMax && dimensionsWidthMax.unit
                ? {
                    inches:
                      dimensionsWidthMax.unit.id === 'in'
                        ? `${dimensionsWidthMax?.value}"`
                        : convertMmToInFormatted(`${dimensionsWidthMax?.value}`),
                    millimeters:
                      dimensionsWidthMax.unit.id === 'mm'
                        ? dimensionsWidthMax?.value
                        : convertInToMmFormatted(`${dimensionsWidthMax?.value}`) || 0
                  }
                : null
          },
          depth: {
            min:
              dimensionsDepthMin && dimensionsDepthMin.unit
                ? {
                    inches:
                      dimensionsDepthMin.unit.id === 'in'
                        ? `${dimensionsDepthMin?.value}"`
                        : convertMmToInFormatted(`${dimensionsDepthMin?.value}`),
                    millimeters:
                      dimensionsDepthMin.unit.id === 'mm'
                        ? dimensionsDepthMin?.value
                        : convertInToMmFormatted(`${dimensionsDepthMin?.value}`) || 0
                  }
                : null,
            max:
              dimensionsDepthMax && dimensionsDepthMax.unit
                ? {
                    inches:
                      dimensionsDepthMax.unit.id === 'in'
                        ? `${dimensionsDepthMax?.value}"`
                        : convertMmToInFormatted(`${dimensionsDepthMax?.value}`),
                    millimeters:
                      dimensionsDepthMax.unit.id === 'mm'
                        ? dimensionsDepthMax?.value
                        : convertInToMmFormatted(`${dimensionsDepthMax?.value}`) || 0
                  }
                : null
          }
        },
        extensions: {
          left: genericFind<FeatureInput>(nodeLeftExtensions?.features, 'name', 'imprint_ext_part')?.text || '',
          right: genericFind<FeatureInput>(nodeRightExtensions?.features, 'name', 'imprint_ext_part')?.text || '',
          ...(collection === 'imprint' ? { options: (node.options || []).map((option) => option.partNumber) } : null)
        },
        rules: {
          rotation: Number(genericFind<FeatureNumeric>(nodeRule?.features, 'name', 'rotation')?.number || 0),
          fullDepth: genericFind<FeatureBooleanSelect>(nodeRule?.features, 'name', 'fullDepth')?.checked,
          ...(trimmable ? trimmable : null),
          ...(collection !== 'imprint' ? { options: (node.options || []).map((option) => option.partNumber) } : null),
          ...((netInteriorMax && netInteriorMax.unit) || (netInteriorMin && netInteriorMin.unit)
            ? {
                requiredNetInterior: {
                  ...(netInteriorMax && netInteriorMax.unit
                    ? {
                        max: {
                          inches:
                            netInteriorMax.unit.id === 'in'
                              ? `${netInteriorMax?.value}"`
                              : convertMmToInFormatted(`${netInteriorMax?.value}`),
                          millimeters:
                            netInteriorMax.unit.id === 'mm'
                              ? netInteriorMax?.value
                              : convertInToMmFormatted(`${netInteriorMax?.value}`) || 0
                        }
                      }
                    : null),
                  ...(netInteriorMin && netInteriorMin.unit
                    ? {
                        min: {
                          inches:
                            netInteriorMin.unit.id === 'in'
                              ? `${netInteriorMin?.value}"`
                              : convertMmToInFormatted(`${netInteriorMin?.value}`),
                          millimeters:
                            netInteriorMin.unit.id === 'mm'
                              ? netInteriorMin?.value
                              : convertInToMmFormatted(`${netInteriorMin?.value}`) || 0
                        }
                      }
                    : null)
                }
              }
            : null)
        }
      };

      console.log({ rules: JSON.stringify(rules) });

      return {
        id: Number(node.pimcoreId),
        partNumber: node.partNumber,
        thumbnailUrl: node.productPictures?.fullpath,
        collectionSlug: collection,
        finish: genericFind<FeatureSelect>(nodeFinishes?.features, 'name', 'finishes')?.selection,
        rules
      };
    });

    // const createModules = modules.filter((mod) => !dbModules.find((db) => db.partNumber === mod.partNumber));
    // const updateModules = modules.filter((mod) => dbModules.find((db) => db.partNumber === mod.partNumber));

    const createModules: typeof modules = [];
    const updateModules: typeof modules = [];

    modules.forEach((module) => {
      const exists = dbModules.find((db) => db.partNumber === module.partNumber);
      if (exists) {
        updateModules.push(module);
      } else {
        createModules.push(module);
      }
    });

    for (const module of updateModules) {
      console.log({ module });
      await prisma.module.update({
        where: { partNumber: module.partNumber },
        data: {
          // thumbnailUrl: module.thumbnailUrl,
          rules: module.rules
          // isImprintExtension: false,
          // isMat: false,
          // isSubmodule: false,
          // hasPegs: false,
          // ...(module.collectionSlug
          //   ? {
          //       collection: {
          //         connect: {
          //           slug: module.collectionSlug
          //         }
          //       }
          //     }
          //   : null)
        }
      });
    }
  }
};

const scheduleJobs = async (prisma: PrismaClient): Promise<void> => {
  // const daily = '0 4 * * *';
  // cron.schedule(daily, async () => {
  //   console.log(`Daily job (${daily}) `);
  try {
    await marathonProductCron(prisma);
  } catch (error) {
    logging.error(error, 'Daily cronjob has failed.');
  }
  // });

  console.log('All jobs scheduled');
};

export default scheduleJobs;
