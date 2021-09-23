import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  registerNonNullTranslatedFields,
  registerTranslatedFields,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Type = objectType({
  name: 'Type',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['thumbnailUrl', 'translations']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
    registerNonNullTranslatedFields(t, ['name'], (ctx) => ctx.prisma.type);
    registerTranslatedFields(t, ['description'], (ctx) => ctx.prisma.type);
  }
});
