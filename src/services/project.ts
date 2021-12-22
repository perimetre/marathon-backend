import { PrismaClient } from '@prisma/client';
import { groupBy, values } from 'lodash';
import { NexusGenObjects } from '../generated/nexus';

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

  const getCartModules = async (projectId: number) => {
    if (!db) {
      throw new Error('db dependency was not provided');
    }

    return db.project
      .findUnique({
        where: { id: projectId }
      })
      .projectModules({
        where: { parentId: { equals: null } },
        include: {
          module: true,
          children: { where: { module: { partNumber: { not: { contains: 'EXTENSION' } } } } }
        }
      });
  };

  const getCart = async (projectId: number) => {
    const projectModules = await getCartModules(projectId);

    // This method groups similar modules and returns the amount as quantity, then does the same for the children.
    // So if the user has two of the same modules. We show "quantity:2" instead of showing the module twice
    const cart = values(groupBy(projectModules, 'moduleId')).map((group) => ({
      id: group[0].id,
      projectModule: { ...group[0] },
      quantity: group.length,
      children: values(
        groupBy(
          projectModules.filter((x) => x.moduleId === group[0].moduleId).flatMap((x) => x.children) || [],
          'moduleId'
        )
      ).map((childGroup) => ({
        id: childGroup[0].id,
        projectModule: { ...childGroup[0] },
        quantity: childGroup.length
      }))
    }));

    return cart;
  };

  return {
    calculateCabinetWidth,
    getCartModules,
    getCart
  };
};
