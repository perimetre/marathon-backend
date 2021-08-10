import { Prisma } from '@prisma/client';
import { ObjectDefinitionBlock } from 'nexus/dist/core';

type TypeNames = keyof typeof Prisma.ModelName;

export const registerModelsWithPrismaBinding = <TypeName extends TypeNames>(
  t: ObjectDefinitionBlock<TypeName>,
  keysToAddFiltering?: string[],
  keysToIgnore?: string[]
) => {
  // If we want to filter
  if (keysToAddFiltering) {
    const keys = Object.keys(t.model).filter((key) => (keysToIgnore ? !keysToIgnore.includes(key) : true));

    keys
      .filter((key) => !keysToAddFiltering.includes(key)) // Get only the keys that are NOT in the filter array
      .forEach((key) => t.model[key]()); // Register the model

    // Add filters only to the ones in the array
    keys
      .filter((key) => keysToAddFiltering.includes(key)) // Get only the keys that ARE in the filter array
      .forEach((key) => t.model[key]({ filtering: true, ordering: true, pagination: true })); // Register with filtering
  } else {
    // If we don't want to filter just run all
    Object.keys(t.model)
      .filter((key) => (keysToIgnore ? !keysToIgnore.includes(key) : true))
      .forEach((key) => t.model[key]());
  }
};
