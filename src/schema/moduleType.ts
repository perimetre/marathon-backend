import { inputObjectType, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const ModuleType = objectType({
  name: 'ModuleType',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});

export const ModuleTypeUpdateManyMutationInput = inputObjectType({
  name: 'ModuleTypeUpdateManyMutationInput',
  definition: (t) => {
    t.int('_');
  }
});
