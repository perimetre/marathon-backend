import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const CollectionTranslations = objectType({
  name: 'CollectionTranslations',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
