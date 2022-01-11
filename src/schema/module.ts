import { list, nonNull, objectType } from 'nexus';
import {
  registerModelsWithPrismaBinding,
  resolveAssetBundleUrlToField,
  resolvePublicMediaUrlToField
} from '../utils/nexus';
import { NexusGenObjects } from '../generated/nexus';

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
      alias: 'rulesJson'
    });

    t.field('rules', {
      type: 'ModuleRules',
      resolve: async (root, _args, ctx) => {
        const module = await ctx.prisma.module.findUnique({ where: { id: root.id } });
        return (module?.rules as unknown as NexusGenObjects['ModuleRules']) || null;
      }
    });
  }
});
