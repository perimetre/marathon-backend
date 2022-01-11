import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const FinishTranslations = objectType({
  name: 'FinishTranslations',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
