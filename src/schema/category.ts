import { list, nonNull, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['moduleCategories']);

    t.field('modules', {
      type: nonNull(list(nonNull('Module'))),
      args: {
        where: 'ModuleWhereInput'
      },
      resolve: async (root, args, ctx) => {
        const moduleCategories = await ctx.prisma.category.findUnique({ where: { id: root.id } }).moduleCategories({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            module: (args.where as any) || undefined
          },
          select: {
            module: true
          }
        });

        return moduleCategories.map((moduleCategory) => moduleCategory.module) || [];
      }
    });
  }
});
