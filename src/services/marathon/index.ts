import axios, { AxiosResponse } from 'axios';
import { env } from '../../env';
import logging from '../../utils/logging';
import { PrismaClient } from '@prisma/client';
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
import { SpCategories, SpCollection, SpDrawerTypes, SpFinish } from '../../typings/Product';
import { URL } from 'url';
import { ForbiddenError } from 'apollo-server';
import { projectService } from '../project';
import { FrontError, makeError } from '../../utils/exception';

type MarathonServiceDependencies = {
  db?: PrismaClient;
};

export const marathonService = ({ db }: MarathonServiceDependencies) => {
  const { MARATHON_API, MARATHON_API_GRAPHQL, MARATHON_API_GRAPHQL_KEY, MARATHON_API_CREATE_LIST } = env;

  const marathonGraphql = async <T>(query: string) => {
    if (!MARATHON_API || !MARATHON_API_GRAPHQL || !MARATHON_API_GRAPHQL_KEY) {
      throw new Error('Missing marathon environment');
    }

    try {
      const url = new URL(MARATHON_API_GRAPHQL, MARATHON_API);
      url.searchParams.append('apiKey', MARATHON_API_GRAPHQL_KEY);

      const { data } = (await axios({
        url: url.toString(),
        method: 'post',
        data: { query: query }
      })) as AxiosResponse<T>;
      return data;
    } catch (err) {
      logging.error(err, 'Error fetching Marathon Graphql api');
      return null;
    }
  };

  const syncCollection = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const data = await marathonGraphql<GetSpCollectionListingQuery>(GET_SP_COLLECTION_LISTING);

    if (data && data.data && data.data.getSpCollectionListing) {
      const collections = data.data.getSpCollectionListing.edges || [];

      const dbCollections = await db.collection.findMany({ select: { slug: true } });

      const updateCollection: SpCollection[] = [];
      const createCollection: SpCollection[] = [];

      collections.forEach(({ node: collection }) => {
        const exists = dbCollections.find((col) => col.slug === collection.slug);
        if (exists) {
          updateCollection.push(collection);
        } else {
          createCollection.push(collection);
        }
      });

      for (const collection of updateCollection) {
        await db.collection.update({
          where: { slug: collection.slug },
          data: {
            // name: collection.name,
            // description: collection.description,
            // thumbnailUrl: collection.image.fullpath,
            hasPegs: collection.hasPegs || false
          }
        });
      }

      await db.collection.createMany({
        data: createCollection.map(({ name, description, slug, hasPegs, image }) => ({
          slug,
          // name,
          // description
          hasPegs: hasPegs || false,
          thumbnailUrl: image?.fullpath
        }))
      });
    }
  };

  const syncCategory = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const data = await marathonGraphql<GetSpCategoryListingQuery>(GET_SP_CATEGORY_LISTING);
    if (data && data.data && data.data.getSpCategoryListing) {
      const categories = data.data.getSpCategoryListing.edges || [];

      const dbCategories = await db.category.findMany({ select: { slug: true } });

      const updateCategory: SpCategories[] = [];
      const createCategory: SpCategories[] = [];

      categories.forEach(({ node: category }) => {
        const exists = dbCategories.find((cat) => cat.slug === category.slug);
        if (exists) {
          updateCategory.push(category);
        } else {
          createCategory.push(category);
        }
      });

      for (const category of updateCategory) {
        await db.category.update({
          where: { slug: category.slug },
          data: { name: category.name }
        });
      }

      await db.category.createMany({
        data: createCategory.map(({ name, slug }) => ({
          name,
          slug
        }))
      });
    }
  };

  const syncDrawerType = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const data = await marathonGraphql<GetSpDrawerTypesListingQuery>(GET_SP_DRAWER_TYPES_LISTING);
    if (data && data.data && data.data.getSpDrawerTypesListing) {
      const drawerTypes = data.data.getSpDrawerTypesListing.edges || [];

      const dbDrawerTypes = await db.type.findMany({ select: { slug: true } });

      const updateDrawerTypes: SpDrawerTypes[] = [];
      const createDrawerTypes: SpDrawerTypes[] = [];

      drawerTypes.forEach(({ node: drawerType }) => {
        const exists = dbDrawerTypes.find((dt) => dt.slug === drawerType.slug);
        if (exists) {
          updateDrawerTypes.push(drawerType);
        } else {
          createDrawerTypes.push(drawerType);
        }
      });

      for (const drawerType of updateDrawerTypes) {
        await db.type.update({
          where: { slug: drawerType.slug },
          data: {
            // name: collection.name,
            // description: collection.description,
            // thumbnailUrl: collection.image.fullpath,
          }
        });
      }

      await db.type.createMany({
        data: createDrawerTypes.map(({ name, slug }) => ({
          slug,
          // name,
          hasPegs: false
        }))
      });
    }
  };

  const syncFinish = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const data = await marathonGraphql<GetSpFinishListingQuery>(GET_SP_FINISH_LISTING);
    if (data && data.data && data.data.getSpFinishListing) {
      const finishes = data.data.getSpFinishListing.edges || [];

      const dbFinishes = await db.finish.findMany({ select: { slug: true } });

      const updateFinishes: SpFinish[] = [];
      const createFinishes: SpFinish[] = [];

      finishes.forEach(({ node: finish }) => {
        const exists = dbFinishes.find((dt) => dt.slug === finish.slug);
        if (exists) {
          updateFinishes.push(finish);
        } else {
          createFinishes.push(finish);
        }
      });

      for (const finish of updateFinishes) {
        await db.finish.update({
          where: { slug: finish.slug },
          data: {
            // name: finish.name,
            // thumbnailUrl: finish.image.fullpath,
          }
        });
      }

      await db.finish.createMany({
        data: createFinishes.map(({ name, slug, image }) => ({
          slug,
          name,
          thumbnailUrl: image?.fullpath
        }))
      });
    }
  };

  const syncProduct = async () => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    const data = await marathonGraphql<GetProductListingQuery>(GET_PRODUCT_LISTING);
    if (data && data.data && data.data.getProductListing) {
      const dbProducts = await db.module.findMany({ select: { partNumber: true, updatedAt: true } });

      const products = data.data.getProductListing.edges || [];

      for (const product of products) {
        const exists = dbProducts.find((f) => f.partNumber === product.node.partNumber);

        if (exists && new Date(product.node.modificationDate * 1000).getTime() > exists?.updatedAt.getTime()) {
          await db.module.update({
            where: { partNumber: product.node.partNumber },
            data: {
              isMat: product.node.isMat,
              isSubmodule: product.node.isSubmodule,
              hasPegs: product.node.hasPegs,
              shouldHideBasedOnWidth: product.node.shouldHideBasedOnWidth,
              isExtension: false,

              ...(product.node.spCollection
                ? {
                    collection: {
                      connect: {
                        slug: product.node.spCollection.slug
                      }
                    }
                  }
                : {}),
              ...(product.node.spFinish
                ? {
                    finish: {
                      connect: {
                        slug: product.node.spFinish.slug
                      }
                    }
                  }
                : {})
            }
          });
        }
        if (!exists) {
          await db.module.create({
            data: {
              partNumber: product.node.partNumber,
              isMat: product.node.isMat,
              isSubmodule: product.node.isSubmodule,
              hasPegs: product.node.hasPegs,
              shouldHideBasedOnWidth: product.node.shouldHideBasedOnWidth,
              isExtension: false,
              collection: {
                connect: {
                  slug: product.node.spCollection.slug
                }
              },
              finish: {
                connect: {
                  slug: product.node.spFinish.slug
                }
              }
            }
          });
        }
      }
    }
  };

  const syncData = async () => {
    // await syncCategory();
    // await syncCollection();
    // await syncDrawerType();
    // Not sure if it's a good idea to run finish now because they don't return slug
    // await syncFinish();
    // await syncProduct();
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

  return {
    syncData,
    createList
  };
};
