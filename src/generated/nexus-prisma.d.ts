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
  Collection: Prisma.Collection
  CollectionFinishes: Prisma.CollectionFinishes
  CollectionTranslations: Prisma.CollectionTranslations
  Finish: Prisma.Finish
  FinishTranslations: Prisma.FinishTranslations
  Module: Prisma.Module
  Project: Prisma.Project
  ProjectGroup: Prisma.ProjectGroup
  ProjectModule: Prisma.ProjectModule
  Slide: Prisma.Slide
  SlideDepth: Prisma.SlideDepth
  SlideSupplier: Prisma.SlideSupplier
  Type: Prisma.Type
  TypeTranslations: Prisma.TypeTranslations
  User: Prisma.User
  UserProjectGroup: Prisma.UserProjectGroup
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    collections: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'thumbnailUrl' | 'translations' | 'projects' | 'modules' | 'collectionFinishes' | 'slides'
      ordering: 'id' | 'slug' | 'thumbnailUrl'
    }
    collectionFinishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'collectionId' | 'collection' | 'finishId' | 'finish'
      ordering: 'id' | 'collectionId' | 'finishId'
    }
    collectionTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId' | 'collection'
      ordering: 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId'
    }
    finishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'thumbnailUrl' | 'translations' | 'projects' | 'modules' | 'collectionFinishes'
      ordering: 'id' | 'slug' | 'thumbnailUrl'
    }
    finishTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'finishId' | 'finish'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'finishId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'collectionId' | 'rules'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    projectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'slug' | 'projects' | 'users'
      ordering: 'id' | 'name' | 'slug'
    }
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'posX' | 'posZ' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'supplier' | 'collectionId' | 'collection' | 'depths' | 'projects'
      ordering: 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'collectionId'
    }
    slideDepths: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'display' | 'depth' | 'slideId' | 'slide' | 'projects'
      ordering: 'id' | 'display' | 'depth' | 'slideId'
    }
    slideSuppliers: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'thumbnailUrl' | 'name' | 'slug' | 'slides'
      ordering: 'id' | 'thumbnailUrl' | 'name' | 'slug'
    }
    types: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'thumbnailUrl' | 'translations' | 'projects'
      ordering: 'id' | 'slug' | 'thumbnailUrl'
    }
    typeTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'typeId' | 'type'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'typeId'
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
  Collection: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId' | 'collection'
      ordering: 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'collectionId' | 'rules'
    }
    collectionFinishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'collectionId' | 'collection' | 'finishId' | 'finish'
      ordering: 'id' | 'collectionId' | 'finishId'
    }
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'supplier' | 'collectionId' | 'collection' | 'depths' | 'projects'
      ordering: 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'collectionId'
    }
  }
  CollectionFinishes: {

  }
  CollectionTranslations: {

  }
  Finish: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'finishId' | 'finish'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'finishId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'projectModules'
      ordering: 'id' | 'partNumber' | 'thumbnailUrl' | 'isSubmodule' | 'hasPegs' | 'finishId' | 'collectionId' | 'rules'
    }
    collectionFinishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'collectionId' | 'collection' | 'finishId' | 'finish'
      ordering: 'id' | 'collectionId' | 'finishId'
    }
  }
  FinishTranslations: {

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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
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
  Slide: {
    depths: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'display' | 'depth' | 'slideId' | 'slide' | 'projects'
      ordering: 'id' | 'display' | 'depth' | 'slideId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  SlideDepth: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  SlideSupplier: {
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'supplier' | 'collectionId' | 'collection' | 'depths' | 'projects'
      ordering: 'id' | 'product' | 'slug' | 'formula' | 'supplierId' | 'collectionId'
    }
  }
  Type: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'typeId' | 'type'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'typeId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'projectModules'
      ordering: 'id' | 'slug' | 'title' | 'width' | 'gable' | 'typeId' | 'collectionId' | 'finishId' | 'groupId' | 'slideId' | 'slideDepthId'
    }
  }
  TypeTranslations: {

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
    collection: 'Collection'
    collections: 'Collection'
    collectionFinishes: 'CollectionFinishes'
    collectionFinishes: 'CollectionFinishes'
    collectionTranslations: 'CollectionTranslations'
    collectionTranslations: 'CollectionTranslations'
    finish: 'Finish'
    finishes: 'Finish'
    finishTranslations: 'FinishTranslations'
    finishTranslations: 'FinishTranslations'
    module: 'Module'
    modules: 'Module'
    project: 'Project'
    projects: 'Project'
    projectGroup: 'ProjectGroup'
    projectGroups: 'ProjectGroup'
    projectModule: 'ProjectModule'
    projectModules: 'ProjectModule'
    slide: 'Slide'
    slides: 'Slide'
    slideDepth: 'SlideDepth'
    slideDepths: 'SlideDepth'
    slideSupplier: 'SlideSupplier'
    slideSuppliers: 'SlideSupplier'
    type: 'Type'
    types: 'Type'
    typeTranslations: 'TypeTranslations'
    typeTranslations: 'TypeTranslations'
    user: 'User'
    users: 'User'
    userProjectGroup: 'UserProjectGroup'
    userProjectGroups: 'UserProjectGroup'
  },
  Mutation: {
    createOneCollection: 'Collection'
    updateOneCollection: 'Collection'
    updateManyCollection: 'AffectedRowsOutput'
    deleteOneCollection: 'Collection'
    deleteManyCollection: 'AffectedRowsOutput'
    upsertOneCollection: 'Collection'
    createOneCollectionFinishes: 'CollectionFinishes'
    updateOneCollectionFinishes: 'CollectionFinishes'
    updateManyCollectionFinishes: 'AffectedRowsOutput'
    deleteOneCollectionFinishes: 'CollectionFinishes'
    deleteManyCollectionFinishes: 'AffectedRowsOutput'
    upsertOneCollectionFinishes: 'CollectionFinishes'
    createOneCollectionTranslations: 'CollectionTranslations'
    updateOneCollectionTranslations: 'CollectionTranslations'
    updateManyCollectionTranslations: 'AffectedRowsOutput'
    deleteOneCollectionTranslations: 'CollectionTranslations'
    deleteManyCollectionTranslations: 'AffectedRowsOutput'
    upsertOneCollectionTranslations: 'CollectionTranslations'
    createOneFinish: 'Finish'
    updateOneFinish: 'Finish'
    updateManyFinish: 'AffectedRowsOutput'
    deleteOneFinish: 'Finish'
    deleteManyFinish: 'AffectedRowsOutput'
    upsertOneFinish: 'Finish'
    createOneFinishTranslations: 'FinishTranslations'
    updateOneFinishTranslations: 'FinishTranslations'
    updateManyFinishTranslations: 'AffectedRowsOutput'
    deleteOneFinishTranslations: 'FinishTranslations'
    deleteManyFinishTranslations: 'AffectedRowsOutput'
    upsertOneFinishTranslations: 'FinishTranslations'
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
    createOneSlide: 'Slide'
    updateOneSlide: 'Slide'
    updateManySlide: 'AffectedRowsOutput'
    deleteOneSlide: 'Slide'
    deleteManySlide: 'AffectedRowsOutput'
    upsertOneSlide: 'Slide'
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
    createOneType: 'Type'
    updateOneType: 'Type'
    updateManyType: 'AffectedRowsOutput'
    deleteOneType: 'Type'
    deleteManyType: 'AffectedRowsOutput'
    upsertOneType: 'Type'
    createOneTypeTranslations: 'TypeTranslations'
    updateOneTypeTranslations: 'TypeTranslations'
    updateManyTypeTranslations: 'AffectedRowsOutput'
    deleteOneTypeTranslations: 'TypeTranslations'
    deleteManyTypeTranslations: 'AffectedRowsOutput'
    upsertOneTypeTranslations: 'TypeTranslations'
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
  Collection: {
    id: 'Int'
    slug: 'String'
    thumbnailUrl: 'String'
    translations: 'CollectionTranslations'
    projects: 'Project'
    modules: 'Module'
    collectionFinishes: 'CollectionFinishes'
    slides: 'Slide'
  }
  CollectionFinishes: {
    id: 'Int'
    collectionId: 'Int'
    collection: 'Collection'
    finishId: 'Int'
    finish: 'Finish'
  }
  CollectionTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    subtitle: 'String'
    description: 'String'
    footer: 'String'
    collectionId: 'Int'
    collection: 'Collection'
  }
  Finish: {
    id: 'Int'
    slug: 'String'
    thumbnailUrl: 'String'
    translations: 'FinishTranslations'
    projects: 'Project'
    modules: 'Module'
    collectionFinishes: 'CollectionFinishes'
  }
  FinishTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    description: 'String'
    finishId: 'Int'
    finish: 'Finish'
  }
  Module: {
    id: 'Int'
    partNumber: 'String'
    thumbnailUrl: 'String'
    isSubmodule: 'Boolean'
    hasPegs: 'Boolean'
    finishId: 'Int'
    finish: 'Finish'
    collectionId: 'Int'
    collection: 'Collection'
    rules: 'Json'
    projectModules: 'ProjectModule'
  }
  Project: {
    id: 'Int'
    slug: 'String'
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
    slug: 'String'
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
  Slide: {
    id: 'Int'
    product: 'String'
    slug: 'String'
    formula: 'String'
    supplierId: 'Int'
    supplier: 'SlideSupplier'
    collectionId: 'Int'
    collection: 'Collection'
    depths: 'SlideDepth'
    projects: 'Project'
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
    slug: 'String'
    slides: 'Slide'
  }
  Type: {
    id: 'Int'
    slug: 'String'
    thumbnailUrl: 'String'
    translations: 'TypeTranslations'
    projects: 'Project'
  }
  TypeTranslations: {
    id: 'Int'
    locale: 'Locale'
    name: 'String'
    description: 'String'
    typeId: 'Int'
    type: 'Type'
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
  Collection: Typegen.NexusPrismaFields<'Collection'>
  CollectionFinishes: Typegen.NexusPrismaFields<'CollectionFinishes'>
  CollectionTranslations: Typegen.NexusPrismaFields<'CollectionTranslations'>
  Finish: Typegen.NexusPrismaFields<'Finish'>
  FinishTranslations: Typegen.NexusPrismaFields<'FinishTranslations'>
  Module: Typegen.NexusPrismaFields<'Module'>
  Project: Typegen.NexusPrismaFields<'Project'>
  ProjectGroup: Typegen.NexusPrismaFields<'ProjectGroup'>
  ProjectModule: Typegen.NexusPrismaFields<'ProjectModule'>
  Slide: Typegen.NexusPrismaFields<'Slide'>
  SlideDepth: Typegen.NexusPrismaFields<'SlideDepth'>
  SlideSupplier: Typegen.NexusPrismaFields<'SlideSupplier'>
  Type: Typegen.NexusPrismaFields<'Type'>
  TypeTranslations: Typegen.NexusPrismaFields<'TypeTranslations'>
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
  