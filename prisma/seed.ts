import { Locale, PrismaClient } from '@prisma/client';
import { helpers } from 'faker';
import { toNumber, uniqBy } from 'lodash';
import seedValues from './seedValues/seed.json';

const db = new PrismaClient();

const main = async () => {
  // -- Collections
  // await db.collection.createMany({
  //   data: seedValues.collections.map(({ slug, thumbnailUrl, hasPegs, isComingSoon }) => ({
  //     slug: slug.toLowerCase(),
  //     thumbnailUrl,
  //     isComingSoon: isComingSoon || false,
  //     hasPegs: hasPegs || false
  //   }))
  // });
  // const collections = await db.collection.findMany({ select: { id: true, slug: true } });
  // await db.collectionTranslations.createMany({
  //   data: seedValues.collections
  //     .flatMap((x) =>
  //       x.translations.map((y) => ({
  //         ...y,
  //         collectionSlug: x.slug.toLowerCase()
  //       }))
  //     )
  //     .map(({ locale, collectionSlug, ...collectionTranslation }) => ({
  //       locale: locale as Locale,
  //       collectionId: collections.find((x) => x.slug === collectionSlug)?.id || -1,
  //       ...collectionTranslation
  //     }))
  // });
  // -- Finishes
  // await db.finish.createMany({
  //   data: seedValues.finishes.map(({ name, thumbnailUrl }) => ({
  //     thumbnailUrl,
  //     slug: helpers.slugify(name).toLowerCase()
  //   }))
  // });
  // const finishes = await db.finish.findMany({ select: { id: true, slug: true } });
  // await db.finishTranslations.createMany({
  //   data: seedValues.finishes.map(({ name }) => ({
  //     locale: 'en' as Locale,
  //     name,
  //     finishId: finishes.find((x) => x.slug === helpers.slugify(name).toLowerCase())?.id || -1
  //   }))
  // });
  // // -- Collection finishes
  // await db.collectionFinishes.createMany({
  //   data: seedValues.collectionFinishes.map(({ collection, finish }) => ({
  //     finishId: finishes.find((x) => x.slug === helpers.slugify(finish).toLowerCase())?.id || -1,
  //     collectionId: collections.find((x) => x.slug === collection)?.id || -1
  //   }))
  // });
  // -- Types
  // await db.type.createMany({
  //   data: seedValues.types.map(({ slug, thumbnailUrl, hasPegs }) => ({
  //     slug: slug.toLowerCase(),
  //     thumbnailUrl,
  //     hasPegs: hasPegs || false
  //   }))
  // });
  // const types = await db.type.findMany({ select: { id: true, slug: true } });
  // await db.typeTranslations.createMany({
  //   data: seedValues.types
  //     .flatMap((x) =>
  //       x.translations.map((y) => ({
  //         ...y,
  //         typeSlug: x.slug.toLowerCase()
  //       }))
  //     )
  //     .map(({ locale, typeSlug, ...typeTranslation }) => ({
  //       locale: locale as Locale,
  //       typeId: types.find((x) => x.slug === typeSlug)?.id || -1,
  //       ...typeTranslation
  //     }))
  // });
  // -- Slides
  // await db.slideSupplier.createMany({
  //   data: uniqBy(seedValues.slides, 'supplier').map((x) => ({
  //     slug: helpers.slugify(x.supplier).toLowerCase(),
  //     thumbnailUrl: seedValues.supplierLogos.find((y) => y.supplier === helpers.slugify(x.supplier).toLowerCase())
  //       ?.supplierImgURL,
  //     name: x.supplier
  //   }))
  // });
  // const slideSuppliers = await db.slideSupplier.findMany({ select: { id: true, slug: true } });
  // const depths: ({ slug: string } & typeof seedValues['slides'][number]['depth'][number])[] = [];
  // await db.slide.createMany({
  //   data: seedValues.slides.map(({ formula, product, collection, supplier, depth }) => {
  //     const slug = helpers.slugify(`${supplier}-${product}-${collection}`).toLowerCase();
  //     depth.forEach((y) => depths.push({ slug, ...y }));
  //     return {
  //       slug,
  //       formula,
  //       product,
  //       collectionId: collections.find((x) => x.slug === helpers.slugify(collection).toLowerCase())?.id || -1,
  //       supplierId: slideSuppliers.find((x) => x.slug === helpers.slugify(supplier).toLowerCase())?.id || -1
  //     };
  //   })
  // });
  // const slides = await db.slide.findMany({ select: { id: true, slug: true } });
  // await db.slideDepth.createMany({
  //   data: depths.map(({ slug, roundedValue, value }) => ({
  //     display: `${roundedValue}mm`,
  //     depth: toNumber(value),
  //     slideId: slides.find((x) => x.slug === slug)?.id || -1
  //   }))
  // });
  // -- Categories
  // await db.category.createMany({
  //   data: seedValues.categories.map(({ slug, name }) => ({
  //     name,
  //     slug
  //   }))
  // });
  // const categories = await db.category.findMany({ select: { id: true, slug: true } });
  // -- Modules
  // await db.module.createMany({
  //   data: seedValues.modules
  //     .filter((x) => !!x.collection && !!x.finish)
  //     .map(
  //       ({
  //         partNumber,
  //         rules,
  //         finish,
  //         collection,
  //         isSubmodule,
  //         hasPegs,
  //         bundlePath,
  //         imageUrl,
  //         isMat,
  //         shouldHideBasedOnWidth,
  //         isExtension,
  //         isEdge
  //       }) => {
  //         return {
  //           thumbnailUrl: imageUrl,
  //           partNumber,
  //           bundleUrl: bundlePath,
  //           isSubmodule,
  //           hasPegs,
  //           isMat,
  //           isExtension,
  //           shouldHideBasedOnWidth,
  //           isEdge,
  //           rules: rules ? JSON.parse(rules) : undefined,
  //           collectionId: collections.find((x) => x.slug === helpers.slugify(collection).toLowerCase())?.id || -1,
  //           finishId: finishes.find((x) => x.slug === helpers.slugify(finish).toLowerCase())?.id || -1
  //         };
  //       }
  //     )
  // });
  // const modules = await db.module.findMany({ select: { id: true, partNumber: true } });
  // await db.moduleType.createMany({
  //   data: seedValues.moduleTypes.map(({ partNumber, type }) => ({
  //     typeId: types.find((f) => f.slug === type)?.id || -1,
  //     moduleId: modules.find((f) => f.partNumber === partNumber)?.id || -1
  //   }))
  // });
  // const moduleWithExtensions = seedValues.modules.filter((x) => x.defaultLeftExtension || x.defaultRightExtension);
  // for (const module of moduleWithExtensions) {
  //   const extensionLeft = modules.find((x) => x.partNumber === module.defaultLeftExtension);
  //   const extensionRight = modules.find((x) => x.partNumber === module.defaultRightExtension);
  //   await db.module.update({
  //     where: {
  //       partNumber: module.partNumber
  //     },
  //     data: {
  //       defaultLeftExtensionId: extensionLeft?.id || undefined,
  //       defaultRightExtensionId: extensionRight?.id || undefined
  //     }
  //   });
  // }
  // const moduleWithAttachments = seedValues.modules.filter((x) => x.moduleAttachments || x.attachmentToAppend);
  // for (const module of moduleWithAttachments) {
  //   const attachments = modules.filter((x) => moduleWithAttachments.some((y) => x.partNumber === y.partNumber));
  //   const appendAttachment = modules.find((x) => x.partNumber === module.attachmentToAppend);
  //   await db.module.update({
  //     where: {
  //       partNumber: module.partNumber
  //     },
  //     data: {
  //       attachmentToAppendId: appendAttachment?.id || undefined,
  //       moduleAttachments: {
  //         createMany: {
  //           data: attachments.map((x) => ({ attachmentId: x.id }))
  //         }
  //       }
  //     }
  //   });
  // }
  // // Automatically puts modules in "all" category
  // const toCreate: { categoryId: number; moduleId: number }[] = [];
  // seedValues.modules.forEach((module) => {
  //   module.categorySlug?.forEach((category) => {
  //     toCreate.push({
  //       categoryId: categories.find((f) => f.slug === category)?.id || -1,
  //       moduleId: modules.find((f) => f.partNumber === module.partNumber)?.id || -1
  //     });
  //   });
  // });
  // await db.moduleCategory.createMany({
  //   data: toCreate
  // });
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
