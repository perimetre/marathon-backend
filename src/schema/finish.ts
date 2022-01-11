import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  registerNonNullTranslatedFields,
  registerTranslatedFields,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Finish = objectType({
  name: 'Finish',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['projects', 'modules', 'collectionFinishes'], ['thumbnailUrl', 'translations']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
    registerNonNullTranslatedFields(t, ['name'], (ctx) => ctx.prisma.finish);
    registerTranslatedFields(t, ['description'], (ctx) => ctx.prisma.finish);
  }
});
