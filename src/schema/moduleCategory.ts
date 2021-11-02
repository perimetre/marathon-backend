import { inputObjectType, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

// Workaround for issue https://github.com/graphql-nexus/nexus-plugin-prisma/issues/801
export const ModuleCategoryUpdateManyMutationInput = inputObjectType({
  name: 'ModuleCategoryUpdateManyMutationInput',
  definition: (t) => {
    t.int('_');
  }
});

export const ModuleCategory = objectType({
  name: 'ModuleCategory',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
