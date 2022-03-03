import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
// import { print } from 'graphql';
import { Locale, PrismaClient } from '@prisma/client';
import { ForbiddenError } from 'apollo-server';
import axios, { AxiosResponse } from 'axios';
import fetch from 'cross-fetch';
import deepmerge from 'deepmerge';
import { isEqual } from 'lodash';
import path from 'path';
import { URL } from 'url';
import { env } from '../../env';
import {
  CsFeatureMultiselect,
  CsFeatureQuantityValue,
  GetProductListingQuery,
  GetProductListingQueryVariables,
  GetSpCategoryListingQuery,
  GetSpCollectionListingQuery,
  GetSpDrawerTypesListingQuery,
  GetSpFinishListingQuery
} from '../../generated/graphql';
import { NexusGenObjects } from '../../generated/nexus';
import { convertInToMmFormatted, convertMmToInFormatted } from '../../utils/conversion';
import { makeError } from '../../utils/exception';
import { replaceExtension } from '../../utils/file';
import logging from '../../utils/logging';
import { fileUploadService } from '../fileUpload';
import { projectService } from '../project';
import {
  GET_PRODUCT_LISTING,
  GET_SP_CATEGORY_LISTING,
  GET_SP_COLLECTION_LISTING,
  GET_SP_DRAWER_TYPES_LISTING,
  GET_SP_FINISH_LISTING
} from './queries';

type MarathonServiceDependencies = {
  db?: PrismaClient;
};

let marathonApolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const FEATURE_NAMES = {
  DIMENSION_HEIGHT: 'height',
  MM_ID: 'mm',
  IN_ID: 'in',
  MIN_WIDTH: 'width_min',
  MAX_WIDTH: 'width_max',
  MIN_DEPTH: 'depth_min',
  MAX_DEPTH: 'depth_max',
  TRIMMABLE: 'trimmable',
  TRIM_OFFSET_BOTTOM: 'trim_offset_bottom',
  TRIM_OFFSET_TOP: 'trim_offset_top',
  TRIM_OFFSET_LEFT: 'trim_offset_left',
  TRIM_OFFSET_RIGHT: 'trim_offset_right'
};

type MarathonModule = NonNullable<
  NonNullable<NonNullable<GetProductListingQuery['getProductListing']>['edges']>[0]
>['node'];

export const marathonService = ({ db }: MarathonServiceDependencies) => {
  const {
    MARATHON_API,
    MARATHON_API_GRAPHQL,
    MARATHON_API_GRAPHQL_KEY,
    MARATHON_API_CREATE_LIST,
    MARATHON_API_LOGIN,
    MARATHON_SYNC_PRODUCTS_PER_PAGE,
    MARATHON_SYNC_EMPTY_PAGES_TO_STOP,
    MARATHON_MEDIA_URI,
    MARATHON_COLLECTIONS_WHITELIST,
    MARATHON_FINISHES_WHITELIST,
    MARATHON_DRAWER_TYPES_WHITELIST
  } = env;

  const defaultSyncLocale: Locale = 'en';

  if (!MARATHON_API || !MARATHON_API_GRAPHQL || !MARATHON_API_GRAPHQL_KEY) {
    throw new Error('Missing marathon environment');
  }

  const url = new URL(MARATHON_API_GRAPHQL, MARATHON_API);
  url.searchParams.append('apikey', MARATHON_API_GRAPHQL_KEY);

  const marathonApollo =
    marathonApolloClient ||
    new ApolloClient({
      link: from([
        new HttpLink({
          uri: url.toString(),
          fetch
        })
      ]),
      cache: new InMemoryCache()
    });

  const storageSyncQueue: {
    sourcePath: string;
    originalPath: string;
    destinationPath: string;
  }[] = [];

  const makeThumbnailUrlAndQueue = (sourcePath?: string | null, currentPath?: string | null) => {
    let thumbnailUrl: string | undefined;

    if (sourcePath?.trim() && currentPath?.trim()) {
      thumbnailUrl = replaceExtension(currentPath, sourcePath);
      let originalPath = thumbnailUrl;

      // If the extension were changed, the paths are now different. So store the previous original path so the image can be deleted
      if (currentPath !== originalPath) originalPath = currentPath;

      storageSyncQueue.push({
        sourcePath,
        originalPath,
        destinationPath: thumbnailUrl
      });
    }

    return thumbnailUrl;
  };

  const storageSync = async () => {
    if (!MARATHON_MEDIA_URI) {
      throw new Error('Missing marathon environment');
    }

    const fileUpload = fileUploadService();

    console.log(`Syncing ${storageSyncQueue.length} images`);

    const initialLength = storageSyncQueue.length;
    let i = 0;

    while (storageSyncQueue.length > 0) {
      let simultaneousSync = 5;
      simultaneousSync = storageSyncQueue.length >= simultaneousSync ? simultaneousSync : storageSyncQueue.length;
      const promises: Promise<void>[] = [];

      for (let index = 0; index < simultaneousSync; index++) {
        const storageSync = storageSyncQueue[index];

        promises.push(
          new Promise<void>(async (resolve, reject) => {
            try {
              console.log(`Syncing image #${i + 1} of ${initialLength}`);
              i++;

              // Download image
              const file = await fileUpload.downloadFile(
                new URL(storageSync.sourcePath, MARATHON_MEDIA_URI).toString()
              );

              // Try to delete current image
              await fileUpload.DELETEFilesOnStorageCAUTION([storageSync.originalPath]);

              // Upload new image
              await fileUpload.uploadFileToStorage(file.data, storageSync.destinationPath);
              resolve();
            } catch (err) {
              reject(err);
            }
          })
        );
      }

      storageSyncQueue.splice(0, simultaneousSync);

      try {
        const results = await Promise.allSettled(promises);
        results
          .filter((x) => x.status === 'rejected')
          .forEach((x) => logging.error((x as PromiseRejectedResult).reason, 'Could not sync image'));
      } catch (err) {
        logging.error(err, 'Error when batching images sync');
      }
    }

    console.log('Finished syncing images');
  };

  const syncCategory = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    console.log('Syncing categories');
    console.time('categories');
    console.log('Fetching categories');

    try {
      const { data } = await marathonApollo.query<GetSpCategoryListingQuery>({
        query: GET_SP_CATEGORY_LISTING,
        fetchPolicy: 'no-cache'
      });

      const categories = data?.getSpCategoryListing?.edges || [];
      if (categories && categories.length > 0) {
        console.log(`Fetched ${categories.length} categories`);

        const slugs = categories
          .map((categoryEdge) => categoryEdge?.node?.slug?.trim() as string) // Casting because we're filtering right after
          .filter((x) => !!x);
        // const externalIds = categories.map(({ node: category }) => category.id);

        // Get all categories that we already have
        const existingCategories = await db.category.findMany({
          select: { slug: true },
          where: {
            slug: {
              in: slugs
            }
          }
        });

        // Received categories
        const categoriesToUpdate = categories.filter((categoryEdge) =>
          // Where exists in the database
          existingCategories.some((cat) => cat.slug === categoryEdge?.node?.slug?.trim())
        );

        // Received categories
        const categoriesToCreate = categories.filter(
          // Where it DOESN'T exist in the database
          (categoryEdge) => !existingCategories.some((cat) => cat.slug === categoryEdge?.node?.slug?.trim())
        );

        for (let i = 0; i < categoriesToUpdate.length; i++) {
          const categoryEdge = categoriesToUpdate[i];
          const slug = categoryEdge?.node?.slug?.trim();
          console.log(`Updating category #${i + 1} ${slug} of ${categoriesToUpdate.length}`);

          await db.category.update({
            where: { slug },
            data: {
              externalId: categoryEdge?.node?.id?.trim(),
              name: categoryEdge?.node?.name?.trim()
            }
          });
        }

        if (categoriesToCreate && categoriesToCreate.length > 0) {
          console.log(`Batch creating ${categoriesToCreate.length} categories`);
          await db.category.createMany({
            data: categoriesToCreate
              .filter((categoryEdge) => categoryEdge?.node?.id && categoryEdge?.node?.slug && categoryEdge?.node?.name)
              .map((categoryEdge) => ({
                // Casting because we're sure, since there's a filter right above
                externalId: categoryEdge?.node?.id?.trim() as string,
                slug: categoryEdge?.node?.slug?.trim() as string,
                name: categoryEdge?.node?.name?.trim() as string
              }))
          });
        } else {
          console.log(`No category to create`);
        }
      } else {
        console.log('No category has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon categories');
    }

    console.log('Finished syncing categories');
    console.timeEnd('categories');
  };

  const syncCollection = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    console.log('Syncing collections');
    console.time('collections');
    console.log('Fetching collections');

    try {
      const { data } = await marathonApollo.query<GetSpCollectionListingQuery>({
        query: GET_SP_COLLECTION_LISTING,
        fetchPolicy: 'no-cache'
      });

      const collections = data?.getSpCollectionListing?.edges || [];
      if (collections && collections.length > 0) {
        console.log(`Fetched ${collections.length} collections`);

        const slugs = collections
          .map((collectionEdge) => collectionEdge?.node?.slug?.trim() as string) // Casting because we're filtering right after
          .filter((x) => !!x);

        const existingCollections = await db.collection.findMany({
          select: {
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          },
          where: {
            slug: {
              in: slugs
            }
          }
        });

        // Received collections
        const collectionsToUpdate = collections.filter((collectionEdge) =>
          // Where exists in the database
          existingCollections.some((col) => col.slug === collectionEdge?.node?.slug?.trim())
        );

        const whitelistedSlugs = MARATHON_COLLECTIONS_WHITELIST.split(',').filter((x) => !!x);

        // Received collections
        const collectionsToCreate = collections.filter(
          // Where it DOESN'T exist in the database
          (collectionEdge) =>
            collectionEdge?.node?.slug?.trim() &&
            !existingCollections.some((col) => col.slug === collectionEdge?.node?.slug?.trim()) &&
            whitelistedSlugs.includes(collectionEdge.node.slug.trim())
        );

        for (let i = 0; i < collectionsToUpdate.length; i++) {
          const collectionEdge = collectionsToUpdate[i];
          const slug = collectionEdge?.node?.slug?.trim();

          const currentCollection = existingCollections.find((x) => x.slug === slug);
          if (!currentCollection) continue;

          console.log(`Updating collection #${i + 1} ${slug} of ${collectionsToUpdate.length}`);

          const translationIds = currentCollection.translations.map((x) => x.id);

          await db.collection.update({
            where: { slug },
            data: {
              externalId: collectionEdge?.node?.id?.trim(),
              thumbnailUrl: makeThumbnailUrlAndQueue(
                collectionEdge?.node?.image?.fullpath,
                currentCollection.thumbnailUrl
              ),
              hasPegs: collectionEdge?.node?.hasPegs || undefined,
              isComingSoon: collectionEdge?.node?.isComingSoon || undefined,

              translations:
                translationIds && translationIds.length > 0
                  ? {
                      update: {
                        // Theoretically we should only have one id for locale+slug
                        where: { id: translationIds[0] },
                        data: {
                          name: collectionEdge?.node?.name?.trim(),
                          subtitle: collectionEdge?.node?.subtitle?.trim(),
                          description: collectionEdge?.node?.description?.trim()
                        }
                      }
                    }
                  : undefined
            }
          });
        }

        if (collectionsToCreate && collectionsToCreate.length > 0) {
          console.log(`Batch creating ${collectionsToCreate.length} collections`);
          await db.collection.createMany({
            data: collectionsToCreate
              .filter((collectionEdge) => collectionEdge?.node?.id && collectionEdge?.node?.slug)
              .map((collectionEdge) => ({
                // Casting because we're sure, since there's a filter right above
                externalId: collectionEdge?.node?.id?.trim() as string,
                slug: collectionEdge?.node?.slug?.trim() as string,
                thumbnailUrl: makeThumbnailUrlAndQueue(
                  collectionEdge?.node?.image?.fullpath?.trim(),
                  `image/collection/${collectionEdge?.node?.slug?.trim()}${path.extname(
                    collectionEdge?.node?.image?.fullpath?.trim() || ''
                  )}}`
                ),
                hasPegs: collectionEdge?.node?.hasPegs || false,
                isComingSoon: collectionEdge?.node?.isComingSoon || false
              }))
          });

          console.log(`Fetching recently created ${collectionsToCreate.length} collections`);
          const recentlyCreatedCollections = await db.collection.findMany({
            where: { slug: { in: collectionsToCreate.map((x) => x?.node?.slug?.trim() as string).filter((x) => !!x) } },
            select: {
              id: true,
              slug: true
            }
          });

          console.log(`Batch creating ${recentlyCreatedCollections.length} collection translations`);
          await db.collectionTranslations.createMany({
            data: recentlyCreatedCollections.map((dbCollection) => {
              // The type is undefined, but we're sure it returns correctly(at least it should)
              // Worst case translations will be empty, and that's their fault
              const collection = collectionsToCreate.find((x) => x?.node?.slug?.trim() === dbCollection.slug);

              return {
                locale: defaultSyncLocale,
                description: collection?.node?.description?.trim() || '',
                subtitle: collection?.node?.subtitle?.trim() || '',
                name: collection?.node?.name?.trim() || '',
                collectionId: dbCollection.id
              };
            })
          });
        } else {
          console.log(`No collection to create`);
        }
      } else {
        console.log('No collection has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon collections');
    }

    console.log('Finished syncing collections');
    console.timeEnd('collections');
  };

  const syncDrawerType = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing drawer types');
    console.time('drawerType');
    console.log('Fetching drawer types');

    try {
      const { data } = await marathonApollo.query<GetSpDrawerTypesListingQuery>({
        query: GET_SP_DRAWER_TYPES_LISTING,
        fetchPolicy: 'no-cache'
      });

      const drawerTypes = data?.getSpDrawerTypesListing?.edges || [];

      if (drawerTypes && drawerTypes.length > 0) {
        console.log(`Fetched ${drawerTypes.length} drawer types`);

        const slugs = drawerTypes
          .map((drawerTypeEdge) => drawerTypeEdge?.node?.slug?.trim() as string) // Casting because we filter right after
          .filter((x) => !!x);

        const existingDrawerTypes = await db.type.findMany({
          select: {
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          },
          where: {
            slug: {
              in: slugs
            }
          }
        });

        // Received drawer types
        const drawerTypesToUpdate = drawerTypes.filter((drawerTypeEdge) =>
          // Where exists in the database
          existingDrawerTypes.some((type) => type.slug === drawerTypeEdge?.node?.slug?.trim())
        );

        const whitelistedSlugs = MARATHON_DRAWER_TYPES_WHITELIST.split(',').filter((x) => !!x);

        // Received drawer types
        const drawerTypesToCreate = drawerTypes.filter(
          // Where it DOESN'T exist in the database
          (drawerTypeEdge) =>
            drawerTypeEdge?.node?.slug?.trim() &&
            !existingDrawerTypes.some((type) => type.slug === drawerTypeEdge?.node?.slug?.trim()) &&
            whitelistedSlugs.includes(drawerTypeEdge.node.slug.trim())
        );

        for (let i = 0; i < drawerTypesToUpdate.length; i++) {
          const drawerTypeEdge = drawerTypesToUpdate[i];
          const slug = drawerTypeEdge?.node?.slug?.trim();

          const currentDrawerType = existingDrawerTypes.find((x) => x.slug === slug);
          if (!currentDrawerType) continue;

          console.log(`Updating drawer type #${i + 1} ${slug} of ${drawerTypesToUpdate.length}`);

          const translationIds = currentDrawerType.translations.map((x) => x.id);

          await db.type.update({
            where: { slug },
            data: {
              externalId: drawerTypeEdge?.node?.id?.trim(),
              thumbnailUrl: makeThumbnailUrlAndQueue(
                drawerTypeEdge?.node?.image?.fullpath,
                currentDrawerType.thumbnailUrl
              ),
              hasPegs: drawerTypeEdge?.node?.hasPegs || undefined,
              // isComingSoon: drawerTypeEdge?.node?.isComingSoon || undefined,

              translations:
                translationIds && translationIds.length > 0
                  ? {
                      update: {
                        // Theoretically we should only have one id for locale+slug
                        where: { id: translationIds[0] },
                        data: {
                          name: drawerTypeEdge?.node?.name?.trim(),
                          description: drawerTypeEdge?.node?.description?.trim()
                        }
                      }
                    }
                  : undefined
            }
          });
        }

        if (drawerTypesToCreate && drawerTypesToCreate.length > 0) {
          console.log(`Batch creating ${drawerTypesToCreate.length} drawerTypes`);
          await db.type.createMany({
            data: drawerTypesToCreate
              .filter((drawerTypeEdge) => drawerTypeEdge?.node?.id && drawerTypeEdge?.node?.slug)
              .map((drawerTypeEdge) => ({
                // Casting because we're filtering right above
                externalId: drawerTypeEdge?.node?.id?.trim() as string,
                slug: drawerTypeEdge?.node?.slug?.trim() as string,
                thumbnailUrl: makeThumbnailUrlAndQueue(
                  drawerTypeEdge?.node?.image?.fullpath?.trim(),
                  `image/type/${drawerTypeEdge?.node?.slug?.trim()}${path.extname(
                    drawerTypeEdge?.node?.image?.fullpath?.trim() || ''
                  )}`
                ),
                hasPegs: drawerTypeEdge?.node?.hasPegs || false
                // isComingSoon: drawerTypeEdge?.node?.isComingSoon || false
              }))
          });

          console.log(`Fetching recently created ${drawerTypesToCreate.length} drawer types`);
          const recentlyCreatedDrawerTypes = await db.collection.findMany({
            where: { slug: { in: drawerTypesToCreate.map((x) => x?.node?.slug?.trim() as string).filter((x) => !!x) } },
            select: {
              id: true,
              slug: true
            }
          });

          console.log(`Batch creating ${recentlyCreatedDrawerTypes.length} drawer types translations`);
          await db.typeTranslations.createMany({
            data: recentlyCreatedDrawerTypes.map((dbType) => {
              // This returns undefined, but we're sure it returns correctly(at least it should)
              const drawerType = drawerTypesToCreate.find((x) => x?.node?.slug?.trim() === dbType.slug);

              return {
                locale: defaultSyncLocale,
                description: drawerType?.node?.description?.trim() || '',
                name: drawerType?.node?.name?.trim() || '',
                typeId: dbType.id
              };
            })
          });
        } else {
          console.log(`No drawerType to create`);
        }
      } else {
        console.log('No drawer type has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon drawer types');
    }

    console.log('Finished syncing drawer types');
    console.timeEnd('drawerType');
  };

  const syncFinish = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing finishes');
    console.time('finish');
    console.log('Fetching finishes');

    try {
      const { data } = await marathonApollo.query<GetSpFinishListingQuery>({
        query: GET_SP_FINISH_LISTING,
        fetchPolicy: 'no-cache'
      });

      const finishes = data.getSpFinishListing?.edges || [];
      if (finishes && finishes.length > 0) {
        console.log(`Fetched ${finishes.length} finishes`);

        const slugs = finishes
          .map((finishEdge) => finishEdge?.node?.slug?.trim() as string) // Casting since we're filtering right after
          .filter((x) => !!x);

        const existingFinishes = await db.finish.findMany({
          select: {
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          },
          where: {
            slug: {
              in: slugs
            }
          }
        });

        // Received finishes
        const finishesToUpdate = finishes.filter((finishEdge) =>
          // Where exists in the database
          existingFinishes.some((fin) => fin.slug === finishEdge?.node?.slug?.trim())
        );

        const whitelistedSlugs = MARATHON_FINISHES_WHITELIST.split(',').filter((x) => !!x);

        // Received finishes
        const finishesToCreate = finishes.filter(
          // Where it DOESN'T exist in the database
          (finishEdge) =>
            finishEdge?.node?.slug?.trim() &&
            !existingFinishes.some((fin) => fin.slug === finishEdge?.node?.slug?.trim()) &&
            whitelistedSlugs.includes(finishEdge.node.slug.trim())
        );

        for (let i = 0; i < finishesToUpdate.length; i++) {
          const finishEdge = finishesToUpdate[i];
          const slug = finishEdge?.node?.slug?.trim();

          const currentFinish = existingFinishes.find((x) => x.slug === slug);
          if (!currentFinish) continue;

          console.log(`Updating finish #${i + 1} ${slug} of ${finishesToUpdate.length}`);

          const translationIds = currentFinish.translations.map((x) => x.id);

          await db.finish.update({
            where: { slug },
            data: {
              externalId: finishEdge?.node?.id?.trim(),
              thumbnailUrl: makeThumbnailUrlAndQueue(finishEdge?.node?.image?.fullpath, currentFinish.thumbnailUrl),
              translations:
                translationIds && translationIds.length > 0
                  ? {
                      update: {
                        // Theoretically we should only have one id for locale+slug
                        where: { id: translationIds[0] },
                        data: {
                          name: finishEdge?.node?.name?.trim(),
                          description: finishEdge?.node?.description?.trim()
                        }
                      }
                    }
                  : undefined
            }
          });
        }

        if (finishesToCreate && finishesToCreate.length > 0) {
          console.log(`Batch creating ${finishesToCreate.length} finishes`);
          await db.finish.createMany({
            data: finishesToCreate
              .filter(
                (finishEdge) => finishEdge?.node?.id && finishEdge?.node?.slug && finishEdge?.node?.image?.fullpath
              )
              .map((finishEdge) => ({
                // Casing since we're filtering right above
                externalId: finishEdge?.node?.id?.trim() as string,
                slug: finishEdge?.node?.slug?.trim() as string,
                thumbnailUrl: makeThumbnailUrlAndQueue(
                  finishEdge?.node?.image?.fullpath?.trim(),
                  `image/finish/${finishEdge?.node?.slug?.trim()}${path.extname(
                    finishEdge?.node?.image?.fullpath?.trim() || ''
                  )}`
                )
              }))
          });

          console.log(`Fetching recently created ${finishesToCreate.length} finishes`);
          const recentlyCreatedFinishes = await db.finish.findMany({
            where: { slug: { in: finishesToCreate.map((x) => x?.node?.slug?.trim() as string).filter((x) => !!x) } },
            select: {
              id: true,
              slug: true
            }
          });

          console.log(`Batch creating ${recentlyCreatedFinishes.length} finish translations`);
          await db.finishTranslations.createMany({
            data: recentlyCreatedFinishes.map((dbFinish) => {
              // This returns undefined, but we're sure it returns correctly(at least it should)
              const finish = finishesToCreate.find((x) => x?.node?.slug?.trim() === dbFinish.slug);

              return {
                locale: defaultSyncLocale,
                description: finish?.node?.description?.trim() || '',
                name: finish?.node?.name?.trim() || '',
                finishId: dbFinish.id
              };
            })
          });
        } else {
          console.log(`No finish to create`);
        }
      } else {
        console.log('No finish has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon finishes');
    }

    console.log('Finished syncing finishes');
    console.timeEnd('finish');
  };

  /**
   * Tries to grab a value of @param featureName from a feature list
   */
  const getQuantityValueFeature = <TResult>(
    featureList: NonNullable<NonNullable<NonNullable<MarathonModule>['configuratorAttributes']>[number]>['features'],
    featureName: string,
    featureUnitId: string,
    format?: (value?: unknown) => TResult
  ): TResult => {
    // Get the feature with the name we want from the list
    const feature = featureList?.find((feature) => feature?.name === featureName) as CsFeatureQuantityValue | undefined;

    // If unit is wrong
    if (feature?.quantityvalue?.unit?.id && feature.quantityvalue.unit.id !== featureUnitId) {
      if (featureUnitId === FEATURE_NAMES.MM_ID && feature.quantityvalue.unit.id === FEATURE_NAMES.IN_ID) {
        const inchValue = convertInToMmFormatted(`${feature.quantityvalue.value || 0}`);

        return format ? format(inchValue) : (inchValue as unknown as TResult);
      } else if (featureUnitId === FEATURE_NAMES.IN_ID && feature.quantityvalue.unit.id === FEATURE_NAMES.MM_ID) {
        const mmValue = convertMmToInFormatted(`${feature.quantityvalue.value || 0}`);

        return format ? format(mmValue) : (mmValue as unknown as TResult);
      } else {
        throw makeError(
          `Expected ${featureName} feature as ${featureUnitId}, but was returned as "${feature?.quantityvalue?.unit?.id}" with value "${feature.quantityvalue.value}"`,
          'ruleMergeFeatureQuantityUnit'
        );
      }
    }

    // Format or return plain
    return format ? format(feature?.quantityvalue?.value) : (feature?.quantityvalue?.value as unknown as TResult);
  };

  /**
   * Tries to safely convert a param to a number
   */
  const numberFromMaybe = (originalValue?: string | number | null | unknown): number => {
    let value = originalValue;

    if (typeof value !== 'number') value = parseFloat(`${value}`);

    // Castng because we convert the value above
    return value && !isNaN(value as number) ? (value as number) : 0;
  };

  const makeRulesFromMarathonModule = (marathonModule: MarathonModule): NexusGenObjects['ModuleRules'] => {
    const partNumber = marathonModule?.partNumber?.trim();
    if (!partNumber) throw makeError('Cannot create rule without partNumber', 'ruleMergeMissingPartNumber');

    // ---- Dimensions

    const dimensionAttribute = marathonModule?.configuratorAttributes?.find((attribute) =>
      attribute?.features?.some((feature) => feature?.name === FEATURE_NAMES.DIMENSION_HEIGHT)
    );

    // -------- Height

    const heightMM = getQuantityValueFeature(
      dimensionAttribute?.features,
      FEATURE_NAMES.DIMENSION_HEIGHT,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    // -------- Width

    const minWidthMM = getQuantityValueFeature(
      dimensionAttribute?.features,
      FEATURE_NAMES.MIN_WIDTH,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    const maxWidthMM = getQuantityValueFeature(
      dimensionAttribute?.features,
      FEATURE_NAMES.MAX_WIDTH,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    // -------- Depth

    const minDepthMM = getQuantityValueFeature(
      dimensionAttribute?.features,
      FEATURE_NAMES.MIN_DEPTH,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    const maxDepthMM = getQuantityValueFeature(
      dimensionAttribute?.features,
      FEATURE_NAMES.MAX_DEPTH,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    // ---- Rules

    const rulesAttribute = marathonModule?.configuratorAttributes?.find((attribute) =>
      attribute?.features?.some((feature) => feature?.name === FEATURE_NAMES.TRIMMABLE)
    );

    // -------- Trimmable

    const trimmable = (
      rulesAttribute?.features?.find((feature) => feature?.name === FEATURE_NAMES.TRIMMABLE) as
        | CsFeatureMultiselect
        | undefined
    )?.selections
      ?.filter((x) => !!x) // Remove nulls and undefined values IF they exist
      .map((x) => x as string); // Cast to string because we know there are no null/undefined values since we filtered

    // -------- Trim offset

    const trimOffsetBottomMM = getQuantityValueFeature(
      rulesAttribute?.features,
      FEATURE_NAMES.TRIM_OFFSET_BOTTOM,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    const trimOffsetTopMM = getQuantityValueFeature(
      rulesAttribute?.features,
      FEATURE_NAMES.TRIM_OFFSET_TOP,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    const trimOffsetLeftMM = getQuantityValueFeature(
      rulesAttribute?.features,
      FEATURE_NAMES.TRIM_OFFSET_LEFT,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    const trimOffsetRightMM = getQuantityValueFeature(
      rulesAttribute?.features,
      FEATURE_NAMES.TRIM_OFFSET_RIGHT,
      FEATURE_NAMES.MM_ID,
      numberFromMaybe
    );

    return {
      partNumber,
      isImprintExtension: false, // TODO: Grab correct value
      finishes: marathonModule?.finishes
        ?.map((x) => x?.element?.partNumber)
        .filter((x) => !!x) // Remove nulls and undefined values IF they exist
        .map((x) => x as string), // Cast to string because we know there are no null/undefined values since we filtered
      dimensions: {
        height: {
          millimeters: heightMM,
          // Currently they don't provide in so we must convert from mm
          inches: convertMmToInFormatted(`${heightMM}`)
        },
        width: {
          min: {
            millimeters: minWidthMM,
            // Currently they don't provide in so we must convert from mm
            inches: convertMmToInFormatted(`${minWidthMM}`)
          },
          max: {
            millimeters: maxWidthMM,
            // Currently they don't provide in so we must convert from mm
            inches: convertMmToInFormatted(`${maxWidthMM}`)
          }
        },
        depth: {
          min: {
            millimeters: minDepthMM,
            // Currently they don't provide in so we must convert from mm
            inches: convertMmToInFormatted(`${minDepthMM}`)
          },
          max: {
            millimeters: maxDepthMM,
            // Currently they don't provide in so we must convert from mm
            inches: convertMmToInFormatted(`${maxDepthMM}`)
          }
        }
      },
      rules: {
        trimmable,
        trimOffset: {
          // Force undefined if zero
          bottom: trimOffsetBottomMM || undefined,
          top: trimOffsetTopMM || undefined,
          left: trimOffsetLeftMM || undefined,
          right: trimOffsetRightMM || undefined
        },
        options: marathonModule?.options
          ?.map((x) => x?.partNumber)
          .filter((x) => !!x) // Remove nulls and undefined values IF they exist
          .map((x) => x as string) // Cast to string because we know there are no null/undefined values since we filtered
      }
    };
  };

  const mergeRules = (
    marathonModule: MarathonModule,
    currentRules?: NexusGenObjects['ModuleRules']
  ): NexusGenObjects['ModuleRules'] | undefined => {
    const partNumber = marathonModule?.partNumber?.trim() || currentRules?.partNumber;
    if (!partNumber) throw makeError('Cannot create rule without partNumber', 'ruleMergeMissingPartNumber');

    const marathonRules = makeRulesFromMarathonModule(marathonModule);

    return currentRules
      ? deepmerge(currentRules, marathonRules, {
          // combine arrays using object equality (like in sets)
          arrayMerge: (destinationArray, sourceArray) => [
            ...sourceArray,
            ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s)))
          ]
        })
      : marathonRules;
  };

  const syncProduct = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing products(modules)');
    console.time('products');

    const productsPerPage = MARATHON_SYNC_PRODUCTS_PER_PAGE;
    let pageIndex = 0;
    let emptyPages = 0;

    try {
      console.log('Fetching required data');
      const existingCategories = await db.category.findMany({
        select: {
          id: true,
          slug: true
        }
      });

      const existingTypes = await db.type.findMany({
        select: {
          id: true,
          slug: true
        }
      });

      const existingFinishes = await db.finish.findMany({
        select: {
          id: true,
          slug: true
        }
      });

      const existingCollections = await db.collection.findMany({
        select: {
          id: true,
          slug: true
        }
      });

      console.log('Fetching products');
      const ignoredModules: string[] = [];
      // console.log(print(GET_PRODUCT_LISTING));
      while (pageIndex >= 0) {
        console.log(`Asking for ${productsPerPage} products on page ${pageIndex + 1}`);
        const { data } = await marathonApollo.query<GetProductListingQuery, GetProductListingQueryVariables>({
          query: GET_PRODUCT_LISTING,
          fetchPolicy: 'no-cache',
          variables: {
            first: productsPerPage,
            after: pageIndex * productsPerPage,
            filter: '{"itemId": { "$not": null }}'
          }
        });

        const products = data.getProductListing?.edges || [];

        if (products && products.length > 0) {
          console.log(`Product page ${pageIndex + 1}, fetched ${products.length} products`);

          const partNumbers = products
            // Casting because we're explicitly filtering by only valid values
            .map((productEdge) => productEdge?.node?.partNumber?.trim() as string)
            .filter((x) => !!x);

          const noPartNumberModules = products.filter((x) => !x?.node?.partNumber);
          if (noPartNumberModules && noPartNumberModules.length > 0) {
            logging.warn(`Sync: ${noPartNumberModules.length} modules without part number. Which will get ignored`, {
              noPartNumberModules: noPartNumberModules.map((x) => x?.node?.id)
            });
          }

          const existingModules = await db.module.findMany({
            select: {
              id: true,
              partNumber: true,
              rules: true,
              thumbnailUrl: true
            },
            where: {
              partNumber: {
                in: partNumbers
              }
            }
          });

          // Received products
          const modulesToUpdate = products.filter(
            (productEdge) =>
              // Where exists in the database
              productEdge?.node?.partNumber?.trim() &&
              existingModules.some((mod) => mod.partNumber === productEdge?.node?.partNumber?.trim())
          );

          // Received products
          const modulesToCreate = products.filter(
            // Where it DOESN'T exist in the database
            (productEdge) => {
              const module = productEdge?.node;

              const finishId =
                existingFinishes.find((finish) => finish.slug === module?.spFinish?.slug?.trim())?.id || undefined;
              const collectionId =
                existingCollections.find((collection) => collection.slug === module?.spCollection?.slug?.trim())?.id ||
                undefined;

              const hasExpectedCondition =
                finishId !== undefined &&
                collectionId !== undefined &&
                module?.partNumber?.trim() &&
                !existingModules.some((mod) => mod.partNumber === module.partNumber?.trim());

              if (!hasExpectedCondition) {
                // Casting because we know it should exist, since there's a condition for that in hasExpectedCondition
                ignoredModules.push(module?.partNumber as string);
              }

              return hasExpectedCondition;
            }
          );

          if (modulesToCreate && modulesToCreate.length > 0) {
            console.log(`Batch creating ${modulesToCreate.length} products`);
            try {
              await db.$transaction(async (db) => {
                await db.module.createMany({
                  data: modulesToCreate.map((productEdge) => {
                    const module = productEdge?.node;
                    const rules = mergeRules(module);
                    const sourceThumbnail =
                      module?.productPictures && module.productPictures.length > 0
                        ? module?.productPictures[0]?.fullpath?.trim()
                        : undefined;
                    return {
                      partNumber: module?.partNumber?.trim() as string,
                      externalId: module?.id?.trim(),
                      description: module?.titleDescription?.trim() || undefined,
                      thumbnailUrl: makeThumbnailUrlAndQueue(
                        sourceThumbnail,
                        `image/module/${module?.partNumber?.trim()}${path.extname(sourceThumbnail || '')}`
                      ),
                      // bundleUrl: module?.bundlePath?.fullpath?.trim() || undefined,  // FIX: Uncomment after also importing/uploading the image
                      isSubmodule: module?.isSubmodule || false,
                      hasPegs: module?.hasPegs || false,
                      isMat: module?.isMat || false,
                      // isExtension: module.isExtension || false,, TODO: Make sure they provide this info
                      shouldHideBasedOnWidth:
                        module?.shouldHideBasedOnWidth !== undefined && module?.shouldHideBasedOnWidth !== null
                          ? module?.shouldHideBasedOnWidth
                          : true,
                      alwaysDisplay: module?.alwaysDisplay || false,
                      isEdge: module?.isEdge || false,
                      rules,
                      finishId:
                        existingFinishes.find((finish) => finish.slug === module?.spFinish?.slug?.trim())?.id || -1,
                      collectionId:
                        existingCollections.find((collection) => collection.slug === module?.spCollection?.slug?.trim())
                          ?.id || -1
                      // TODO: Default left extension
                      // TODO: Default right extension
                      // TODO: attachmentToAppend: newRules?.rules.
                    };
                  })
                });

                console.log(`Fetching recently created ${modulesToCreate.length} products`);
                const recentlyCreatedModules = await db.module.findMany({
                  where: {
                    partNumber: {
                      in: modulesToCreate.map((x) => x?.node?.partNumber?.trim() as string).filter((x) => !!x)
                    }
                  },
                  select: {
                    id: true,
                    partNumber: true
                  }
                });

                console.log(`Batch creating ${recentlyCreatedModules.length} product categories`);

                const categoriesToCreate = modulesToCreate.flatMap((productEdge) =>
                  productEdge?.node?.spCategories?.map((cat) => ({
                    catSlug: cat?.slug?.trim(),
                    modulePartNumber: productEdge?.node?.partNumber?.trim()
                  }))
                );

                const categoryAllToCreate = modulesToCreate.map((productEdge) => ({
                  catSlug: 'all',
                  modulePartNumber: productEdge?.node?.partNumber?.trim()
                }));

                await db.moduleCategory.createMany({
                  data: [...categoriesToCreate, ...categoryAllToCreate]
                    .filter((x) => !!x)
                    .map((catModule) => {
                      return {
                        moduleId:
                          recentlyCreatedModules.find((x) => x.partNumber === catModule?.modulePartNumber)?.id || -1,
                        categoryId: existingCategories.find((x) => x.slug === catModule?.catSlug)?.id || -1
                      };
                    })
                });

                console.log(`Batch creating ${recentlyCreatedModules.length} product types`);
                await db.moduleType.createMany({
                  data: modulesToCreate
                    .flatMap((productEdge) =>
                      productEdge?.node?.spDrawerTypes?.map((type) => ({
                        typeSlug: type?.slug?.trim(),
                        modulePartNumber: productEdge?.node?.partNumber?.trim()
                      }))
                    )
                    .filter((x) => !!x)
                    .map((typeModule) => ({
                      moduleId:
                        recentlyCreatedModules.find((x) => x.partNumber === typeModule?.modulePartNumber)?.id || -1,
                      typeId: existingTypes.find((x) => x.slug === typeModule?.typeSlug)?.id || -1
                    }))
                });
                // TODO: module attachments
              });
            } catch (err) {
              logging.error(err, 'Error when batch creating products', {
                modulesToCreate: modulesToCreate?.map((x) => x?.node).filter((x) => !!x),
                existingCollections,
                existingFinishes
              });
            }
          } else {
            console.log(`No module to create`);
          }

          for (let i = 0; i < modulesToUpdate.length; i++) {
            const productEdge = modulesToUpdate[i];

            const module = productEdge?.node;
            if (!module?.partNumber?.trim()) return;

            const existingModule = existingModules.find((x) => x.partNumber === module.partNumber?.trim());
            if (!existingModule) continue;

            console.log(`Updating module #${i + 1} ${module.partNumber?.trim()} of ${modulesToUpdate.length}`);
            const rules = existingModule?.rules as NexusGenObjects['ModuleRules'] | undefined;

            await db.$transaction(async (db) => {
              // Sync categories

              // Delete existing categories to re create
              await db.moduleCategory.deleteMany({
                where: { module: { partNumber: module.partNumber?.trim() }, category: { slug: { not: 'all' } } }
              });

              // If there are categories for this module
              if (module.spCategories && module.spCategories.length > 0) {
                // Create them
                await db.moduleCategory.createMany({
                  data: module.spCategories.map((cat) => ({
                    moduleId: existingModule?.id || -1,
                    categoryId: existingCategories.find((x) => x.slug === cat?.slug?.trim())?.id || -1
                  }))
                });
              }

              // Sync type

              // Delete existing types to then create
              await db.moduleType.deleteMany({ where: { module: { partNumber: module.partNumber?.trim() } } });

              // If there are types for this module
              if (module.spDrawerTypes && module.spDrawerTypes.length > 0) {
                // Create them
                await db.moduleType.createMany({
                  data: module.spDrawerTypes.map((type) => ({
                    moduleId: existingModule?.id || -1,
                    typeId: existingTypes.find((x) => x.slug === type?.slug?.trim())?.id || -1
                  }))
                });
              }

              // TODO: module attachments

              const newRules = mergeRules(module, rules);
              const sourceThumbnail =
                module.productPictures && module.productPictures.length > 0
                  ? module.productPictures[0]?.fullpath?.trim()
                  : undefined;

              await db.module.update({
                where: { partNumber: module.partNumber?.trim() },
                data: {
                  externalId: module.id?.trim(),
                  description: module.titleDescription?.trim() || undefined,
                  thumbnailUrl: makeThumbnailUrlAndQueue(sourceThumbnail, existingModule.thumbnailUrl),
                  // bundleUrl: module.bundlePath?.fullpath?.trim() || undefined,  // FIX: Uncomment after also importing/uploading the image
                  isSubmodule: module.isSubmodule || undefined,
                  hasPegs: module.hasPegs || undefined,
                  isMat: module.isMat || undefined,
                  // isExtension: module.isExtension || false,
                  shouldHideBasedOnWidth:
                    module.shouldHideBasedOnWidth !== undefined && module.shouldHideBasedOnWidth !== null
                      ? module.shouldHideBasedOnWidth
                      : undefined,
                  // alwaysDisplay: module.alwaysDisplay || undefined,
                  // isEdge: module.isEdge || undefined,
                  rules: newRules,

                  finish: module.spFinish?.slug?.trim()
                    ? {
                        connect: {
                          slug: module.spFinish.slug.trim()
                        }
                      }
                    : undefined,
                  collection: module.spCollection?.slug?.trim()
                    ? {
                        connect: {
                          slug: module.spCollection.slug.trim()
                        }
                      }
                    : undefined,
                  defaultLeftExtension: newRules?.extensions?.left
                    ? {
                        connect: {
                          partNumber: newRules.extensions.left
                        }
                      }
                    : undefined,
                  defaultRightExtension: newRules?.extensions?.right
                    ? {
                        connect: {
                          partNumber: newRules.extensions.right
                        }
                      }
                    : undefined
                  // TODO: Default left extension
                  // TODO: Default right extension
                  // TODO: attachmentToAppend: newRules?.rules.
                }
              });
            });
          }

          if (modulesToCreate && modulesToCreate.length === 0 && modulesToUpdate && modulesToUpdate.length === 0) {
            emptyPages++;
            console.log(`Empty page ${emptyPages} of ${MARATHON_SYNC_EMPTY_PAGES_TO_STOP}`);
          } else {
            // Reset count if there's a page that is not empty
            emptyPages = 0;
          }

          if (emptyPages >= MARATHON_SYNC_EMPTY_PAGES_TO_STOP) {
            // Stop
            pageIndex = -1;
            logging.warn(
              `Preemptively stopping sync, since there was no product to sync that followed the criteria after ${MARATHON_SYNC_EMPTY_PAGES_TO_STOP} pages`
            );
          } else {
            // Next page
            pageIndex++;
          }
        } else {
          // If there are no more procuts, it means we should stop
          console.log(`No products on page ${pageIndex + 1}, last page finished.`);
          pageIndex = -1;
        }
      }

      if (ignoredModules && ignoredModules.length > 0) {
        logging.warn(
          `Sync: ${ignoredModules.length} modules that were not created due to not following required criteria`,
          { ignoredModules }
        );
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon products');
    }

    console.log('Finished syncing products');
    console.timeEnd('products');
  };

  const syncData = async () => {
    try {
      console.time('apiSync');
      await syncCategory();
      await syncCollection();
      await syncDrawerType();
      await syncFinish();

      // Always leave products for last!!
      await syncProduct();
      console.timeEnd('apiSync');

      console.time('storageSync');
      await storageSync();
      console.timeEnd('storageSync');
    } catch (err) {
      logging.error(err);
      throw err;
    }
  };

  const createList = async (projectId: number, token?: string) => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    if (!MARATHON_API || !MARATHON_API_CREATE_LIST) {
      throw makeError('Missing marathon environment');
    }

    if (!token) {
      throw new ForbiddenError('unauthorized');
    }

    const project = await db.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw makeError('Project does not exist', 'not-found', 404);
    }

    const name = project.title;
    const cart = await projectService({ db }).getCart(projectId);

    const noExternalIdModules = cart.filter((x) => !x.projectModule.module.externalId);
    if (noExternalIdModules && noExternalIdModules.length > 0) {
      logging.warn(
        `Creating list for project ${project.title}(id: ${projectId}) but this project has ${noExternalIdModules.length} modules with no external id. Which won't be added to the list`,
        {
          noExternalIdModules
        }
      );
      throw makeError("Cannot create list because some modules don't have externalId", 'createListNoExternalId');
    }

    type MarathonCartItem = {
      // the object id of the product
      oid: string;
      // the quantity of the product (optional)
      quantity?: number;
      // a description of the product (optional)
      tag?: string;

      items?: MarathonCartItem[];
    };

    // This generates the data with the same parent/children order we have, but they don't support it hence it's commented
    // const mapToMarathonList = (
    //   cartItem: typeof cart[number] | Omit<typeof cart[number], 'children'>
    // ): MarathonCartItem => ({
    //   // casting because we removed null and undefined on previous filter
    //   oid: cartItem.projectModule.module.externalId as string,
    //   quantity: cartItem.quantity,
    //   items: (cartItem as typeof cart[number]).children
    //     ? (cartItem as typeof cart[number]).children
    //         .filter((x) => x.projectModule.module.externalId)
    //         .map((x) => mapToMarathonList(x as typeof cart[number]))
    //     : undefined
    // });

    // const data: {
    //   // name of the list to be created
    //   list_name: string;
    //   items: MarathonCartItem[];
    // } = {
    //   list_name: number <= 0 ? name : `${name} ${number}`,
    //   items: cart.filter((x) => x.projectModule.module.externalId).map(mapToMarathonList)
    // };

    const items: MarathonCartItem[] = [];

    cart
      .filter((x) => x.projectModule.module.externalId)
      .forEach((cartItem) => {
        items.push({
          oid: cartItem.projectModule.module.externalId as string,
          quantity: cartItem.quantity
        });

        if (cartItem.children && cartItem.children.length > 0) {
          cartItem.children.forEach((cartItem) => {
            items.push({
              oid: cartItem.projectModule.module.externalId as string,
              quantity: cartItem.quantity
            });
          });
        }
      });

    const data: {
      // name of the list to be created
      list_name: string;
      items: MarathonCartItem[];
    } = {
      list_name: name,
      items
    };

    const url = new URL(MARATHON_API_CREATE_LIST, MARATHON_API);
    try {
      const { data: result } = (await axios({
        url: url.toString(),
        method: 'post',
        data,
        headers: {
          'X-AUTH-TOKEN': token
        }
      })) as AxiosResponse<{
        completed: 'yes' | 'no';
        // the object id of the list
        list_oid?: number;
        // the name of the list that has been created
        list_name?: string;
      }>;

      if (result.completed === 'yes') {
        return await db.list.create({
          data: {
            externalId: `${result.list_oid}`,
            name: result.list_name,
            projectId
          }
        });
      } else {
        throw makeError("Couldn't save list", 'createListCannotComplete');
      }
    } catch (err) {
      throw err;
    }
  };

  const login = async (user: { email?: string | null; password?: string | null }) => {
    if (!MARATHON_API || !MARATHON_API_LOGIN) {
      throw new Error('Missing marathon environment');
    }

    const url = new URL(MARATHON_API_LOGIN, MARATHON_API);

    return (await axios({
      method: 'POST',
      url: url.toString(),
      headers: {
        Authorization: `Basic ${Buffer.from(`${user.email}:${user.password}`).toString('base64')}`
      }
    })) as AxiosResponse<{ user_id: number; user_token: string }>;
  };

  return {
    marathonApollo,
    syncData,
    createList,
    login
  };
};
