import axios, { AxiosResponse } from 'axios';
import { env } from '../../env';
import logging from '../../utils/logging';
import { Locale, PrismaClient } from '@prisma/client';
import {
  GET_PRODUCT_LISTING,
  GET_SP_CATEGORY_LISTING,
  GET_SP_COLLECTION_LISTING,
  GET_SP_DRAWER_TYPES_LISTING,
  GET_SP_FINISH_LISTING,
  GetProductListingQuery,
  GetSpCategoryListingQuery,
  GetSpCollectionListingQuery,
  GetSpDrawerTypesListingQuery,
  GetSpFinishListingQuery
} from './queries';
import { Product } from '../../typings/Product';
import { URL } from 'url';
import { ForbiddenError } from 'apollo-server';
import { projectService } from '../project';
import { makeError } from '../../utils/exception';
import pLimit from 'p-limit';
import { NexusGenObjects } from '../../generated/nexus';

type MarathonServiceDependencies = {
  db?: PrismaClient;
};

export const marathonService = ({ db }: MarathonServiceDependencies) => {
  const { MARATHON_API, MARATHON_API_GRAPHQL, MARATHON_API_GRAPHQL_KEY, MARATHON_API_CREATE_LIST, MARATHON_API_LOGIN } =
    env;

  const concurrencyLimit = 5;
  const defaultSyncLocale: Locale = 'en';

  const marathonGraphql = async <T>(query: string) => {
    if (!MARATHON_API || !MARATHON_API_GRAPHQL || !MARATHON_API_GRAPHQL_KEY) {
      throw new Error('Missing marathon environment');
    }

    const url = new URL(MARATHON_API_GRAPHQL, MARATHON_API);
    url.searchParams.append('apiKey', MARATHON_API_GRAPHQL_KEY);

    const { data } = (await axios({
      url: url.toString(),
      method: 'post',
      data: { query: query }
    })) as AxiosResponse<T>;
    return data;
  };

  const syncCategory = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    console.log('Syncing categories');

    console.log('Fetching categories');

    try {
      const data = await marathonGraphql<GetSpCategoryListingQuery>(GET_SP_CATEGORY_LISTING);

      const categories = data?.data?.getSpCategoryListing?.edges || [];
      if (categories && categories.length > 0) {
        console.log(`Fetched ${categories.length} categories`);

        const slugs = categories.map(({ node: category }) => category.slug?.trim() as string).filter((x) => !!x);
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
        const categoriesToUpdate = categories.filter(({ node: category }) =>
          // Where exists in the database
          existingCategories.some((cat) => cat.slug === category.slug?.trim())
        );

        // Received categories
        const categoriesToCreate = categories.filter(
          // Where it DOESN'T exist in the database
          ({ node: category }) => !existingCategories.some((cat) => cat.slug === category.slug?.trim())
        );

        // Limit amount of concurrent promises
        const limit = pLimit(concurrencyLimit);

        const toUpdate = categoriesToUpdate.map(({ node: { id, slug, name } }, index) =>
          limit(() => {
            return async () => {
              slug = slug?.trim();
              console.log(`Updating category #${index + 1} ${slug} of ${categoriesToUpdate.length}`);
              return await db.category.update({
                where: { slug },
                data: {
                  externalId: id?.trim(),
                  name: name?.trim()
                }
              });
            };
          })
        );

        await Promise.all(toUpdate);

        console.log(`Batch creating ${categoriesToCreate.length} categories`);
        await db.category.createMany({
          data: categoriesToCreate.map(({ node: { id, slug, name } }) => ({
            externalId: id?.trim(),
            slug: slug?.trim(),
            name: name?.trim()
          }))
        });
      } else {
        console.log('No category has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon categories');
    }

    console.log('Finished syncing categories');
  };

  const syncCollection = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing collections');

    console.log('Fetching collections');
    try {
      const data = await marathonGraphql<GetSpCollectionListingQuery>(GET_SP_COLLECTION_LISTING);

      const collections = data?.data.getSpCollectionListing.edges || [];
      if (collections && collections.length > 0) {
        console.log(`Fetched ${collections.length} collections`);

        const slugs = collections.map(({ node: collection }) => collection.slug?.trim() as string).filter((x) => !!x);

        const existingCollections = await db.collection.findMany({
          select: {
            slug: true,
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
        const collectionsToUpdate = collections.filter(({ node: collection }) =>
          // Where exists in the database
          existingCollections.some((col) => col.slug === collection.slug?.trim())
        );

        // Received collections
        const collectionsToCreate = collections.filter(
          // Where it DOESN'T exist in the database
          ({ node: collection }) => !existingCollections.some((col) => col.slug === collection.slug?.trim())
        );

        // Limit amount of concurrent promises
        const limit = pLimit(concurrencyLimit);

        const toUpdate = collectionsToUpdate.map(
          ({ node: { id, slug, image, hasPegs, name, subtitle, description } }, index) =>
            limit(() => {
              return async () => {
                slug = slug?.trim();
                console.log(`Updating collection #${index + 1} ${slug} of ${collectionsToUpdate.length}`);

                const translationIds = existingCollections.find((x) => x.slug === slug)?.translations.map((x) => x.id);

                return await db.collection.update({
                  where: { slug },
                  data: {
                    externalId: id?.trim(),
                    thumbnailUrl: image?.fullpath?.trim(),
                    hasPegs: hasPegs || false,
                    // isComingSoon,
                    translations:
                      translationIds && translationIds.length > 0
                        ? {
                            update: {
                              // Theoretically we should only have one id for locale+slug
                              where: { id: translationIds[0] },
                              data: {
                                name: name?.trim(),
                                subtitle: subtitle?.trim(),
                                description: description?.trim()
                              }
                            }
                          }
                        : undefined
                  }
                });
              };
            })
        );

        await Promise.all(toUpdate);

        console.log(`Batch creating ${collectionsToCreate.length} collections`);
        await db.collection.createMany({
          data: collectionsToCreate.map(({ node: { id, slug, image, hasPegs } }) => ({
            externalId: id?.trim(),
            slug: slug?.trim(),
            thumbnailUrl: image?.fullpath?.trim(),
            hasPegs: hasPegs || false
          }))
        });

        console.log(`Fetching recently created ${collectionsToCreate.length} collections`);
        const recentlyCreatedCollections = await db.collection.findMany({
          where: { slug: { in: collectionsToCreate.map((x) => x.node.slug?.trim() as string).filter((x) => !!x) } },
          select: {
            id: true,
            slug: true
          }
        });

        console.log(`Batch creating ${recentlyCreatedCollections.length} collection translations`);
        await db.collectionTranslations.createMany({
          data: recentlyCreatedCollections.map((dbCollection) => {
            // This returns undefined, but we're sure it returns correctly(at least it should)
            const collection = collectionsToCreate.find((x) => x.node.slug?.trim() === dbCollection.slug);

            return {
              locale: defaultSyncLocale,
              description: collection?.node.description?.trim() || '',
              subtitle: collection?.node.subtitle?.trim() || '',
              name: collection?.node.name?.trim() || '',
              collectionId: dbCollection.id
            };
          })
        });
      } else {
        console.log('No collection has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon collections');
    }

    console.log('Finished syncing collections');
  };

  const syncDrawerType = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing drawer types');

    console.log('Fetching drawer types');

    try {
      const data = await marathonGraphql<GetSpDrawerTypesListingQuery>(GET_SP_DRAWER_TYPES_LISTING);

      const drawerTypes = data?.data.getSpDrawerTypesListing.edges || [];

      if (drawerTypes && drawerTypes.length > 0) {
        console.log(`Fetched ${drawerTypes.length} drawer types`);

        const slugs = drawerTypes.map(({ node: drawerType }) => drawerType.slug?.trim() as string).filter((x) => !!x);

        const existingDrawerTypes = await db.type.findMany({
          select: {
            slug: true,
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
        const drawerTypesToUpdate = drawerTypes.filter(({ node: drawerType }) =>
          // Where exists in the database
          existingDrawerTypes.some((type) => type.slug === drawerType.slug?.trim())
        );

        // Received drawer types
        const drawerTypesToCreate = drawerTypes.filter(
          // Where it DOESN'T exist in the database
          ({ node: drawerType }) => !existingDrawerTypes.some((type) => type.slug === drawerType.slug?.trim())
        );

        // Limit amount of concurrent promises
        const limit = pLimit(concurrencyLimit);

        const toUpdate = drawerTypesToUpdate.map(({ node: { id, slug, name } }, index) =>
          limit(() => {
            return async () => {
              slug = slug?.trim();
              console.log(`Updating drawer type #${index + 1} ${slug} of ${drawerTypesToUpdate.length}`);

              const translationIds = existingDrawerTypes.find((x) => x.slug === slug)?.translations.map((x) => x.id);

              return await db.type.update({
                where: { slug },
                data: {
                  externalId: id?.trim(),
                  // thumbnailUrl: image?.fullpath?.trim(),
                  // hasPegs: hasPegs || false,
                  // isComingSoon,
                  translations:
                    translationIds && translationIds.length > 0
                      ? {
                          update: {
                            // Theoretically we should only have one id for locale+slug
                            where: { id: translationIds[0] },
                            data: {
                              name: name?.trim()
                              // description?.trim
                            }
                          }
                        }
                      : undefined
                }
              });
            };
          })
        );

        await Promise.all(toUpdate);

        console.log(`Batch creating ${drawerTypesToCreate.length} drawerTypes`);
        await db.type.createMany({
          data: drawerTypesToCreate.map(({ node: { id, slug } }) => ({
            externalId: id?.trim(),
            slug: slug?.trim()
            // thumbnailUrl: image?.fullpath?.trim(),
            // hasPegs: hasPegs || false
          }))
        });

        console.log(`Fetching recently created ${drawerTypesToCreate.length} drawer types`);
        const recentlyCreatedDrawerTypes = await db.collection.findMany({
          where: { slug: { in: drawerTypesToCreate.map((x) => x.node.slug?.trim() as string).filter((x) => !!x) } },
          select: {
            id: true,
            slug: true
          }
        });

        console.log(`Batch creating ${recentlyCreatedDrawerTypes.length} drawer types translations`);
        await db.typeTranslations.createMany({
          data: recentlyCreatedDrawerTypes.map((dbType) => {
            // This returns undefined, but we're sure it returns correctly(at least it should)
            const drawerType = drawerTypesToCreate.find((x) => x.node.slug?.trim() === dbType.slug);

            return {
              locale: defaultSyncLocale,
              // description: drawerType?.node.description?.trim() || '',
              name: drawerType?.node.name?.trim() || '',
              typeId: dbType.id
            };
          })
        });
      } else {
        console.log('No drawer type has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon drawer types');
    }

    console.log('Finished syncing drawer types');
  };

  const syncFinish = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing finishes');

    console.log('Fetching finishes');

    try {
      const data = await marathonGraphql<GetSpFinishListingQuery>(GET_SP_FINISH_LISTING);

      const finishes = data?.data.getSpFinishListing.edges || [];
      if (finishes && finishes.length > 0) {
        console.log(`Fetched ${finishes.length} finishes`);

        const slugs = finishes.map(({ node: finish }) => finish.slug.trim() as string).filter((x) => !!x);

        const existingFinishes = await db.finish.findMany({
          select: {
            slug: true,
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
        const finishesToUpdate = finishes.filter(({ node: finish }) =>
          // Where exists in the database
          existingFinishes.some((fin) => fin.slug === finish.slug?.trim())
        );

        // Received finishes
        const finishesToCreate = finishes.filter(
          // Where it DOESN'T exist in the database
          ({ node: finish }) => !existingFinishes.some((fin) => fin.slug === finish.slug?.trim())
        );

        // Limit amount of concurrent promises
        const limit = pLimit(concurrencyLimit);

        const toUpdate = finishesToUpdate.map(({ node: { id, slug, image, name, description } }, index) =>
          limit(() => {
            return async () => {
              slug = slug?.trim();
              console.log(`Updating finish #${index + 1} ${slug} of ${finishesToUpdate.length}`);

              const translationIds = existingFinishes.find((x) => x.slug === slug)?.translations.map((x) => x.id);

              return await db.finish.update({
                where: { slug },
                data: {
                  externalId: id?.trim(),
                  thumbnailUrl: image?.fullpath?.trim(),
                  // isComingSoon,
                  translations:
                    translationIds && translationIds.length > 0
                      ? {
                          update: {
                            // Theoretically we should only have one id for locale+slug
                            where: { id: translationIds[0] },
                            data: {
                              name: name?.trim(),
                              description: description?.trim()
                            }
                          }
                        }
                      : undefined
                }
              });
            };
          })
        );

        await Promise.all(toUpdate);

        console.log(`Batch creating ${finishesToCreate.length} finishes`);
        await db.finish.createMany({
          data: finishesToCreate.map(({ node: { id, slug, image } }) => ({
            externalId: id?.trim(),
            slug: slug?.trim(),
            thumbnailUrl: image?.fullpath?.trim()
          }))
        });

        console.log(`Fetching recently created ${finishesToCreate.length} finishes`);
        const recentlyCreatedFinishes = await db.finish.findMany({
          where: { slug: { in: finishesToCreate.map((x) => x.node.slug?.trim() as string).filter((x) => !!x) } },
          select: {
            id: true,
            slug: true
          }
        });

        console.log(`Batch creating ${recentlyCreatedFinishes.length} finish translations`);
        await db.finishTranslations.createMany({
          data: recentlyCreatedFinishes.map((dbFinish) => {
            // This returns undefined, but we're sure it returns correctly(at least it should)
            const finish = finishesToCreate.find((x) => x.node.slug?.trim() === dbFinish.slug);

            return {
              locale: defaultSyncLocale,
              description: finish?.node.description?.trim() || '',
              name: finish?.node.name?.trim() || '',
              finishId: dbFinish.id
            };
          })
        });
      } else {
        console.log('No finish has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon finishes');
    }

    console.log('Finished syncing finishes');
  };

  const mergeRules = (
    marathonModule: Product,
    currentRules?: NexusGenObjects['ModuleRules']
  ): NexusGenObjects['ModuleRules'] | undefined => {
    // TODO: Merge rules
    return currentRules;
  };

  const syncProduct = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }
    console.log('Syncing products(modules)');

    console.log('Fetching products');

    try {
      const data = await marathonGraphql<GetProductListingQuery>(GET_PRODUCT_LISTING);

      const products = data?.data.getProductListing.edges || [];

      if (products && products.length > 0) {
        console.log(`Fetched ${products.length} products`);

        // Casting because we're explicitly filtering by only valid values
        const partNumbers = products
          .map(({ node: product }) => product.partNumber?.trim() as string)
          .filter((x) => !!x);

        const noPartNumberModules = products.filter((x) => !x.node.partNumber);
        if (noPartNumberModules && noPartNumberModules.length > 0) {
          logging.warn(`Sync: ${noPartNumberModules.length} modules without part number. Which will get ignored`, {
            noPartNumberModules: noPartNumberModules.map((x) => x.node.id)
          });
        }

        const existingModules = await db.module.findMany({
          select: {
            id: true,
            partNumber: true,
            rules: true
          },
          where: {
            partNumber: {
              in: partNumbers
            }
          }
        });

        // Received products
        const modulesToUpdate = products.filter(({ node: product }) =>
          // Where exists in the database
          existingModules.some((mod) => mod.partNumber === product.partNumber?.trim())
        );

        // Received products
        const modulesToCreate = products.filter(
          // Where it DOESN'T exist in the database
          ({ node: product }) => !existingModules.some((mod) => mod.partNumber === product.partNumber?.trim())
        );

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

        const existingFinishes = await db.type.findMany({
          select: {
            id: true,
            slug: true
          }
        });

        const existingCollections = await db.type.findMany({
          select: {
            id: true,
            slug: true
          }
        });

        console.log(`Batch creating ${modulesToCreate.length} products`);
        await db.module.createMany({
          data: modulesToCreate
            .filter((x) => x.node.partNumber?.trim())
            .map(({ node: module }) => {
              const rules = mergeRules(module);
              return {
                partNumber: module.partNumber?.trim() as string,
                externalId: module.id?.trim(),
                description: module.titleDescription.trim() || undefined,
                thumbnailUrl:
                  module.productPictures && module.productPictures.length > 0
                    ? module.productPictures[0].fullpath?.trim()
                    : undefined,
                bundleUrl: module.bundlePath?.fullpath?.trim() || undefined,
                isSubmodule: module.isSubmodule || false,
                hasPegs: module.hasPegs || false,
                isMat: module.isMat || false,
                // isExtension: module.isExtension || false,
                shouldHideBasedOnWidth: module.shouldHideBasedOnWidth || false,
                // alwaysDisplay: module.alwaysDisplay || false,
                // isEdge: module.isEdge || false,
                rules,
                finishId: existingFinishes.find((finish) => finish.slug === module.spFinish?.slug?.trim())?.id || -1,
                collectionId:
                  existingCollections.find((collection) => collection.slug === module.spCollection?.slug?.trim())?.id ||
                  -1
                // TODO: Default left extension
                // TODO: Default right extension
                // TODO: attachmentToAppend: newRules?.rules.
              };
            })
        });

        console.log(`Fetching recently created ${modulesToCreate.length} products`);
        const recentlyCreatedModules = await db.module.findMany({
          where: {
            partNumber: { in: modulesToCreate.map((x) => x.node.partNumber?.trim() as string).filter((x) => !!x) }
          },
          select: {
            id: true,
            partNumber: true
          }
        });

        console.log(`Batch creating ${recentlyCreatedModules.length} product categories`);
        await db.moduleCategory.createMany({
          data: modulesToCreate
            .flatMap(({ node: product }) =>
              product.spCategories?.map((cat) => ({
                catSlug: cat.slug?.trim(),
                modulePartNumber: product.partNumber?.trim()
              }))
            )
            .filter((x) => !!x)
            .map((catModule) => ({
              moduleId: recentlyCreatedModules.find((x) => x.partNumber === catModule?.modulePartNumber)?.id || -1,
              categoryId: existingCategories.find((x) => x.slug === catModule?.catSlug)?.id || -1
            }))
        });

        console.log(`Batch creating ${recentlyCreatedModules.length} product types`);
        await db.moduleType.createMany({
          data: modulesToCreate
            .flatMap(({ node: product }) =>
              product.spDrawerTypes?.map((type) => ({
                typeSlug: type.slug?.trim(),
                modulePartNumber: product.partNumber?.trim()
              }))
            )
            .filter((x) => !!x)
            .map((typeModule) => ({
              moduleId: recentlyCreatedModules.find((x) => x.partNumber === typeModule?.modulePartNumber)?.id || -1,
              typeId: existingTypes.find((x) => x.slug === typeModule?.typeSlug)?.id || -1
            }))
        });

        // TODO: module attachments

        const limit = pLimit(concurrencyLimit);

        const toUpdate = modulesToUpdate.map(({ node: module }, index) =>
          limit(() => {
            return async () => {
              if (!module.partNumber) return;

              console.log(`Updating module #${index + 1} ${module.partNumber} of ${modulesToUpdate.length}`);
              module.partNumber = module.partNumber?.trim();

              const existingModule = existingModules.find((x) => x.partNumber === module.partNumber);
              const rules = existingModule?.rules as NexusGenObjects['ModuleRules'] | undefined;

              // Sync categories

              // Delete existing categories to create
              await db.moduleCategory.deleteMany({ where: { module: { partNumber: module.partNumber } } });

              // If there are categories for this module
              if (module.spCategories && module.spCategories.length > 0) {
                // Create them
                await db.moduleCategory.createMany({
                  data: module.spCategories.map((cat) => ({
                    moduleId: existingModule?.id || -1,
                    categoryId: existingCategories.find((x) => x.slug === cat.slug?.trim())?.id || -1
                  }))
                });
              }

              // Sync type

              // Delete existing types to then create
              await db.moduleType.deleteMany({ where: { module: { partNumber: module.partNumber } } });

              // If there are types for this module
              if (module.spDrawerTypes && module.spDrawerTypes.length > 0) {
                // Create them
                await db.moduleType.createMany({
                  data: module.spDrawerTypes.map((type) => ({
                    moduleId: existingModule?.id || -1,
                    typeId: existingTypes.find((x) => x.slug === type.slug?.trim())?.id || -1
                  }))
                });
              }

              // TODO: module attachments

              const newRules = mergeRules(module, rules);

              return await db.module.update({
                where: { partNumber: module.partNumber },
                data: {
                  externalId: module.id?.trim(),
                  description: module.titleDescription.trim() || undefined,
                  thumbnailUrl:
                    module.productPictures && module.productPictures.length > 0
                      ? module.productPictures[0].fullpath?.trim()
                      : undefined,
                  bundleUrl: module.bundlePath?.fullpath?.trim() || undefined,
                  isSubmodule: module.isSubmodule || false,
                  hasPegs: module.hasPegs || false,
                  isMat: module.isMat || false,
                  // isExtension: module.isExtension || false,
                  shouldHideBasedOnWidth: module.shouldHideBasedOnWidth || false,
                  // alwaysDisplay: module.alwaysDisplay || false,
                  // isEdge: module.isEdge || false,
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
                  // TODO: attachmentToAppend: newRules?.rules.
                }
              });
            };
          })
        );

        await Promise.all(toUpdate);
      } else {
        console.log('No product has been returned');
      }
    } catch (err) {
      logging.error(err, 'Error fetching Marathon products');
    }

    console.log('Finished syncing products');
  };

  const syncData = async () => {
    await syncCategory();
    await syncCollection();
    await syncDrawerType();
    await syncFinish();

    // Always leave products for last!!
    await syncProduct();
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

    const projectUnique = db.project.findUnique({
      where: { id: projectId }
    });

    const project = await projectUnique;

    if (!project) {
      throw makeError('Project does not exist', 'not-found', 404);
    }

    const name = project.title;
    const list = await projectUnique.lists();
    const number = list.filter((x) => x.name?.startsWith(name)).length;
    const cart = await projectService({ db }).getCart(projectId);

    const noExternalIdModules = cart.filter((x) => !x.projectModule.module.externalId);
    if (noExternalIdModules && noExternalIdModules.length > 0) {
      logging.warn(
        `Creating list for project ${project.title}(id: ${projectId}) but this project has ${noExternalIdModules.length} modules with no external id. Which won't be added to the list`,
        {
          noExternalIdModules
        }
      );
      return null;
    }

    const data: {
      // name of the list to be created
      list_name: string;
      items: {
        // the object id of the product
        oid: string;
        // the quantity of the product (optional)
        quantity?: number;
        // a description of the product (optional)
        tag?: string;
      }[];
    } = {
      list_name: number <= 0 ? name : `${name} ${number}`,
      items: cart
        .filter((x) => x.projectModule.module.externalId)
        .map((cartItem) => ({
          // casting because we removed null and undefined on previous filter
          oid: cartItem.projectModule.module.externalId as string,
          quantity: cartItem.quantity
          // tag: ''
        }))
    };

    const url = new URL(MARATHON_API_CREATE_LIST, MARATHON_API);
    const { data: result } = (await axios({
      url: url.toString(),
      method: 'post',
      data
    })) as AxiosResponse<{
      completed: boolean;
      // the object id of the list
      list_oid?: string;
      // the name of the list that has been created
      list_name?: string;
    }>;

    if (result.completed) {
      return await db.list.create({
        data: {
          externalId: result.list_oid,
          name: result.list_name,
          projectId
        }
      });
    } else {
      throw makeError("Couldn't save list", 'could-not-save-list');
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
    syncData,
    createList,
    login,
    marathonGraphql
  };
};
