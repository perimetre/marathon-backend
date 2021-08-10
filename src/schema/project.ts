import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
