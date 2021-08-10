import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Finish = objectType({
  name: 'Finish',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
