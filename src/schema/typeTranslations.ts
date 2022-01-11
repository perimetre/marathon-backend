import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const TypeTranslations = objectType({
  name: 'TypeTranslations',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
