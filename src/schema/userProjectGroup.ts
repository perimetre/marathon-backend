import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const UserProjectGroup = objectType({
  name: 'UserProjectGroup',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
