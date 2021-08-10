import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Slide = objectType({
  name: 'Slide',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
