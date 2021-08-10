import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Collection = objectType({
  name: 'Collection',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
