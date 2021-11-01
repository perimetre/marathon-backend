import { nonNull, objectType, list } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    registerModelsWithPrismaBinding(t);
    t.field('modules', {
      type: nonNull(list(nonNull('Module'))),
      resolve: (root, _args, ctx) =>
        // TODO: Filter modules so only modules that fit are returned
        ctx.prisma.module.findMany({
          where: {
            collectionId: root.collectionId,
            finishId: root.finishId
          }
        })
    });
  }
});
