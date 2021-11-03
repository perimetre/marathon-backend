import { mutationType } from 'nexus';

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneProject();
    t.crud.updateOneProject();
    t.crud.deleteOneProject();

    t.crud.createOneProjectModule();
    t.crud.updateOneProjectModule();
    t.crud.deleteOneProjectModule();
  }
});
