import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Module = objectType({
  name: 'Module',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
