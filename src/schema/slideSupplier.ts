import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding, resolvePublicMediaUrlToField } from '../utils/nexus';

export const SlideSupplier = objectType({
  name: 'SlideSupplier',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['slides'], ['thumbnailUrl']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });
  }
});
