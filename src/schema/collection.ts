import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
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
    registerTranslatedFields(t, ['name', 'subtitle', 'description', 'footer'], (ctx) => ctx.prisma.collection);
  }
});
