import { nonNull, objectType, list } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Project = objectType({
  name: 'Project',
  definition(t) {
    registerModelsWithPrismaBinding(t, undefined, ['calculatedWidth']);

    t.model.calculatedWidth({
      resolve: async (root, args, ctx, info, originalResolve) => {
        const calculatedWidth = await originalResolve(root, args, ctx, info);

        // If there's no calculated width and there's cabinet width + gable. We must calculate ourselves
        if (!calculatedWidth && root.cabinetWidth && root.gable) {
          const project = ctx.prisma.project.findUnique({ where: { id: root.id } });

          const slide = await project.slide();

          if (slide) {
            const runFormula = (formula: string, cabinetWidth: number, gable: number): number => {
              return new Function(
                '"use strict";return (' +
                  formula.replace('{width}', `${cabinetWidth}`).replace('{gable}', `${gable}`) +
                  ');'
              )();
            };

            return runFormula(slide.formula, root.cabinetWidth, root.gable);
          }
        }

        return calculatedWidth;
      }
    });

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
