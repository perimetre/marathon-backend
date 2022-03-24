import { FieldResolver, list, nonNull, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';
import { projectService } from '../services/project';
import { moduleService } from '../services/modules';
import { Context } from '../typings/context';
import { GraphQLResolveInfo } from 'graphql';
import { nanoid } from 'nanoid';
import { NexusGenArgTypes } from '../generated/nexus';
import logging from '../utils/logging';
import { makeError } from '../utils/exception';

export const ProjectCart = objectType({
  name: 'ProjectCart',
  definition(t) {
    t.nonNull.int('id');

    t.nonNull.int('quantity');

    t.nonNull.field('projectModule', {
      type: 'ProjectModule'
    });

    t.list.field('children', {
      type: nonNull(ProjectCart)
    });
  }
});

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
            externalId: { not: null },
            OR: [
              {
                moduleType: { some: { typeId: { equals: root.typeId } } },
                finishId: root.finishId,
                hasPegs: root.hasPegs
              },
              {
                alwaysDisplay: true
              }
            ],
            isSubmodule: false,
            isExtension: false,
            isMat: false
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

    t.field('cart', {
      type: nonNull(list(nonNull(ProjectCart))),
      resolve: (root, _args, ctx) => projectService({ db: ctx.prisma }).getCart(root.id)
    });

    t.field('cartAmount', {
      type: nonNull('Int'),
      resolve: async (root, _args, ctx) => {
        return (
          await projectService({
            db: ctx.prisma
          }).getCart(root.id)
        ).reduce((prev, curr) => {
          prev += curr.quantity;

          if (curr.children && curr.children.length > 0) {
            prev += curr.children.map((x) => x.quantity).reduce((sum, curr) => sum + curr, 0);
          }

          return prev;
        }, 0);
      }
    });
  }
});

export const createOneProjectCustomResolver = async (
  root: Record<string, unknown>,
  args: NexusGenArgTypes['Mutation']['createOneProject'],
  ctx: Context,
  info: GraphQLResolveInfo,
  originalResolver: FieldResolver<'Mutation', 'createOneProject'>
) => {
  try {
    const nameProject = await ctx.prisma.project.count({ where: { title: args.data.title } });

    const res = await originalResolver(
      root,
      { ...args, data: { ...args.data, slug: nameProject > 0 ? `${args.data.slug}-${nameProject}` : args.data.slug } },
      ctx,
      info
    );

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    logging.error(err, 'Error creating project');
    throw makeError('Error creating project', err.response.statusText);
  }
};

export const createOneProjectModuleCustomResolver = async (
  root: Record<string, unknown>,
  args: NexusGenArgTypes['Mutation']['createOneProjectModule'],
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
