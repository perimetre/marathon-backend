import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  registerNonNullTranslatedFields,
  registerTranslatedFields,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Collection = objectType({
  name: 'Collection',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['thumbnailUrl', 'translations']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
    registerNonNullTranslatedFields(t, ['name'], (ctx) => ctx.prisma.collection);
    registerTranslatedFields(t, ['subtitle', 'description', 'footer'], (ctx) => ctx.prisma.collection);
  }
});
