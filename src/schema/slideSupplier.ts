import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const SlideSupplier = objectType({
  name: 'SlideSupplier',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
