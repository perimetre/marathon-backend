import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const List = objectType({
  name: 'List',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
