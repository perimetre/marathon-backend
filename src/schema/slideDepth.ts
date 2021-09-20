import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const SlideDepth = objectType({
  name: 'SlideDepth',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
