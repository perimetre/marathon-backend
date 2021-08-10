import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
    take?: boolean
    skip?: boolean
    cursor?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'No custom scalars are used in your Prisma Schema.'

// Prisma model type definitions
interface PrismaModels {
  Collection: Prisma.Collection
  Finish: Prisma.Finish
  Module: Prisma.Module
  Project: Prisma.Project
  ProjectGroup: Prisma.ProjectGroup
  ProjectModule: Prisma.ProjectModule
  Slide: Prisma.Slide
  User: Prisma.User
  UserProjectGroup: Prisma.UserProjectGroup
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    collections: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects'
      ordering: 'id' | 'name'
    }
    finishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects'
      ordering: 'id' | 'name'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'projectsThisBelongsTo'
      ordering: 'id' | 'partNumber'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'modules'
      ordering: 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'groupId' | 'slideId'
    }
    projectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects' | 'users'
      ordering: 'id' | 'name'
    }
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'Project' | 'projectId'
      ordering: 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'brand' | 'model' | 'depthInCM' | 'depthInIN' | 'projects'
      ordering: 'id' | 'brand' | 'model' | 'depthInCM' | 'depthInIN'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'email' | 'projectGroups'
      ordering: 'id' | 'email'
    }
    userProjectGroups: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'groupId' | 'group' | 'userId' | 'user' | 'relationshipType'
      ordering: 'id' | 'groupId' | 'userId' | 'relationshipType'
    }
  },
  Collection: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'modules'
      ordering: 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'groupId' | 'slideId'
    }
  }
  Finish: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'modules'
      ordering: 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'groupId' | 'slideId'
    }
  }
  Module: {
    projectsThisBelongsTo: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'Project' | 'projectId'
      ordering: 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  Project: {
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'Project' | 'projectId'
      ordering: 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  ProjectGroup: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'modules'
      ordering: 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'groupId' | 'slideId'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'groupId' | 'group' | 'userId' | 'user' | 'relationshipType'
      ordering: 'id' | 'groupId' | 'userId' | 'relationshipType'
    }
  }
  ProjectModule: {
    children: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'module' | 'parentId' | 'parent' | 'children' | 'Project' | 'projectId'
      ordering: 'id' | 'posX' | 'posY' | 'posZ' | 'rotX' | 'rotY' | 'rotZ' | 'moduleId' | 'parentId' | 'projectId'
    }
  }
  Slide: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'groupId' | 'group' | 'slideId' | 'slide' | 'modules'
      ordering: 'id' | 'title' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'groupId' | 'slideId'
    }
  }
  User: {
    projectGroups: {
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
    finish: 'Finish'
    finishes: 'Finish'
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
    createOneFinish: 'Finish'
    updateOneFinish: 'Finish'
    updateManyFinish: 'AffectedRowsOutput'
    deleteOneFinish: 'Finish'
    deleteManyFinish: 'AffectedRowsOutput'
    upsertOneFinish: 'Finish'
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
    name: 'String'
    projects: 'Project'
  }
  Finish: {
    id: 'Int'
    name: 'String'
    projects: 'Project'
  }
  Module: {
    id: 'Int'
    partNumber: 'String'
    projectsThisBelongsTo: 'ProjectModule'
  }
  Project: {
    id: 'Int'
    title: 'String'
    type: 'DrawerType'
    mainMeasureSystem: 'MeasureSystem'
    widthInCM: 'Float'
    gableInCM: 'Float'
    widthInIN: 'String'
    gableInIN: 'String'
    collectionId: 'Int'
    collection: 'Collection'
    finishId: 'Int'
    finish: 'Finish'
    groupId: 'Int'
    group: 'ProjectGroup'
    slideId: 'Int'
    slide: 'Slide'
    modules: 'ProjectModule'
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
    posY: 'Float'
    posZ: 'Float'
    rotX: 'Float'
    rotY: 'Float'
    rotZ: 'Float'
    moduleId: 'Int'
    module: 'Module'
    parentId: 'Int'
    parent: 'ProjectModule'
    children: 'ProjectModule'
    Project: 'Project'
    projectId: 'Int'
  }
  Slide: {
    id: 'Int'
    brand: 'String'
    model: 'String'
    depthInCM: 'Float'
    depthInIN: 'String'
    projects: 'Project'
  }
  User: {
    id: 'Int'
    email: 'String'
    projectGroups: 'UserProjectGroup'
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
  Finish: Typegen.NexusPrismaFields<'Finish'>
  Module: Typegen.NexusPrismaFields<'Module'>
  Project: Typegen.NexusPrismaFields<'Project'>
  ProjectGroup: Typegen.NexusPrismaFields<'ProjectGroup'>
  ProjectModule: Typegen.NexusPrismaFields<'ProjectModule'>
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
  