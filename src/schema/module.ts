import { list, nonNull, objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  resolveAssetBundleUrlToField,
  resolvePublicMediaUrlToField
} from '../utils/nexus';

export const Module = objectType({
  name: 'Module',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['projectModules'], ['thumbnailUrl', 'bundleUrl', 'moduleCategories', 'rules']);
    t.model.thumbnailUrl({
      resolve: resolvePublicMediaUrlToField
    });

    t.model.bundleUrl({
      resolve: resolveAssetBundleUrlToField
    });

    t.field('categories', {
      type: nonNull(list(nonNull('Category'))),
      args: {
        where: 'CategoryWhereInput'
      },
      resolve: async (root, args, ctx) => {
        const moduleCategories = await ctx.prisma.module
          .findUnique({ where: { id: root.id } })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .moduleCategories({ where: { category: (args.where as any) || undefined }, select: { category: true } });

        return (moduleCategories || []).map((moduleCategory) => moduleCategory.category) || [];
      }
    });

    t.model.rules({
      resolve: (root: any) => {
        return JSON.parse(root.rules);
      }
    });
  }
});
