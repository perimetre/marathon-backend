import { inputObjectType, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

// Workaround for issue https://github.com/graphql-nexus/nexus-plugin-prisma/issues/801
export const CollectionFinishesUpdateManyMutationInput = inputObjectType({
  name: 'CollectionFinishesUpdateManyMutationInput',
  definition: (t) => {
    t.int('_');
  }
});

export const CollectionFinishes = objectType({
  name: 'CollectionFinishes',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
