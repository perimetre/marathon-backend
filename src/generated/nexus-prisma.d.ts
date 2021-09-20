import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
    take?: boolean
    skip?: boolean
    cursor?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'Json'

// Prisma model type definitions
interface PrismaModels {
  CollectionTranslations: Prisma.CollectionTranslations
  Collection: Prisma.Collection
  FinishTranslations: Prisma.FinishTranslations
  Finish: Prisma.Finish
  TypeTranslations: Prisma.TypeTranslations
  Type: Prisma.Type
  Module: Prisma.Module
  Project: Prisma.Project
  ProjectGroup: Prisma.ProjectGroup
  ProjectModule: Prisma.ProjectModule
  SlideDepth: Prisma.SlideDepth
  SlideSupplier: Prisma.SlideSupplier
  Slide: Prisma.Slide
  User: Prisma.User
  UserProjectGroup: Prisma.UserProjectGroup
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    collectionTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'collectionId' | 'collection'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'collectionId'
    }
    collections: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'thumbnailUrl' | 'translations' | 'projects' | 'Module'
      ordering: 'id' | 'thumbnailUrl'
    }
    finishTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'finishId' | 'finish'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'finishId'
    }
    finishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'thumbnailUrl' | 'translations' | 'projects' | 'Module'
      ordering: 'id' | 'thumbnailUrl'
    }
    typeTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'typeId' | 'type'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'typeId'
    }
    types: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'thumbnailUrl' | 'translations' | 'projects'
      ordering: 'id' | 'thumbnailUrl'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'collectionId' | 'rules'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    projectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects' | 'users'
      ordering: 'id' | 'name'
    }
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
    slideDepths: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'display' | 'depth' | 'slideId' | 'slide' | 'projects'
      ordering: 'id' | 'display' | 'depth' | 'slideId'
    }
    slideSuppliers: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'thumbnailUrl' | 'name' | 'slides'
      ordering: 'id' | 'thumbnailUrl' | 'name'
    }
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'model' | 'formula' | 'supplierId' | 'supplier' | 'depths' | 'projects'
      ordering: 'id' | 'model' | 'formula' | 'supplierId'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'email' | 'userProjectGroups'
      ordering: 'id' | 'email'
    }
    userProjectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'groupId' | 'group' | 'userId' | 'user' | 'relationshipType'
      ordering: 'id' | 'groupId' | 'userId' | 'relationshipType'
    }
  },
  CollectionTranslations: {

  }
  Collection: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'collectionId' | 'collection'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'collectionId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    Module: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'collectionId' | 'rules'
    }
  }
  FinishTranslations: {

  }
  Finish: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'finishId' | 'finish'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'finishId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    Module: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'finishId' | 'collectionId' | 'rules'
    }
  }
  TypeTranslations: {

  }
  Type: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'typeId' | 'type'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'typeId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  Module: {
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  Project: {
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  ProjectGroup: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'groupId' | 'group' | 'userId' | 'user' | 'relationshipType'
      ordering: 'id' | 'groupId' | 'userId' | 'relationshipType'
    }
  }
  ProjectModule: {
    children: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  SlideDepth: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  SlideSupplier: {
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'model' | 'formula' | 'supplierId' | 'supplier' | 'depths' | 'projects'
      ordering: 'id' | 'model' | 'formula' | 'supplierId'
    }
  }
  Slide: {
    depths: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'display' | 'depth' | 'slideId' | 'slide' | 'projects'
      ordering: 'id' | 'display' | 'depth' | 'slideId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  User: {
    userProjectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'groupId' | 'group' | 'userId' | 'user' | 'relationshipType'
      ordering: 'id' | 'groupId' | 'userId' | 'relationshipType'
    }
  }
  UserProjectGroup: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    collectionTranslations: 'CollectionTranslations'
    collectionTranslations: 'CollectionTranslations'
    collection: 'Collection'
    collections: 'Collection'
    finishTranslations: 'FinishTranslations'
    finishTranslations: 'FinishTranslations'
    finish: 'Finish'
    finishes: 'Finish'
    typeTranslations: 'TypeTranslations'
    typeTranslations: 'TypeTranslations'
    type: 'Type'
    types: 'Type'
    module: 'Module'
    modules: 'Module'
    project: 'Project'
    projects: 'Project'
    projectGroup: 'ProjectGroup'
    projectGroups: 'ProjectGroup'
    projectModule: 'ProjectModule'
    projectModules: 'ProjectModule'
    slideDepth: 'SlideDepth'
    slideDepths: 'SlideDepth'
    slideSupplier: 'SlideSupplier'
    slideSuppliers: 'SlideSupplier'
    slide: 'Slide'
    slides: 'Slide'
    user: 'User'
    users: 'User'
    userProjectGroup: 'UserProjectGroup'
    userProjectGroups: 'UserProjectGroup'
  },
  Mutation: {
    createOneCollectionTranslations: 'CollectionTranslations'
    updateOneCollectionTranslations: 'CollectionTranslations'
    updateManyCollectionTranslations: 'AffectedRowsOutput'
    deleteOneCollectionTranslations: 'CollectionTranslations'
    deleteManyCollectionTranslations: 'AffectedRowsOutput'
    upsertOneCollectionTranslations: 'CollectionTranslations'
    createOneCollection: 'Collection'
    updateOneCollection: 'Collection'
    updateManyCollection: 'AffectedRowsOutput'
    deleteOneCollection: 'Collection'
    deleteManyCollection: 'AffectedRowsOutput'
    upsertOneCollection: 'Collection'
    createOneFinishTranslations: 'FinishTranslations'
    updateOneFinishTranslations: 'FinishTranslations'
    updateManyFinishTranslations: 'AffectedRowsOutput'
    deleteOneFinishTranslations: 'FinishTranslations'
    deleteManyFinishTranslations: 'AffectedRowsOutput'
    upsertOneFinishTranslations: 'FinishTranslations'
    createOneFinish: 'Finish'
    updateOneFinish: 'Finish'
    updateManyFinish: 'AffectedRowsOutput'
    deleteOneFinish: 'Finish'
    deleteManyFinish: 'AffectedRowsOutput'
    upsertOneFinish: 'Finish'
    createOneTypeTranslations: 'TypeTranslations'
    updateOneTypeTranslations: 'TypeTranslations'
    updateManyTypeTranslations: 'AffectedRowsOutput'
    deleteOneTypeTranslations: 'TypeTranslations'
    deleteManyTypeTranslations: 'AffectedRowsOutput'
    upsertOneTypeTranslations: 'TypeTranslations'
    createOneType: 'Type'
    updateOneType: 'Type'
    updateManyType: 'AffectedRowsOutput'
    deleteOneType: 'Type'
    deleteManyType: 'AffectedRowsOutput'
    upsertOneType: 'Type'
    createOneModule: 'Module'
    updateOneModule: 'Module'
    updateManyModule: 'AffectedRowsOutput'
    deleteOneModule: 'Module'
    deleteManyModule: 'AffectedRowsOutput'
    upsertOneModule: 'Module'
    createOneProject: 'Project'
    updateOneProject: 'Project'
    updateManyProject: 'AffectedRowsOutput'
    deleteOneProject: 'Project'
    deleteManyProject: 'AffectedRowsOutput'
    upsertOneProject: 'Project'
    createOneProjectGroup: 'ProjectGroup'
    updateOneProjectGroup: 'ProjectGroup'
    updateManyProjectGroup: 'AffectedRowsOutput'
    deleteOneProjectGroup: 'ProjectGroup'
    deleteManyProjectGroup: 'AffectedRowsOutput'
    upsertOneProjectGroup: 'ProjectGroup'
    createOneProjectModule: 'ProjectModule'
    updateOneProjectModule: 'ProjectModule'
    updateManyProjectModule: 'AffectedRowsOutput'
    deleteOneProjectModule: 'ProjectModule'
    deleteManyProjectModule: 'AffectedRowsOutput'
    upsertOneProjectModule: 'ProjectModule'
    createOneSlideDepth: 'SlideDepth'
    updateOneSlideDepth: 'SlideDepth'
    updateManySlideDepth: 'AffectedRowsOutput'
    deleteOneSlideDepth: 'SlideDepth'
    deleteManySlideDepth: 'AffectedRowsOutput'
    upsertOneSlideDepth: 'SlideDepth'
    createOneSlideSupplier: 'SlideSupplier'
    updateOneSlideSupplier: 'SlideSupplier'
    updateManySlideSupplier: 'AffectedRowsOutput'
    deleteOneSlideSupplier: 'SlideSupplier'
    deleteManySlideSupplier: 'AffectedRowsOutput'
    upsertOneSlideSupplier: 'SlideSupplier'
    createOneSlide: 'Slide'
    updateOneSlide: 'Slide'
    updateManySlide: 'AffectedRowsOutput'
    deleteOneSlide: 'Slide'
    deleteManySlide: 'AffectedRowsOutput'
    upsertOneSlide: 'Slide'
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'AffectedRowsOutput'
    deleteOneUser: 'User'
    deleteManyUser: 'AffectedRowsOutput'
    upsertOneUser: 'User'
    createOneUserProjectGroup: 'UserProjectGroup'
    updateOneUserProjectGroup: 'UserProjectGroup'
    updateManyUserProjectGroup: 'AffectedRowsOutput'
    deleteOneUserProjectGroup: 'UserProjectGroup'
    deleteManyUserProjectGroup: 'AffectedRowsOutput'
    upsertOneUserProjectGroup: 'UserProjectGroup'
  },
  CollectionTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    description: 'String'
    collectionId: 'Int'
    collection: 'Collection'
  }
  Collection: {
    id: 'Int'
    thumbnailUrl: 'String'
    translations: 'CollectionTranslations'
    projects: 'Project'
    Module: 'Module'
  }
  FinishTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    description: 'String'
    finishId: 'Int'
    finish: 'Finish'
  }
  Finish: {
    id: 'Int'
    thumbnailUrl: 'String'
    translations: 'FinishTranslations'
    projects: 'Project'
    Module: 'Module'
  }
  TypeTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    description: 'String'
    typeId: 'Int'
    type: 'Type'
  }
  Type: {
    id: 'Int'
    thumbnailUrl: 'String'
    translations: 'TypeTranslations'
    projects: 'Project'
  }
  Module: {
    id: 'Int'
    partNumber: 'String'
    thumbnailUrl: 'String'
    finishId: 'Int'
    finish: 'Finish'
    collectionId: 'Int'
    collection: 'Collection'
    rules: 'Json'
    projectModules: 'ProjectModule'
  }
  Project: {
    id: 'Int'
    title: 'String'
    width: 'Float'
    gable: 'Float'
    typeId: 'Int'
    type: 'Type'
    collectionId: 'Int'
    collection: 'Collection'
    finishId: 'Int'
    finish: 'Finish'
    groupId: 'Int'
    group: 'ProjectGroup'
    slideId: 'Int'
    slide: 'Slide'
    slideDepthId: 'Int'
    slideDepth: 'SlideDepth'
    projectModules: 'ProjectModule'
  }
  ProjectGroup: {
    id: 'Int'
    name: 'String'
    projects: 'Project'
    users: 'UserProjectGroup'
  }
  ProjectModule: {
    id: 'Int'
    posX: 'Float'
    posZ: 'Float'
    rotZ: 'Float'
    moduleId: 'Int'
    module: 'Module'
    parentId: 'Int'
    parent: 'ProjectModule'
    children: 'ProjectModule'
    projectId: 'Int'
    project: 'Project'
  }
  SlideDepth: {
    id: 'Int'
    display: 'String'
    depth: 'Float'
    slideId: 'Int'
    slide: 'Slide'
    projects: 'Project'
  }
  SlideSupplier: {
    id: 'Int'
    thumbnailUrl: 'String'
    name: 'String'
    slides: 'Slide'
  }
  Slide: {
    id: 'Int'
    model: 'String'
    formula: 'String'
    supplierId: 'Int'
    supplier: 'SlideSupplier'
    depths: 'SlideDepth'
    projects: 'Project'
  }
  User: {
    id: 'Int'
    email: 'String'
    userProjectGroups: 'UserProjectGroup'
  }
  UserProjectGroup: {
    id: 'Int'
    groupId: 'Int'
    group: 'ProjectGroup'
    userId: 'Int'
    user: 'User'
    relationshipType: 'UserProjectGroupRelationshipType'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  CollectionTranslations: Typegen.NexusPrismaFields<'CollectionTranslations'>
  Collection: Typegen.NexusPrismaFields<'Collection'>
  FinishTranslations: Typegen.NexusPrismaFields<'FinishTranslations'>
  Finish: Typegen.NexusPrismaFields<'Finish'>
  TypeTranslations: Typegen.NexusPrismaFields<'TypeTranslations'>
  Type: Typegen.NexusPrismaFields<'Type'>
  Module: Typegen.NexusPrismaFields<'Module'>
  Project: Typegen.NexusPrismaFields<'Project'>
  ProjectGroup: Typegen.NexusPrismaFields<'ProjectGroup'>
  ProjectModule: Typegen.NexusPrismaFields<'ProjectModule'>
  SlideDepth: Typegen.NexusPrismaFields<'SlideDepth'>
  SlideSupplier: Typegen.NexusPrismaFields<'SlideSupplier'>
  Slide: Typegen.NexusPrismaFields<'Slide'>
  User: Typegen.NexusPrismaFields<'User'>
  UserProjectGroup: Typegen.NexusPrismaFields<'UserProjectGroup'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  