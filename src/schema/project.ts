import { FieldResolver, list, nonNull, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';
import { projectService } from '../services/project';
import { moduleService } from '../services/modules';
import { Context } from '../typings/context';
import { GraphQLResolveInfo } from 'graphql';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    registerModelsWithPrismaBinding(t, ['projectModules'], ['calculatedWidth']);

    t.model.calculatedWidth({
      resolve: async (root, args, ctx, info, originalResolve) => {
        const calculatedWidth = await originalResolve(root, args, ctx, info);

        return (await projectService({ db: ctx.prisma }).calculateCabinetWidth(root.id, root, calculatedWidth)) || null;
      }
    });

    t.field('modules', {
      type: nonNull(list(nonNull('Module'))),
      resolve: async (root, _args, ctx) => {
        const modules = await ctx.prisma.module.findMany({
          where: {
            collectionId: root.collectionId,
            finishId: root.finishId,
            hasPegs: root.hasPegs,
            isSubmodule: false,
            isImprintExtension: false
          }
        });

        const project = await ctx.prisma.project.findUnique({ where: { id: root.id } });

        const calculatedWidth = await projectService({ db: ctx.prisma }).calculateCabinetWidth(
          root.id,
          root,
          project?.calculatedWidth
        );

        if (calculatedWidth) {
          const filteredModules = await moduleService({ db: ctx.prisma }).filterModuleBasedOnWidth(
            modules,
            calculatedWidth
          );
          return filteredModules;
        } else {
          return modules;
        }
      }
    });
  }
});

export const createOneProjectCustomResolver = async (
  root: Record<string, unknown>,
  args: any,
  ctx: Context,
  info: GraphQLResolveInfo,
  originalResolver: FieldResolver<'Mutation', 'createOneProject'>
) => {
  const res = await originalResolver(root, args, ctx, info);
  const project = await ctx.prisma.project.findUnique({ where: { id: Number(res.id) } });
  if (project?.hasPegs) {
    const modules = await ctx.prisma.module.findMany({
      where: {
        partNumber: { contains: 'PEGBOARD' },
        collectionId: Number(project.collectionId),
        finishId: Number(project.finishId)
      }
    });
    const calculatedWidth = await projectService({ db: ctx.prisma }).calculateCabinetWidth(
      Number(project?.id),
      { cabinetWidth: project?.cabinetWidth, gable: project?.gable },
      project?.calculatedWidth
    );
    if (calculatedWidth) {
      const filteredModules = await moduleService({ db: ctx.prisma }).filterModuleBasedOnWidth(
        modules,
        calculatedWidth
      );
      await ctx.prisma.projectModule.createMany({
        data: filteredModules.map((mod) => ({ projectId: Number(project?.id), moduleId: mod.id }))
      });
    }
  }

  return res;
};
