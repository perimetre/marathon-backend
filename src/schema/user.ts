import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
