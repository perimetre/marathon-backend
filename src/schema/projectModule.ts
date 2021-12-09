import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const ProjectModule = objectType({
  name: 'ProjectModule',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['children']);
  }
});
