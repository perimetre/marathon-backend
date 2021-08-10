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
  User: Prisma.User
  Slide: Prisma.Slide
  Project: Prisma.Project
  Collection: Prisma.Collection
  Finish: Prisma.Finish
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'email' | 'projects'
      ordering: 'id' | 'email'
    }
    slides: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'model' | 'depthInCM' | 'depthInIN' | 'projects'
      ordering: 'id' | 'model' | 'depthInCM' | 'depthInIN'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'userId' | 'user' | 'slideId' | 'slide'
      ordering: 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'userId' | 'slideId'
    }
    collections: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects'
      ordering: 'id' | 'name'
    }
    finishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'name' | 'projects'
      ordering: 'id' | 'name'
    }
  },
  User: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'userId' | 'user' | 'slideId' | 'slide'
      ordering: 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'userId' | 'slideId'
    }
  }
  Slide: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'userId' | 'user' | 'slideId' | 'slide'
      ordering: 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'userId' | 'slideId'
    }
  }
  Project: {

  }
  Collection: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'userId' | 'user' | 'slideId' | 'slide'
      ordering: 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'userId' | 'slideId'
    }
  }
  Finish: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'userId' | 'user' | 'slideId' | 'slide'
      ordering: 'id' | 'title' | 'group' | 'type' | 'mainMeasureSystem' | 'widthInCM' | 'gableInCM' | 'widthInIN' | 'gableInIN' | 'collectionId' | 'finishId' | 'userId' | 'slideId'
    }
  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    user: 'User'
    users: 'User'
    slide: 'Slide'
    slides: 'Slide'
    project: 'Project'
    projects: 'Project'
    collection: 'Collection'
    collections: 'Collection'
    finish: 'Finish'
    finishes: 'Finish'
  },
  Mutation: {
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'AffectedRowsOutput'
    deleteOneUser: 'User'
    deleteManyUser: 'AffectedRowsOutput'
    upsertOneUser: 'User'
    createOneSlide: 'Slide'
    updateOneSlide: 'Slide'
    updateManySlide: 'AffectedRowsOutput'
    deleteOneSlide: 'Slide'
    deleteManySlide: 'AffectedRowsOutput'
    upsertOneSlide: 'Slide'
    createOneProject: 'Project'
    updateOneProject: 'Project'
    updateManyProject: 'AffectedRowsOutput'
    deleteOneProject: 'Project'
    deleteManyProject: 'AffectedRowsOutput'
    upsertOneProject: 'Project'
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
  },
  User: {
    id: 'Int'
    email: 'String'
    projects: 'Project'
  }
  Slide: {
    id: 'Int'
    model: 'String'
    depthInCM: 'Float'
    depthInIN: 'String'
    projects: 'Project'
  }
  Project: {
    id: 'Int'
    title: 'String'
    group: 'String'
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
    userId: 'Int'
    user: 'User'
    slideId: 'Int'
    slide: 'Slide'
  }
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
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  User: Typegen.NexusPrismaFields<'User'>
  Slide: Typegen.NexusPrismaFields<'Slide'>
  Project: Typegen.NexusPrismaFields<'Project'>
  Collection: Typegen.NexusPrismaFields<'Collection'>
  Finish: Typegen.NexusPrismaFields<'Finish'>
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
  