import { FieldResolver, list, nonNull, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';
import { projectService } from '../services/project';
import { moduleService } from '../services/modules';
import { Context } from '../typings/context';
import { GraphQLResolveInfo } from 'graphql';
import { nanoid } from 'nanoid';

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
            OR: [
              {
                hasPegs: root.hasPegs
              },
              {
                alwaysDisplay: true
              }
            ],
            isSubmodule: false,
            isExtension: false,
            isMat: false,
            moduleType: {
              every: {
                typeId: { equals: root.typeId }
              }
            }
          }
        });

        const mattModules = await ctx.prisma.module.findMany({
          where: { isMat: true, collectionId: root.collectionId }
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
          return [...filteredModules, ...mattModules];
        } else {
          return [...modules, ...mattModules];
        }
      }
    });

    t.field('cartAmount', {
      type: nonNull('Int'),
      resolve: async (root, _args, ctx) => {
        return (
          await ctx.prisma.project
            .findUnique({
              where: { id: root.id }
            })
            .projectModules({
              where: { parentId: { equals: null } },
              include: { children: { where: { module: { partNumber: { not: { contains: 'EXTENSION' } } } } } }
            })
        ).reduce((prev, curr) => {
          prev = prev || 0;
          prev++;
          prev += curr?.children?.length || 0;
          return prev;
        }, 0);
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
        data: filteredModules.map((mod) => ({
          projectId: Number(project?.id),
          moduleId: mod.id,
          nanoId: nanoid()
        }))
      });
    }
  }

  return res;
};

export const createOneProjectModuleCustomResolver = async (
  root: Record<string, unknown>,
  args: any,
  ctx: Context,
  info: GraphQLResolveInfo,
  originalResolver: FieldResolver<'Mutation', 'createOneProjectModule'>
) => {
  const res = await originalResolver(root, args, ctx, info);

  const haveMat = await ctx.prisma.project.findFirst({ where: { id: Number(res.projectId) } }).projectModules({
    where: {
      module: { isMat: true },
      moduleId: { not: { equals: Number(res.moduleId) } }
    }
  });

  if (haveMat && haveMat.length > 0) {
    await ctx.prisma.projectModule.delete({ where: { id: haveMat[0].id } });
  }

  return res;
};
