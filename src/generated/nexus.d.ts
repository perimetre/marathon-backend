/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type { Context } from './../typings/context';

declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>;
    model: NexusPrisma<TypeName, 'model'>;
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CollectionCreateOrConnectWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['CollectionCreateWithoutProjectsInput']; // CollectionCreateWithoutProjectsInput!
    where: NexusGenInputs['CollectionWhereUniqueInput']; // CollectionWhereUniqueInput!
  };
  CollectionCreateWithoutProjectsInput: {
    // input type
    name: string; // String!
  };
  CollectionUpdateOneRequiredWithoutProjectsInput: {
    // input type
    connect?: NexusGenInputs['CollectionWhereUniqueInput'] | null; // CollectionWhereUniqueInput
    connectOrCreate?: NexusGenInputs['CollectionCreateOrConnectWithoutProjectsInput'] | null; // CollectionCreateOrConnectWithoutProjectsInput
    create?: NexusGenInputs['CollectionCreateWithoutProjectsInput'] | null; // CollectionCreateWithoutProjectsInput
    update?: NexusGenInputs['CollectionUpdateWithoutProjectsInput'] | null; // CollectionUpdateWithoutProjectsInput
    upsert?: NexusGenInputs['CollectionUpsertWithoutProjectsInput'] | null; // CollectionUpsertWithoutProjectsInput
  };
  CollectionUpdateWithoutProjectsInput: {
    // input type
    name?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
  };
  CollectionUpsertWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['CollectionCreateWithoutProjectsInput']; // CollectionCreateWithoutProjectsInput!
    update: NexusGenInputs['CollectionUpdateWithoutProjectsInput']; // CollectionUpdateWithoutProjectsInput!
  };
  CollectionWhereUniqueInput: {
    // input type
    id?: number | null; // Int
  };
  EnumDrawerTypeFieldUpdateOperationsInput: {
    // input type
    set?: NexusGenEnums['DrawerType'] | null; // DrawerType
  };
  EnumMeasureSystemFieldUpdateOperationsInput: {
    // input type
    set?: NexusGenEnums['MeasureSystem'] | null; // MeasureSystem
  };
  FinishCreateOrConnectWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['FinishCreateWithoutProjectsInput']; // FinishCreateWithoutProjectsInput!
    where: NexusGenInputs['FinishWhereUniqueInput']; // FinishWhereUniqueInput!
  };
  FinishCreateWithoutProjectsInput: {
    // input type
    name: string; // String!
  };
  FinishUpdateOneRequiredWithoutProjectsInput: {
    // input type
    connect?: NexusGenInputs['FinishWhereUniqueInput'] | null; // FinishWhereUniqueInput
    connectOrCreate?: NexusGenInputs['FinishCreateOrConnectWithoutProjectsInput'] | null; // FinishCreateOrConnectWithoutProjectsInput
    create?: NexusGenInputs['FinishCreateWithoutProjectsInput'] | null; // FinishCreateWithoutProjectsInput
    update?: NexusGenInputs['FinishUpdateWithoutProjectsInput'] | null; // FinishUpdateWithoutProjectsInput
    upsert?: NexusGenInputs['FinishUpsertWithoutProjectsInput'] | null; // FinishUpsertWithoutProjectsInput
  };
  FinishUpdateWithoutProjectsInput: {
    // input type
    name?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
  };
  FinishUpsertWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['FinishCreateWithoutProjectsInput']; // FinishCreateWithoutProjectsInput!
    update: NexusGenInputs['FinishUpdateWithoutProjectsInput']; // FinishUpdateWithoutProjectsInput!
  };
  FinishWhereUniqueInput: {
    // input type
    id?: number | null; // Int
  };
  FloatFieldUpdateOperationsInput: {
    // input type
    decrement?: number | null; // Float
    divide?: number | null; // Float
    increment?: number | null; // Float
    multiply?: number | null; // Float
    set?: number | null; // Float
  };
  ProjectUpdateInput: {
    // input type
    collection?: NexusGenInputs['CollectionUpdateOneRequiredWithoutProjectsInput'] | null; // CollectionUpdateOneRequiredWithoutProjectsInput
    finish?: NexusGenInputs['FinishUpdateOneRequiredWithoutProjectsInput'] | null; // FinishUpdateOneRequiredWithoutProjectsInput
    gableInCM?: NexusGenInputs['FloatFieldUpdateOperationsInput'] | null; // FloatFieldUpdateOperationsInput
    gableInIN?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
    group?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
    mainMeasureSystem?: NexusGenInputs['EnumMeasureSystemFieldUpdateOperationsInput'] | null; // EnumMeasureSystemFieldUpdateOperationsInput
    slide?: NexusGenInputs['SlideUpdateOneRequiredWithoutProjectsInput'] | null; // SlideUpdateOneRequiredWithoutProjectsInput
    title?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
    type?: NexusGenInputs['EnumDrawerTypeFieldUpdateOperationsInput'] | null; // EnumDrawerTypeFieldUpdateOperationsInput
    user?: NexusGenInputs['UserUpdateOneRequiredWithoutProjectsInput'] | null; // UserUpdateOneRequiredWithoutProjectsInput
    widthInCM?: NexusGenInputs['FloatFieldUpdateOperationsInput'] | null; // FloatFieldUpdateOperationsInput
    widthInIN?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
  };
  ProjectWhereUniqueInput: {
    // input type
    id?: number | null; // Int
  };
  SlideCreateOrConnectWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['SlideCreateWithoutProjectsInput']; // SlideCreateWithoutProjectsInput!
    where: NexusGenInputs['SlideWhereUniqueInput']; // SlideWhereUniqueInput!
  };
  SlideCreateWithoutProjectsInput: {
    // input type
    depthInCM: number; // Float!
    depthInIN: string; // String!
    model: string; // String!
  };
  SlideUpdateOneRequiredWithoutProjectsInput: {
    // input type
    connect?: NexusGenInputs['SlideWhereUniqueInput'] | null; // SlideWhereUniqueInput
    connectOrCreate?: NexusGenInputs['SlideCreateOrConnectWithoutProjectsInput'] | null; // SlideCreateOrConnectWithoutProjectsInput
    create?: NexusGenInputs['SlideCreateWithoutProjectsInput'] | null; // SlideCreateWithoutProjectsInput
    update?: NexusGenInputs['SlideUpdateWithoutProjectsInput'] | null; // SlideUpdateWithoutProjectsInput
    upsert?: NexusGenInputs['SlideUpsertWithoutProjectsInput'] | null; // SlideUpsertWithoutProjectsInput
  };
  SlideUpdateWithoutProjectsInput: {
    // input type
    depthInCM?: NexusGenInputs['FloatFieldUpdateOperationsInput'] | null; // FloatFieldUpdateOperationsInput
    depthInIN?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
    model?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
  };
  SlideUpsertWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['SlideCreateWithoutProjectsInput']; // SlideCreateWithoutProjectsInput!
    update: NexusGenInputs['SlideUpdateWithoutProjectsInput']; // SlideUpdateWithoutProjectsInput!
  };
  SlideWhereUniqueInput: {
    // input type
    id?: number | null; // Int
  };
  StringFieldUpdateOperationsInput: {
    // input type
    set?: string | null; // String
  };
  UserCreateOrConnectWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['UserCreateWithoutProjectsInput']; // UserCreateWithoutProjectsInput!
    where: NexusGenInputs['UserWhereUniqueInput']; // UserWhereUniqueInput!
  };
  UserCreateWithoutProjectsInput: {
    // input type
    email: string; // String!
  };
  UserUpdateOneRequiredWithoutProjectsInput: {
    // input type
    connect?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
    connectOrCreate?: NexusGenInputs['UserCreateOrConnectWithoutProjectsInput'] | null; // UserCreateOrConnectWithoutProjectsInput
    create?: NexusGenInputs['UserCreateWithoutProjectsInput'] | null; // UserCreateWithoutProjectsInput
    update?: NexusGenInputs['UserUpdateWithoutProjectsInput'] | null; // UserUpdateWithoutProjectsInput
    upsert?: NexusGenInputs['UserUpsertWithoutProjectsInput'] | null; // UserUpsertWithoutProjectsInput
  };
  UserUpdateWithoutProjectsInput: {
    // input type
    email?: NexusGenInputs['StringFieldUpdateOperationsInput'] | null; // StringFieldUpdateOperationsInput
  };
  UserUpsertWithoutProjectsInput: {
    // input type
    create: NexusGenInputs['UserCreateWithoutProjectsInput']; // UserCreateWithoutProjectsInput!
    update: NexusGenInputs['UserUpdateWithoutProjectsInput']; // UserUpdateWithoutProjectsInput!
  };
  UserWhereUniqueInput: {
    // input type
    email?: string | null; // String
    id?: number | null; // Int
  };
}

export interface NexusGenEnums {
  DrawerType: 'deep' | 'shallow';
  MeasureSystem: 'imperial' | 'metric';
}

export interface NexusGenScalars {
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenObjects {
  Collection: {
    // root type
    id: number; // Int!
    name: string; // String!
  };
  Finish: {
    // root type
    id: number; // Int!
    name: string; // String!
  };
  Mutation: {};
  Project: {
    // root type
    collectionId: number; // Int!
    finishId: number; // Int!
    gableInCM: number; // Float!
    gableInIN: string; // String!
    group: string; // String!
    id: number; // Int!
    mainMeasureSystem: NexusGenEnums['MeasureSystem']; // MeasureSystem!
    slideId: number; // Int!
    title: string; // String!
    type: NexusGenEnums['DrawerType']; // DrawerType!
    userId: number; // Int!
    widthInCM: number; // Float!
    widthInIN: string; // String!
  };
  Query: {};
  Slide: {
    // root type
    depthInCM: number; // Float!
    depthInIN: string; // String!
    id: number; // Int!
    model: string; // String!
  };
  User: {
    // root type
    email: string; // String!
    id: number; // Int!
  };
}

export interface NexusGenInterfaces {}

export interface NexusGenUnions {}

export type NexusGenRootTypes = NexusGenObjects;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums;

export interface NexusGenFieldTypes {
  Collection: {
    // field return type
    id: number; // Int!
    name: string; // String!
    projects: NexusGenRootTypes['Project'][]; // [Project!]!
  };
  Finish: {
    // field return type
    id: number; // Int!
    name: string; // String!
    projects: NexusGenRootTypes['Project'][]; // [Project!]!
  };
  Mutation: {
    // field return type
    updateOneProject: NexusGenRootTypes['Project'] | null; // Project
  };
  Project: {
    // field return type
    collection: NexusGenRootTypes['Collection']; // Collection!
    collectionId: number; // Int!
    finish: NexusGenRootTypes['Finish']; // Finish!
    finishId: number; // Int!
    gableInCM: number; // Float!
    gableInIN: string; // String!
    group: string; // String!
    id: number; // Int!
    mainMeasureSystem: NexusGenEnums['MeasureSystem']; // MeasureSystem!
    slide: NexusGenRootTypes['Slide']; // Slide!
    slideId: number; // Int!
    title: string; // String!
    type: NexusGenEnums['DrawerType']; // DrawerType!
    user: NexusGenRootTypes['User']; // User!
    userId: number; // Int!
    widthInCM: number; // Float!
    widthInIN: string; // String!
  };
  Query: {
    // field return type
    project: NexusGenRootTypes['Project'] | null; // Project
  };
  Slide: {
    // field return type
    depthInCM: number; // Float!
    depthInIN: string; // String!
    id: number; // Int!
    model: string; // String!
    projects: NexusGenRootTypes['Project'][]; // [Project!]!
  };
  User: {
    // field return type
    email: string; // String!
    id: number; // Int!
    projects: NexusGenRootTypes['Project'][]; // [Project!]!
  };
}

export interface NexusGenFieldTypeNames {
  Collection: {
    // field return type name
    id: 'Int';
    name: 'String';
    projects: 'Project';
  };
  Finish: {
    // field return type name
    id: 'Int';
    name: 'String';
    projects: 'Project';
  };
  Mutation: {
    // field return type name
    updateOneProject: 'Project';
  };
  Project: {
    // field return type name
    collection: 'Collection';
    collectionId: 'Int';
    finish: 'Finish';
    finishId: 'Int';
    gableInCM: 'Float';
    gableInIN: 'String';
    group: 'String';
    id: 'Int';
    mainMeasureSystem: 'MeasureSystem';
    slide: 'Slide';
    slideId: 'Int';
    title: 'String';
    type: 'DrawerType';
    user: 'User';
    userId: 'Int';
    widthInCM: 'Float';
    widthInIN: 'String';
  };
  Query: {
    // field return type name
    project: 'Project';
  };
  Slide: {
    // field return type name
    depthInCM: 'Float';
    depthInIN: 'String';
    id: 'Int';
    model: 'String';
    projects: 'Project';
  };
  User: {
    // field return type name
    email: 'String';
    id: 'Int';
    projects: 'Project';
  };
}

export interface NexusGenArgTypes {
  Collection: {
    projects: {
      // args
      cursor?: NexusGenInputs['ProjectWhereUniqueInput'] | null; // ProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    };
  };
  Finish: {
    projects: {
      // args
      cursor?: NexusGenInputs['ProjectWhereUniqueInput'] | null; // ProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    };
  };
  Mutation: {
    updateOneProject: {
      // args
      data: NexusGenInputs['ProjectUpdateInput']; // ProjectUpdateInput!
      where: NexusGenInputs['ProjectWhereUniqueInput']; // ProjectWhereUniqueInput!
    };
  };
  Query: {
    project: {
      // args
      where: NexusGenInputs['ProjectWhereUniqueInput']; // ProjectWhereUniqueInput!
    };
  };
  Slide: {
    projects: {
      // args
      cursor?: NexusGenInputs['ProjectWhereUniqueInput'] | null; // ProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    };
  };
  User: {
    projects: {
      // args
      cursor?: NexusGenInputs['ProjectWhereUniqueInput'] | null; // ProjectWhereUniqueInput
      skip?: number | null; // Int
      take?: number | null; // Int
    };
  };
}

export interface NexusGenAbstractTypeMembers {}

export interface NexusGenTypeInterfaces {}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false;
    resolveType: true;
    __typename: false;
  };
};

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes'];
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {}
  interface NexusGenPluginSchemaConfig {}
  interface NexusGenPluginArgConfig {}
}
