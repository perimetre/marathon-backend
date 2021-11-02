import { objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  resolveAssetBundleUrlToField,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Module = objectType({
  name: 'Module',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['projectModules', 'categories'], ['thumbnailUrl, bundleUrl']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });

    t.model.bundleUrl({
      resolve: resolveAssetBundleUrlToField
    });
  }
});
