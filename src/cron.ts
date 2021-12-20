import * as cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import logging from './utils/logging';
import { marathonGraphql } from './utils/marathon';
import {
  GetProductListingQuery,
  GetSpCategoryListingQuery,
  GetSpCollectionListingQuery,
  GetSpDrawerTypesListingQuery,
  GetSpFinishListingQuery,
  GET_PRODUCT_LISTING,
  GET_SP_CATEGORY_LISTING,
  GET_SP_COLLECTION_LISTING,
  GET_SP_DRAWER_TYPES_LISTING,
  GET_SP_FINISH_LISTING
} from './utils/marathon/queries';
import { SpCategories, SpCollection, SpDrawerTypes, SpFinish } from './typings/Product';

const marathonCategories = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetSpCategoryListingQuery>(GET_SP_CATEGORY_LISTING);
  if (data && data.data && data.data.getSpCategoryListing) {
    const categories = data.data.getSpCategoryListing.edges || [];

    const dbCategories = await prisma.category.findMany({ select: { slug: true } });

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
      await prisma.category.update({
        where: { slug: category.slug },
        data: { name: category.name }
      });
    }

    await prisma.category.createMany({
      data: createCategory.map(({ name, slug }) => ({
        name,
        slug
      }))
    });
  }
};

const marathonCollections = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetSpCollectionListingQuery>(GET_SP_COLLECTION_LISTING);
  if (data && data.data && data.data.getSpCollectionListing) {
    const collections = data.data.getSpCollectionListing.edges || [];

    const dbCollections = await prisma.collection.findMany({ select: { slug: true } });

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
      await prisma.collection.update({
        where: { slug: collection.slug },
        data: {
          // name: collection.name,
          // description: collection.description,
          // thumbnailUrl: collection.image.fullpath,
          hasPegs: collection.hasPegs || false
        }
      });
    }

    await prisma.collection.createMany({
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

const marathonDrawerTypes = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetSpDrawerTypesListingQuery>(GET_SP_DRAWER_TYPES_LISTING);
  if (data && data.data && data.data.getSpDrawerTypesListing) {
    const drawerTypes = data.data.getSpDrawerTypesListing.edges || [];

    const dbDrawerTypes = await prisma.type.findMany({ select: { slug: true } });

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
      await prisma.type.update({
        where: { slug: drawerType.slug },
        data: {
          // name: collection.name,
          // description: collection.description,
          // thumbnailUrl: collection.image.fullpath,
        }
      });
    }

    await prisma.type.createMany({
      data: createDrawerTypes.map(({ name, slug }) => ({
        slug,
        // name,
        hasPegs: false
      }))
    });
  }
};

const marathonFinish = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetSpFinishListingQuery>(GET_SP_FINISH_LISTING);
  if (data && data.data && data.data.getSpFinishListing) {
    const finishes = data.data.getSpFinishListing.edges || [];

    const dbFinishes = await prisma.finish.findMany({ select: { slug: true } });

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
      await prisma.finish.update({
        where: { slug: finish.slug },
        data: {
          // name: finish.name,
          // thumbnailUrl: finish.image.fullpath,
        }
      });
    }

    await prisma.finish.createMany({
      data: createFinishes.map(({ name, slug, image }) => ({
        slug,
        name,
        thumbnailUrl: image?.fullpath
      }))
    });
  }
};

const marathonProduct = async (prisma: PrismaClient) => {
  const data = await marathonGraphql<GetProductListingQuery>(GET_PRODUCT_LISTING);
  if (data && data.data && data.data.getProductListing) {
  }
};

const marathonCron = async (prisma: PrismaClient) => {
  // await marathonCategories(prisma);
  // await marathonCollections(prisma);
  // await marathonDrawerTypes(prisma);
  // Not sure if its a good ideia to run finish now because they dont return slug;
  // await marathonFinish(prisma);
};

const scheduleJobs = async (prisma: PrismaClient): Promise<void> => {
  const daiy = '0 4 * * *';

  await marathonCron(prisma);
  // cron.schedule(daily, async () => {
  //   console.log(`Daily job (${daily}) `);
  //   try {
  //     await marathonProductCron(prisma);
  //   } catch (error) {
  //     logging.error(error, 'Daily cronjob has failed.');
  //   }
  // });

  console.log('All jobs scheduled');
};

export default scheduleJobs;
