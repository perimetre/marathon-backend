import { PrismaClient } from '@prisma/client';

type ProjectServiceDependencies = {
  db?: PrismaClient;
};

export const projectService = ({ db }: ProjectServiceDependencies) => {
  const calculateCabinetWidth = async (
    projectId: number,
    params: { cabinetWidth?: number | null; gable?: number | null },
    originalCalculatedWidth?: number | null
  ) => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    // If there's no calculated width and there's cabinet width + gable. We must calculate ourselves
    if (!originalCalculatedWidth && params.cabinetWidth && params.gable) {
      const slide = await db.project.findUnique({ where: { id: projectId } }).slide();

      // We check if it's number to help prevent arbitrary code execution
      if (slide && typeof params.cabinetWidth === 'number' && typeof params.gable === 'number') {
        return new Function(
          '"use strict";return (' +
            slide.formula.replace('{width}', `${params.cabinetWidth}`).replace('{gable}', `${params.gable}`) +
            ');'
        )() as number;
      }
    }

    return originalCalculatedWidth;
  };

  return {
    calculateCabinetWidth
  };
};
