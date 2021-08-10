import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const ProjectGroup = objectType({
  name: 'ProjectGroup',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
