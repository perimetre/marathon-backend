import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding, resolvePublicMediaUrlToField } from '../utils/nexus';

export const Module = objectType({
  name: 'Module',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['thumbnailUrl']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
  }
});
