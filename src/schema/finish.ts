import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  registerTranslatedFields,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Finish = objectType({
  name: 'Finish',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['thumbnailUrl', 'translations']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
    registerTranslatedFields(t, ['name', 'description'], (ctx) => ctx.prisma.finish);
  }
});
