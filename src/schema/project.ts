import { list, nonNull, objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';
import { projectService } from '../services/project';
import { NexusGenObjects } from '../generated/nexus';
import logging from '../utils/logging';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['calculatedWidth']);

    t.model.calculatedWidth({
      resolve: async (root, args, ctx, info, originalResolve) => {
        const calculatedWidth = await originalResolve(root, args, ctx, info);

        return (await projectService({ db: ctx.prisma }).calculateCabinetWidth(root.id, root, calculatedWidth)) || null;
      }
    });

    t.field('modules', {
      type: nonNull(list(nonNull('Module'))),
      resolve: async (root, args, ctx) => {
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
          return modules.filter((module) => {
            if (module.rules) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rules: NexusGenObjects['ModuleRules'] = module.rules as any;

              if (rules.dimensions?.width?.min?.millimeters && rules.dimensions?.width?.max?.millimeters) {
                const min = rules.dimensions.width.min.millimeters;
                const max = rules.dimensions.width.max.millimeters;

                if (min !== max) {
                  return calculatedWidth >= min && calculatedWidth < max;
                } else if (min === max || !max) {
                  return calculatedWidth > min;
                }
              }
            }

            return true;
          });
        } else {
          return modules;
        }
      }
    });
  }
});
