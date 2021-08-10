import { mutationType } from 'nexus';

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneProject();
    t.crud.updateOneProject();
  }
});
