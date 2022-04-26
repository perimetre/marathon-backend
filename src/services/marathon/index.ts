import { ApolloClient, from, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { Locale, Module, PrismaClient } from '@prisma/client';
import { ForbiddenError } from 'apollo-server';
import axios, { AxiosResponse } from 'axios';
import fetch from 'cross-fetch';
import { helpers } from 'faker';
import { toNumber } from 'lodash';
import path from 'path';
import { URL } from 'url';
import seed from '../../../prisma/seedValues/seed.json';
import { env } from '../../env';
import {
  GetProductListingQuery,
  GetProductListingQueryVariables,
  GetSpCategoryListingQuery,
  GetSpCollectionListingQuery,
  GetSpDrawerTypesListingQuery,
  GetSpFinishListingQuery,
  GetProductQuery,
  GetProductQueryVariables
} from '../../generated/graphql';
import { makeError } from '../../utils/exception';
import { makeFile } from '../../utils/file';
import logging from '../../utils/logging';
import { fileUploadService } from '../fileUpload';
import { projectService } from '../project';
import { MarathonModule, ModuleRules } from './parsing/constants';
import { makeRulesFromMarathonModule, mergeRules } from './parsing/parseRules';
import {
  GET_PRODUCT,
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

  const storageSyncQueue: string[] = [];
  const imagesNotFound: string[] = [];

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
        const imagePath = storageSyncQueue[index];

        promises.push(
          new Promise<void>(async (resolve, reject) => {
            try {
              console.log(`Syncing image #${i + 1} of ${initialLength}`);
              i++;

              try {
                // Download image
                const file = await fileUpload.downloadFile(new URL(imagePath, MARATHON_MEDIA_URI).toString());

                try {
                  // Try to delete current image, but only if managed to download previously
                  await fileUpload.DELETEFilesOnStorageCAUTION([imagePath]);
                } catch {
                  // Do nothing, file probably doesn't exist
                }

                // Upload new image
                await fileUpload.uploadFileToStorage(file.data, imagePath);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (err: any) {
                if (err?.response?.status && err.response.status === 404) {
                  imagesNotFound.push(new URL(imagePath, MARATHON_MEDIA_URI).toString());
                } else {
                  logging.error(err, 'Could not sync image');
                }
              }
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

    if (imagesNotFound.length > 0) {
      logging.warn('These images returned 404', { missingFiles: imagesNotFound });
    }
  };

  const syncCategory = async (skipDatabase?: boolean) => {
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
      console.log(`Fetched ${categories.length} categories`);

      if (!skipDatabase && categories && categories.length > 0) {
        // Get all categories that we already have
        const existingCategories = await db.category.findMany({
          select: { externalId: true, slug: true }
        });

        // Received categories
        const categoriesToUpdate = categories.filter((categoryEdge) =>
          // Where exists in the database
          existingCategories.some((cat) => cat.externalId === categoryEdge?.node?.id)
        );

        // Received categories
        const categoriesToCreate = categories.filter(
          // Where it DOESN'T exist in the database
          (categoryEdge) => !existingCategories.some((cat) => cat.externalId === categoryEdge?.node?.id)
        );

        const categoriesWithSlug = existingCategories.filter((cat) =>
          categoriesToCreate.some((categoryEdge) => categoryEdge?.node?.slug === cat.slug)
        );

        for (let i = 0; i < categoriesToUpdate.length; i++) {
          const categoryEdge = categoriesToUpdate[i];
          const id = categoryEdge?.node?.id;

          if (!id) continue;

          console.log(`Updating category id: ${id} #${i + 1} of ${categoriesToUpdate.length}`);

          await db.category.update({
            where: { externalId: id },
            data: {
              name: categoryEdge?.node?.name?.trim(),
              slug: categoryEdge?.node?.slug?.trim()
            }
          });
        }

        if (categoriesToCreate && categoriesToCreate.length > 0) {
          console.log(`Batch creating ${categoriesToCreate.length} categories`);
          await db.category.createMany({
            data: categoriesToCreate
              .filter((categoryEdge) => categoryEdge?.node?.id && categoryEdge?.node?.slug && categoryEdge?.node?.name)
              .map((categoryEdge) => {
                let slug = categoryEdge?.node?.slug?.trim() as string;

                const sameSlugCategories = categoriesWithSlug.filter((cat) => cat.slug === slug);
                if (sameSlugCategories?.length > 0) {
                  slug = `${slug}-${sameSlugCategories.length}`;
                }

                return {
                  // Casting because we're sure, since there's a filter right above
                  externalId: categoryEdge?.node?.id as string,
                  slug,
                  name: categoryEdge?.node?.name?.trim() as string
                };
              })
          });
        } else {
          console.log(`No category to create`);
        }
      }

      if (!skipDatabase) {
        const allCategory = await db.category.findUnique({ where: { slug: 'all' } });
        if (!allCategory) {
          await db.category.create({
            data: {
              name: 'All',
              slug: 'all'
            }
          });
        }
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon categories');
    }

    console.log('Finished syncing categories');
    console.timeEnd('categories');
  };

  const syncCollection = async (skipDatabase?: boolean) => {
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
      console.log(`Fetched ${collections.length} collections`);

      if (!skipDatabase && collections && collections.length > 0) {
        const existingCollections = await db.collection.findMany({
          select: {
            externalId: true,
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          }
        });

        // Received collections
        const collectionsToUpdate = collections.filter((collectionEdge) =>
          // Where exists in the database
          existingCollections.some((col) => col.externalId === collectionEdge?.node?.id)
        );

        const whitelistedSlugs = MARATHON_COLLECTIONS_WHITELIST.split(',').filter((x) => !!x);

        // Received collections
        const collectionsToCreate = collections.filter(
          // Where it DOESN'T exist in the database
          (collectionEdge) =>
            collectionEdge?.node?.slug?.trim() &&
            !existingCollections.some((col) => col.externalId === collectionEdge?.node?.id) &&
            whitelistedSlugs.includes(collectionEdge.node.slug.trim())
        );

        const collectionsWithSlug = existingCollections.filter((col) =>
          collectionsToCreate.some((collectionEdge) => collectionEdge?.node?.slug === col.slug)
        );

        for (let i = 0; i < collectionsToUpdate.length; i++) {
          const collectionEdge = collectionsToUpdate[i];
          const id = collectionEdge?.node?.id;

          const currentCollection = existingCollections.find((x) => x.externalId === id);
          if (!currentCollection || !currentCollection.externalId) continue;

          console.log(
            `Updating collection id: ${currentCollection.externalId} #${i + 1} of ${collectionsToUpdate.length}`
          );

          const translationIds = currentCollection.translations.map((x) => x.id);
          const thumbnailUrl = collectionEdge?.node?.image?.fullpath;

          if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

          await db.collection.update({
            where: { externalId: currentCollection.externalId },
            data: {
              slug: collectionEdge?.node?.slug?.trim(),
              thumbnailUrl,
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
              .map((collectionEdge) => {
                let slug = collectionEdge?.node?.slug?.trim() as string;

                const sameSlugCollections = collectionsWithSlug.filter((col) => col.slug === slug);
                if (sameSlugCollections?.length > 0) {
                  slug = `${slug}-${sameSlugCollections.length}`;
                }

                const thumbnailUrl = collectionEdge?.node?.image?.fullpath?.trim();

                if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

                return {
                  // Casting because we're sure, since there's a filter right above
                  externalId: collectionEdge?.node?.id as string,
                  slug,
                  thumbnailUrl,
                  hasPegs: collectionEdge?.node?.hasPegs || false,
                  isComingSoon: collectionEdge?.node?.isComingSoon || false
                };
              })
          });

          console.log(`Fetching recently created ${collectionsToCreate.length} collections`);
          const recentlyCreatedCollections = await db.collection.findMany({
            where: { externalId: { in: collectionsToCreate.map((x) => x?.node?.id as string).filter((x) => !!x) } },
            select: {
              id: true,
              externalId: true
            }
          });

          console.log(`Batch creating ${recentlyCreatedCollections.length} collection translations`);
          await db.collectionTranslations.createMany({
            data: recentlyCreatedCollections.map((dbCollection) => {
              // The type is undefined, but we're sure it returns correctly(at least it should)
              // Worst case translations will be empty, and that's their fault
              const collection = collectionsToCreate.find((x) => x?.node?.id === dbCollection.externalId);

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
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon collections');
    }

    console.log('Finished syncing collections');
    console.timeEnd('collections');
  };

  const syncDrawerType = async (skipDatabase?: boolean) => {
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
      console.log(`Fetched ${drawerTypes.length} drawer types`);

      if (!skipDatabase && drawerTypes && drawerTypes.length > 0) {
        const existingDrawerTypes = await db.type.findMany({
          select: {
            externalId: true,
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          }
        });

        // Received drawer types
        const drawerTypesToUpdate = drawerTypes.filter((drawerTypeEdge) =>
          // Where exists in the database
          existingDrawerTypes.some((type) => type.externalId === drawerTypeEdge?.node?.id)
        );

        const whitelistedSlugs = MARATHON_DRAWER_TYPES_WHITELIST.split(',').filter((x) => !!x);

        // Received drawer types
        const drawerTypesToCreate = drawerTypes.filter(
          // Where it DOESN'T exist in the database
          (drawerTypeEdge) =>
            drawerTypeEdge?.node?.slug?.trim() &&
            !existingDrawerTypes.some((type) => type.externalId === drawerTypeEdge?.node?.id) &&
            whitelistedSlugs.includes(drawerTypeEdge.node.slug.trim())
        );

        const typesWithSlug = existingDrawerTypes.filter((type) =>
          drawerTypesToCreate.some((typeEdge) => typeEdge?.node?.slug === type.slug)
        );

        for (let i = 0; i < drawerTypesToUpdate.length; i++) {
          const drawerTypeEdge = drawerTypesToUpdate[i];
          const id = drawerTypeEdge?.node?.id;

          const currentDrawerType = existingDrawerTypes.find((x) => x.externalId === id);
          if (!currentDrawerType || !currentDrawerType.externalId) continue;

          console.log(
            `Updating drawer type id: ${currentDrawerType.externalId}  #${i + 1} of ${drawerTypesToUpdate.length}`
          );

          const translationIds = currentDrawerType.translations.map((x) => x.id);

          const thumbnailUrl = drawerTypeEdge?.node?.image?.fullpath;

          if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

          await db.type.update({
            where: { externalId: currentDrawerType.externalId },
            data: {
              slug: drawerTypeEdge?.node?.slug?.trim(),
              thumbnailUrl,
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
              .map((drawerTypeEdge) => {
                let slug = drawerTypeEdge?.node?.slug?.trim() as string;

                const sameSlugTypes = typesWithSlug.filter((type) => type.slug === slug);
                if (sameSlugTypes?.length > 0) {
                  slug = `${slug}-${sameSlugTypes.length}`;
                }

                const thumbnailUrl = drawerTypeEdge?.node?.image?.fullpath?.trim();

                if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

                return {
                  // Casting because we're filtering right above
                  externalId: drawerTypeEdge?.node?.id as string,
                  slug,
                  thumbnailUrl,
                  hasPegs: drawerTypeEdge?.node?.hasPegs || false
                  // isComingSoon: drawerTypeEdge?.node?.isComingSoon || false
                };
              })
          });

          console.log(`Fetching recently created ${drawerTypesToCreate.length} drawer types`);
          const recentlyCreatedDrawerTypes = await db.collection.findMany({
            where: { externalId: { in: drawerTypesToCreate.map((x) => x?.node?.id as string).filter((x) => !!x) } },
            select: {
              id: true,
              externalId: true
            }
          });

          console.log(`Batch creating ${recentlyCreatedDrawerTypes.length} drawer types translations`);
          await db.typeTranslations.createMany({
            data: recentlyCreatedDrawerTypes.map((dbType) => {
              // This returns undefined, but we're sure it returns correctly(at least it should)
              const drawerType = drawerTypesToCreate.find((x) => x?.node?.id === dbType.externalId);

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
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon drawer types');
    }

    console.log('Finished syncing drawer types');
    console.timeEnd('drawerType');
  };

  const syncFinish = async (skipDatabase?: boolean) => {
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
      console.log(`Fetched ${finishes.length} finishes`);

      if (!skipDatabase && finishes && finishes.length > 0) {
        const existingFinishes = await db.finish.findMany({
          select: {
            externalId: true,
            slug: true,
            thumbnailUrl: true,
            translations: {
              where: { locale: defaultSyncLocale },
              select: { id: true }
            }
          }
        });

        // Received finishes
        const finishesToUpdate = finishes.filter((finishEdge) =>
          // Where exists in the database
          existingFinishes.some((fin) => fin.externalId === finishEdge?.node?.id)
        );

        const whitelistedSlugs = MARATHON_FINISHES_WHITELIST.split(',').filter((x) => !!x);

        // Received finishes
        const finishesToCreate = finishes.filter(
          // Where it DOESN'T exist in the database
          (finishEdge) =>
            finishEdge?.node?.slug?.trim() &&
            !existingFinishes.some((fin) => fin.externalId === finishEdge?.node?.id) &&
            whitelistedSlugs.includes(finishEdge.node.slug.trim())
        );

        const finishesWithSlug = existingFinishes.filter((fin) =>
          finishesToCreate.some((finishEdge) => finishEdge?.node?.slug === fin.slug)
        );

        for (let i = 0; i < finishesToUpdate.length; i++) {
          const finishEdge = finishesToUpdate[i];
          const id = finishEdge?.node?.id;

          const currentFinish = existingFinishes.find((x) => x.externalId === id);
          if (!currentFinish || !currentFinish.externalId) continue;

          console.log(`Updating finish id: ${id} #${i + 1} of ${finishesToUpdate.length}`);

          const translationIds = currentFinish.translations.map((x) => x.id);

          const thumbnailUrl = finishEdge?.node?.image?.fullpath;

          if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

          await db.finish.update({
            where: { externalId: currentFinish.externalId },
            data: {
              slug: finishEdge?.node?.slug?.trim(),
              thumbnailUrl,
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
              .map((finishEdge) => {
                let slug = finishEdge?.node?.slug?.trim() as string;

                const sameSlugFinishes = finishesWithSlug.filter((fin) => fin.slug === slug);
                if (sameSlugFinishes?.length > 0) {
                  slug = `${slug}-${sameSlugFinishes.length}`;
                }

                const thumbnailUrl = finishEdge?.node?.image?.fullpath?.trim();

                if (thumbnailUrl) storageSyncQueue.push(thumbnailUrl);

                return {
                  // Casing since we're filtering right above
                  externalId: finishEdge?.node?.id?.trim() as string,
                  slug,
                  thumbnailUrl
                };
              })
          });

          console.log(`Fetching recently created ${finishesToCreate.length} finishes`);
          const recentlyCreatedFinishes = await db.finish.findMany({
            where: { externalId: { in: finishesToCreate.map((x) => x?.node?.id as string).filter((x) => !!x) } },
            select: {
              id: true,
              slug: true,
              externalId: true
            }
          });

          const collectionsForFinishes = await db.collection.findMany({
            where: {
              slug: {
                in: seed.collectionFinishes
                  .filter((colFin) => recentlyCreatedFinishes.some((dbFin) => dbFin.slug === colFin.finish))
                  .map((x) => x.collection)
              }
            }
          });

          console.log(`Batch creating ${recentlyCreatedFinishes.length} finish translations`);
          await db.finishTranslations.createMany({
            data: recentlyCreatedFinishes.map((dbFinish) => {
              // This returns undefined, but we're sure it returns correctly(at least it should)
              const finish = finishesToCreate.find((x) => x?.node?.id === dbFinish.externalId);

              return {
                locale: defaultSyncLocale,
                description: finish?.node?.description?.trim() || '',
                name: finish?.node?.name?.trim() || '',
                finishId: dbFinish.id
              };
            })
          });

          console.log(`Batch creating ${recentlyCreatedFinishes.length} collection finishes`);
          await db.collectionFinishes.createMany({
            data: recentlyCreatedFinishes.map((dbFinish) => {
              const collectionFinish = seed.collectionFinishes.find((x) => x.finish === dbFinish.slug);
              const collection = collectionsForFinishes.find((x) => x.slug === collectionFinish?.collection);

              return {
                finishId: dbFinish.id,
                collectionId: collection?.id || -1
              };
            })
          });
        } else {
          console.log(`No finish to create`);
        }
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon finishes');
    }

    console.log('Finished syncing finishes');
    console.timeEnd('finish');
  };

  const syncSlides = async (skipDatabase?: boolean) => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    console.log('Syncing slides');
    console.time('slides');
    console.log('Fetching slides');

    try {
      // const { data } = await marathonApollo.query<GetSpFinishListingQuery>({
      //   query: GET_SP_FINISH_LISTING,
      //   fetchPolicy: 'no-cache'
      // });
      const data = seed.slides;

      const slides = data;
      console.log(`Fetched ${slides.length} slides`);

      if (!skipDatabase && slides && slides.length > 0) {
        for (let i = 0; i < slides.length; i++) {
          const slideEdge = slides[i];

          console.log(`Upserting slide #${i + 1} of ${slides.length}`);

          const supplierSlug = helpers.slugify(slideEdge.supplier).toLowerCase();
          const slideSlug = helpers
            .slugify(`${slideEdge.supplier}-${slideEdge.product}-${slideEdge.collection}`)
            .toLowerCase();

          let existingSlide = await db.slide.findUnique({ where: { slug: slideSlug } });

          if (!existingSlide) {
            if (!skipDatabase) {
              existingSlide = await db.slide.create({
                data: {
                  slug: slideSlug,
                  formula: slideEdge.formula,
                  product: slideEdge.product,
                  supplier: {
                    connectOrCreate: {
                      where: {
                        slug: supplierSlug
                      },
                      create: {
                        name: slideEdge.supplier,
                        slug: supplierSlug,
                        thumbnailUrl: seed.supplierLogos.find((y) => y.supplier === supplierSlug)?.supplierImgURL
                      }
                    }
                  },
                  collection: {
                    connect: {
                      slug: slideEdge.collection
                    }
                  }
                }
              });
            }
          } else if (false) {
            if (!skipDatabase) {
              // Commented for now since we're using seed so data would never be updated
              // existingSlide =  await db.slide.update({
              //   where: { slug: slideSlug },
              //   data: {
              //     formula: slideEdge.formula,
              //     product: slideEdge.product,
              //     supplier: {
              //       connectOrCreate: {
              //         where: {
              //           slug: supplierSlug
              //         },
              //         create: {
              //           name: slideEdge.supplier,
              //           slug: supplierSlug,
              //           thumbnailUrl: seed.supplierLogos.find((y) => y.supplier === supplierSlug)?.supplierImgURL
              //         }
              //       }
              //     },
              //     collection: {
              //       connect: {
              //         slug: slideEdge.collection
              //       }
              //     }
              //   }
              // });
              // await db.slideDepth.deleteMany({ where: { slideId: existingSlide.id } });
            }
          }

          const depths = slideEdge.depth;
          if (!skipDatabase && existingSlide && depths?.length > 0) {
            await db.slideDepth.createMany({
              data: depths.map(({ roundedValue, value }) => ({
                display: `${roundedValue}mm`,
                depth: toNumber(value),
                slideId: existingSlide?.id || -1
              }))
            });
          }
        }
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon slides');
    }

    console.log('Finished syncing slides');
    console.timeEnd('slides');
  };

  const upsertProductModule = async (
    module: ModuleRules,
    skipDatabase?: boolean,
    originalMarathonProductJson?: MarathonModule
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<'created' | 'updated' | (string & {})> => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    if (!module.externalId) return `Module ${module.partNumber} has no externalId`;

    let status = 'created';

    console.log(`Upserting module ${module.partNumber} ${module.externalId}`);

    //const dir = path.join(__dirname, `./output`, '../../../../../marathon-module-jsons');
    //makeFile(dir, path.join(`jsons/${module.partNumber}.json`), module);

    const existingProduct = await db.module.findUnique({
      where: {
        externalId: module.externalId
      }
    });

    const partNumberProduct = await db.module.findMany({
      where: {
        partNumber: { startsWith: module.partNumber }
      }
    });

    // Removes unwanted data out of "module"
    const { finish, collection, drawerTypes, categories, otherFinishes, extensions, dimensions, ...moduleRest } =
      module;

    let { partNumber } = module;

    if (!existingProduct && partNumberProduct?.length > 0) {
      partNumber = `${partNumber}-${partNumberProduct.length}`;
    }

    let resultModule: Module | undefined;

    //! Use interactive transactions with caution. Keeping transactions open for a long time hurts database performance and can even cause deadlocks.
    //! Try to avoid performing network requests and executing slow queries inside, get in and out as quick as possible!
    // await db.$transaction(async (db) => {
    if (!existingProduct) {
      if (!skipDatabase) {
        resultModule = await db.module.create({
          data: {
            ...moduleRest,
            partNumber,
            rules: module,
            originalMarathonProductJson,
            finish: {
              connect: {
                externalId: finish.externalId
              }
            },
            collection: {
              connect: {
                externalId: collection.externalId
              }
            },
            defaultLeftExtension: extensions?.left
              ? {
                  connect: {
                    partNumber: extensions.left
                  }
                }
              : undefined,
            defaultRightExtension: extensions?.right
              ? {
                  connect: {
                    partNumber: extensions.right
                  }
                }
              : undefined,
            attachmentToAppend: module.rules?.queue?.append
              ? {
                  connect: {
                    partNumber: module.rules.queue.append
                  }
                }
              : undefined
          }
        });
      }
    } else {
      status = 'updated';
      if (!skipDatabase) {
        const rules = existingProduct.rules ? mergeRules(module, existingProduct.rules as ModuleRules) : module;

        await db.module.update({
          where: { id: existingProduct.id },
          data: {
            ...moduleRest,
            partNumber,
            rules,
            originalMarathonProductJson,
            finish: {
              connect: {
                externalId: finish.externalId
              }
            },
            collection: {
              connect: {
                externalId: collection.externalId
              }
            },
            defaultLeftExtension: extensions?.left
              ? {
                  connect: {
                    partNumber: extensions.left
                  }
                }
              : undefined,
            defaultRightExtension: extensions?.right
              ? {
                  connect: {
                    partNumber: extensions.right
                  }
                }
              : undefined,
            attachmentToAppend: module.rules?.queue?.append
              ? {
                  connect: {
                    partNumber: module.rules.queue.append
                  }
                }
              : undefined
          }
        });

        // If this module already exists, it already has all the relations, so delete them for them to be created
        // This is needed in case they completely changed the values here
        await db.moduleType.deleteMany({ where: { module: { id: existingProduct.id } } });
        await db.moduleCategory.deleteMany({ where: { module: { id: existingProduct.id } } });
        await db.moduleAttachments.deleteMany({ where: { module: { id: existingProduct.id } } });
      }
    }

    if (resultModule) {
      if (!skipDatabase && drawerTypes && drawerTypes.length > 0) {
        const existingTypes = await db.type.findMany({
          where: {
            externalId: {
              // Casting since we're filtering right before
              in: drawerTypes.filter((x) => !!x).map((x) => x?.externalId as string)
            }
          },
          select: {
            id: true,
            externalId: true
          }
        });

        await db.moduleType.createMany({
          data: drawerTypes.map((type) => ({
            moduleId: resultModule?.id || -1,
            typeId: existingTypes.find((x) => x.externalId === type?.externalId)?.id || -1
          }))
        });
      }

      if (!skipDatabase && categories && categories.length > 0) {
        const existingCategories = await db.category.findMany({
          where: {
            OR: [
              {
                externalId: {
                  // Casting since we're filtering right before
                  in: categories.filter((x) => !!x).map((x) => x?.externalId as string)
                }
              },
              {
                slug: 'all'
              }
            ]
          },
          select: {
            id: true,
            externalId: true,
            slug: true
          }
        });

        await db.moduleCategory.createMany({
          // Manually add the all category
          data: [...categories, { slug: 'all', externalId: undefined }].map((category) => ({
            moduleId: resultModule?.id || -1,
            categoryId:
              existingCategories.find(
                // Whether it's the correct category or all category
                (x) => x.externalId === category?.externalId || (category?.slug === 'all' && x.slug === 'all')
              )?.id || -1
          }))
        });
      }

      const moduleAttachments = module.rules?.queue?.modules;

      if (!skipDatabase && moduleAttachments && moduleAttachments.length > 0) {
        const existingModules = await db.module.findMany({
          where: {
            partNumber: { in: moduleAttachments.map((x) => x) }
          },
          select: {
            id: true,
            partNumber: true
          }
        });

        await db.moduleAttachments.createMany({
          // Manually add the all category
          data: moduleAttachments.map((modAttachment) => ({
            moduleId: resultModule?.id || -1,
            attachmentId: existingModules.find((x) => x.partNumber === modAttachment)?.id || -1
          }))
        });
      }

      if (resultModule.thumbnailUrl) storageSyncQueue.push(resultModule.thumbnailUrl);
    }
    // });

    return status;
  };

  const syncProduct = async (skipDatabase?: boolean) => {
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
      const existingFinishes = await db.finish.findMany({
        select: {
          id: true,
          externalId: true
        }
      });

      const existingCollections = await db.collection.findMany({
        select: {
          id: true,
          externalId: true
        }
      });

      console.log('Fetching products');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ignoredModules: any[] = [];
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

        let products = data.getProductListing?.edges || [];

        if (products && products.length > 0) {
          console.log(`Product page ${pageIndex + 1}, fetched ${products.length} products`);

          products = products.filter(
            // Where it DOESN'T exist in the database
            (productEdge) => {
              // Make a big filter because their api decides to return unrelated stuff, so we need to hard filter everything

              const module = productEdge?.node;

              // So we grab a finish Id if any(there should always be one)
              const finishId =
                existingFinishes.find((finish) => finish.externalId === module?.spFinish?.id)?.id || undefined;

              // So we grab a collection Id if any(there should always be one)
              const collectionId =
                existingCollections.find((collection) => collection.externalId === module?.spCollection?.id)?.id ||
                undefined;

              // And filter
              const hasExpectedCondition =
                finishId && // Is there finish id(should have)
                collectionId && // Is there collection id(should have)
                module?.id; // Does it have an id itself (all of them should have id)

              if (!hasExpectedCondition) {
                ignoredModules.push({ finishId, collectionId, module });
              }

              return hasExpectedCondition;
            }
          );

          const parsedProducts = products
            .filter((x) => !!x?.node)
            .flatMap((productEdge) => {
              try {
                // Casting since we filtered it previously
                return {
                  ...makeRulesFromMarathonModule(productEdge?.node as MarathonModule),
                  originalMarathonProductJson: productEdge
                };
              } catch (err) {
                logging.error(
                  err,
                  `Could not parse and convert module ${productEdge?.node?.partNumber} ${productEdge?.node?.id}`
                );
                return undefined;
              }
            })
            .filter((x) => !!x)
            // We do this just for casting, since we know it won't be undefined due to the filter above
            .map(
              (x) =>
                x as ReturnType<typeof makeRulesFromMarathonModule> & { originalMarathonProductJson: MarathonModule }
            );

          console.log(`Going to upsert ${parsedProducts.length} products`);

          let created = 0;
          let updated = 0;

          for (let i = 0; i < parsedProducts.length; i++) {
            const product = parsedProducts[i];

            console.log(`Product ${i + 1} out of ${parsedProducts.length}`);

            try {
              if (product.attachments?.append) {
                const appendStatus = await upsertProductModule(
                  product.attachments.append,
                  skipDatabase,
                  product.originalMarathonProductJson
                );
                if (appendStatus === 'created') {
                  created++;
                } else if (appendStatus === 'updated') {
                  updated++;
                } else {
                  throw makeError(`Could not upsert attachment append: ${appendStatus}`, 'cannotUpsertAppend');
                }
              }

              if (product.attachments?.queueModules && product.attachments.queueModules.length > 0) {
                for (let j = 0; j < product.attachments.queueModules.length; j++) {
                  const queueModule = product.attachments.queueModules[j];
                  const queueStatus = await upsertProductModule(
                    queueModule,
                    skipDatabase,
                    product.originalMarathonProductJson
                  );
                  if (queueStatus === 'created') {
                    created++;
                  } else if (queueStatus === 'updated') {
                    updated++;
                  } else {
                    throw makeError(
                      `Could not upsert attachment queue module: ${queueStatus}`,
                      'cannotUpsertQueueModule'
                    );
                  }
                }
              }

              if (product.extensions?.left) {
                const extensionStatus = await upsertProductModule(
                  product.extensions.left,
                  skipDatabase,
                  product.originalMarathonProductJson
                );
                if (extensionStatus === 'created') {
                  created++;
                } else if (extensionStatus === 'updated') {
                  updated++;
                } else {
                  throw makeError(`Could not upsert left extension: ${extensionStatus}`, 'cannotUpsertLeftExtension');
                }
              }

              if (product.extensions?.right) {
                const extensionStatus = await upsertProductModule(
                  product.extensions.right,
                  skipDatabase,
                  product.originalMarathonProductJson
                );
                if (extensionStatus === 'created') {
                  created++;
                } else if (extensionStatus === 'updated') {
                  updated++;
                } else {
                  throw makeError(`Could not upsert right extension: ${extensionStatus}`, 'cannotUpsertRightExtension');
                }
              }

              if (product.alternative) {
                const alternativeStatus = await upsertProductModule(
                  product.alternative,
                  skipDatabase,
                  product.originalMarathonProductJson
                );
                if (alternativeStatus === 'created') {
                  created++;
                } else if (alternativeStatus === 'updated') {
                  updated++;
                } else {
                  throw makeError(
                    `Could not upsert alternative version: ${alternativeStatus}`,
                    'cannotUpsertAlternative'
                  );
                }
              }

              const productStatus = await upsertProductModule(
                product.module,
                skipDatabase,
                product.originalMarathonProductJson
              );
              if (productStatus === 'created') {
                created++;
              } else if (productStatus === 'updated') {
                updated++;
              } else {
                throw makeError(`Could not upsert main product: ${productStatus}`, 'cannotUpsertMainProduct');
              }
            } catch (err) {
              logging.error(
                err,
                `Error upserting product ${i + 1} out of ${parsedProducts.length}. ${product.module.partNumber} ${
                  product.module.externalId
                }`
              );
            }
          }

          if (created === 0 && updated === 0) {
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
          // If there are no more products, it means we should stop
          console.log(`No products on page ${pageIndex + 1}, last page finished.`);
          pageIndex = -1;
        }
      }

      if (ignoredModules && ignoredModules.length > 0) {
        try {
          const dir = path.join(__dirname, `./output`, '../../../../../marathon-logs');
          makeFile(dir, path.join(`ignored-modules.json`), { ignoredModules });
        } catch {
          // Do nothing
        }
        logging.warn(
          `Sync: ${ignoredModules.length} modules that were not created due to not following required criteria`
        );
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon products');
    }

    console.log('Finished syncing products');
    console.timeEnd('products');
  };

  const syncData = async (skipDatabase?: boolean) => {
    try {
      console.time('apiSync');
      await syncCategory(skipDatabase);
      await syncCollection(skipDatabase);
      await syncDrawerType(skipDatabase);
      await syncFinish(skipDatabase);
      await syncSlides(skipDatabase);

      // Always leave products for last!!
      await syncProduct(skipDatabase);
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

    // Flatten the product list
    cart
      .filter((x) => x.projectModule.module.externalId)
      .forEach((cartItem) => {
        items.push({
          oid:
            (cartItem.projectModule.module.ownerExternalId as string) ||
            (cartItem.projectModule.module.externalId as string),
          quantity: cartItem.quantity
        });

        if (cartItem.children && cartItem.children.length > 0) {
          cartItem.children.forEach((cartItem) => {
            items.push({
              oid:
                (cartItem.projectModule.module.ownerExternalId as string) ||
                (cartItem.projectModule.module.externalId as string),
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

  const fetchSingleProduct = async (id: string) => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const { data } = await marathonApollo.query<GetProductQuery, GetProductQueryVariables>({
      query: GET_PRODUCT,
      fetchPolicy: 'no-cache',
      variables: {
        id: Number(id)
      }
    });

    if (data?.getProduct) {
      const parsedRules = makeRulesFromMarathonModule(data.getProduct);

      const currentDbEntry = await db.module.findUnique({ where: { externalId: id } });

      return {
        original: data.getProduct,
        parsedRules,
        currentDbEntry
      };
    } else {
      throw makeError(`Module with id ${id} does not exist`, 'moduleDoesNotExist', 404);
    }
  };

  return {
    marathonApollo,
    syncData,
    createList,
    login,
    fetchSingleProduct
  };
};
