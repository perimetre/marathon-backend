import { Module, PrismaClient } from '.prisma/client';
import { NexusGenObjects } from '../generated/nexus';

type ModuleServiceDependencies = {
  db?: PrismaClient;
};

export const moduleService = ({ db }: ModuleServiceDependencies) => {
  const filterModuleBasedOnWidth = async (modules: Module[], calculatedWidth: number) => {
    console.log(`------------------- Calculated: ${calculatedWidth}`);
    return modules.filter((module) => {
      if (module.rules && module.shouldHideBasedOnWidth) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rules: NexusGenObjects['ModuleRules'] = module.rules as any;

        if (rules.dimensions?.width?.min?.millimeters && rules.dimensions?.width?.max?.millimeters) {
          const min = rules.dimensions.width.min.millimeters;
          const max = rules.dimensions.width.max.millimeters;

          if (min !== max) {
            console.log(
              module.partNumber,
              min,
              max,
              ` | ${calculatedWidth} >= ${min} && ${calculatedWidth} < ${max}: `,
              calculatedWidth >= min && calculatedWidth < max
            );
            return calculatedWidth >= min && calculatedWidth < max;
          } else if (min === max || !max) {
            console.log(module.partNumber, min, max, ` | ${calculatedWidth} > ${min}: `, calculatedWidth > min);
            return calculatedWidth > min;
          }
        } else {
          console.log(module.partNumber, 'min === max');
          return false;
        }
      }

      console.log(module.partNumber, 'shouldHideBasedOnWidth false');

      return true;
    });
  };

  return { filterModuleBasedOnWidth };
};
