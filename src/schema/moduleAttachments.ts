import { inputObjectType, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

// Workaround for issue https://github.com/graphql-nexus/nexus-plugin-prisma/issues/801
export const ModuleAttachmentsUpdateManyMutationInput = inputObjectType({
  name: 'ModuleAttachmentsUpdateManyMutationInput',
  definition: (t) => {
    t.int('_');
  }
});

export const ModuleAttachments = objectType({
  name: 'ModuleAttachments',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
