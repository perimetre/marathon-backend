import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Type = objectType({
  name: 'Type',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
