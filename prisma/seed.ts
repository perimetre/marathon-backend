import { Locale, PrismaClient } from '@prisma/client';
import { helpers } from 'faker';
import { uniqBy } from 'lodash';
import seedValues from './seedValues/seed.json';

const db = new PrismaClient();

const main = async () => {
  // -- Collections
  await db.collection.createMany({
    data: seedValues.collections.map(({ slug, thumbnailUrl }) => ({
      slug: slug.toLowerCase(),
      thumbnailUrl
    }))
  });

  const collections = await db.collection.findMany({ select: { id: true, slug: true } });

  await db.collectionTranslations.createMany({
    data: seedValues.collections
      .flatMap((x) =>
        x.translations.map((y) => ({
          ...y,
          collectionSlug: x.slug.toLowerCase()
        }))
      )
      .map(({ locale, collectionSlug, ...collectionTranslation }) => ({
        locale: locale as Locale,
        collectionId: collections.find((x) => x.slug === collectionSlug)?.id || -1,
        ...collectionTranslation
      }))
  });

  // -- Finishes
  await db.finish.createMany({
    data: seedValues.finishes.map(({ name, thumbnailUrl }) => ({
      thumbnailUrl,
      slug: helpers.slugify(name).toLowerCase()
    }))
  });

  const finishes = await db.finish.findMany({ select: { id: true, slug: true } });

  await db.finishTranslations.createMany({
    data: seedValues.finishes.map(({ name }) => ({
      locale: 'en' as Locale,
      name,
      finishId: finishes.find((x) => x.slug === helpers.slugify(name).toLowerCase())?.id || -1
    }))
  });

  // -- Collection finishes
  await db.collectionFinishes.createMany({
    data: seedValues.collectionFinishes.map(({ collection, finish }) => ({
      finishId: finishes.find((x) => x.slug === helpers.slugify(finish).toLowerCase())?.id || -1,
      collectionId: collections.find((x) => x.slug === collection)?.id || -1
    }))
  });

  // -- Types
  await db.type.createMany({
    data: seedValues.types.map(({ slug, thumbnailUrl }) => ({
      slug: slug.toLowerCase(),
      thumbnailUrl
    }))
  });

  const types = await db.type.findMany({ select: { id: true, slug: true } });

  await db.typeTranslations.createMany({
    data: seedValues.types
      .flatMap((x) =>
        x.translations.map((y) => ({
          ...y,
          typeSlug: x.slug.toLowerCase()
        }))
      )
      .map(({ locale, typeSlug, ...typeTranslation }) => ({
        locale: locale as Locale,
        typeId: types.find((x) => x.slug === typeSlug)?.id || -1,
        ...typeTranslation
      }))
  });

  // -- Slides

  await db.slideSupplier.createMany({
    data: uniqBy(seedValues.slides, 'supplier').map((x) => ({
      slug: helpers.slugify(x.supplier).toLowerCase(),
      thumbnailUrl: x.supplierImgURL,
      name: x.supplier
    }))
  });

  const slideSuppliers = await db.slideSupplier.findMany({ select: { id: true, slug: true } });

  await db.slide.createMany({
    data: seedValues.slides.map(({ slug, formula, product, collection, supplier }) => ({
      slug: slug.toLowerCase(),
      formula,
      product,
      collectionId: collections.find((x) => x.slug === helpers.slugify(collection).toLowerCase())?.id || -1,
      supplierId: slideSuppliers.find((x) => x.slug === helpers.slugify(supplier).toLowerCase())?.id || -1
    }))
  });

  const slides = await db.slide.findMany({ select: { id: true, slug: true } });

  await db.slideDepth.createMany({
    data: seedValues.slides.flatMap((slide) =>
      ['450', '500', '550', '600']
        .filter((x) => seedValues.slides[x] && seedValues.slides[x] !== 0)
        .map((depthValue) => ({
          display: `${parseInt(depthValue) / 10}cm`,
          depth: slide[depthValue],
          slideId: slides.find((y) => y.slug === slide.slug.toLowerCase())?.id || -1
        }))
    )
  });

  // -- Modules

  await db.module.createMany({
    data: seedValues.modules.map(
      ({ partNumber, metadata: rules, finish, collection, isSubmodule, hasPegs, thumbnailUrl }) => ({
        thumbnailUrl,
        partNumber,
        isSubmodule,
        hasPegs,
        rules,
        collectionId: collections.find((x) => x.slug === helpers.slugify(collection).toLowerCase())?.id || -1,
        finishId: finishes.find((x) => x.slug === helpers.slugify(finish).toLowerCase())?.id || -1
      })
    )
  });
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
