import { mutationType } from 'nexus';
import { createOneProjectCustomResolver, createOneProjectModuleCustomResolver } from './project';

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneProject({
      resolve: (root, args, ctx, info, originalResolver) =>
        createOneProjectCustomResolver(root, args, ctx, info, originalResolver)
    });
    t.crud.updateOneProject();
    t.crud.deleteOneProject();

    t.crud.createOneProjectModule({
      resolve: (root, args, ctx, info, originalResolver) =>
        createOneProjectModuleCustomResolver(root, args, ctx, info, originalResolver)
    });
    t.crud.updateOneProjectModule();
    t.crud.deleteOneProjectModule();

    t.crud.updateManyProjectModule();
    t.crud.deleteManyProjectModule();
  }
});
