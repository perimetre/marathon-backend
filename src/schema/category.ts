import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['moduleCategories']);
  }
});
