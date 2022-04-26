import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
    take?: boolean
    skip?: boolean
    cursor?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime' | 'Json'

// Prisma model type definitions
interface PrismaModels {
  Category: Prisma.Category
  ModuleCategory: Prisma.ModuleCategory
  Collection: Prisma.Collection
  CollectionFinishes: Prisma.CollectionFinishes
  CollectionTranslations: Prisma.CollectionTranslations
  Finish: Prisma.Finish
  FinishTranslations: Prisma.FinishTranslations
  List: Prisma.List
  ModuleAttachments: Prisma.ModuleAttachments
  Module: Prisma.Module
  Project: Prisma.Project
  ProjectModule: Prisma.ProjectModule
  Slide: Prisma.Slide
  SlideDepth: Prisma.SlideDepth
  SlideSupplier: Prisma.SlideSupplier
  Type: Prisma.Type
  ModuleType: Prisma.ModuleType
  TypeTranslations: Prisma.TypeTranslations
  User: Prisma.User
  Session: Prisma.Session
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    categories: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'externalId' | 'name' | 'moduleCategories'
      ordering: 'id' | 'slug' | 'externalId' | 'name'
    }
    moduleCategories: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'categoryId' | 'category'
      ordering: 'id' | 'moduleId' | 'categoryId'
    }
    collections: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'externalId' | 'thumbnailUrl' | 'hasPegs' | 'isComingSoon' | 'translations' | 'projects' | 'modules' | 'collectionFinishes' | 'slides'
      ordering: 'id' | 'slug' | 'externalId' | 'thumbnailUrl' | 'hasPegs' | 'isComingSoon'
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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'externalId' | 'thumbnailUrl' | 'translations' | 'projects' | 'modules' | 'collectionFinishes'
      ordering: 'id' | 'slug' | 'externalId' | 'thumbnailUrl'
    }
    finishTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'finishId' | 'finish'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'finishId'
    }
    lists: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'externalId' | 'name' | 'projectId' | 'project'
      ordering: 'id' | 'externalId' | 'name' | 'projectId'
    }
    moduleAttachments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'attachmentId' | 'attachment'
      ordering: 'id' | 'moduleId' | 'attachmentId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'module' | 'parentId' | 'parentNanoId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'parentId' | 'parentNanoId' | 'projectId'
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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'externalId' | 'thumbnailUrl' | 'hasPegs' | 'translations' | 'projects' | 'moduleType'
      ordering: 'id' | 'slug' | 'externalId' | 'thumbnailUrl' | 'hasPegs'
    }
    moduleTypes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'typeId' | 'moduleId' | 'type' | 'module'
      ordering: 'id' | 'typeId' | 'moduleId'
    }
    typeTranslations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'description' | 'typeId' | 'type'
      ordering: 'id' | 'locale' | 'name' | 'description' | 'typeId'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'email' | 'marathonUserId' | 'isAdminUser' | 'project' | 'session'
      ordering: 'id' | 'email' | 'marathonUserId' | 'isAdminUser'
    }
    sessions: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'token' | 'user'
      ordering: 'id' | 'userId' | 'token'
    }
  },
  Category: {
    moduleCategories: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'categoryId' | 'category'
      ordering: 'id' | 'moduleId' | 'categoryId'
    }
  }
  ModuleCategory: {

  }
  Collection: {
    translations: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId' | 'collection'
      ordering: 'id' | 'locale' | 'name' | 'subtitle' | 'description' | 'footer' | 'collectionId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
    modules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
    }
    collectionFinishes: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'collectionId' | 'collection' | 'finishId' | 'finish'
      ordering: 'id' | 'collectionId' | 'finishId'
    }
  }
  FinishTranslations: {

  }
  List: {

  }
  ModuleAttachments: {

  }
  Module: {
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'module' | 'parentId' | 'parentNanoId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'parentId' | 'parentNanoId' | 'projectId'
    }
    moduleCategories: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'categoryId' | 'category'
      ordering: 'id' | 'moduleId' | 'categoryId'
    }
    defaultLeftExtensionParents: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
    }
    defaultRightExtensionParents: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
    }
    attachmentToAppendParents: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultLeftExtension' | 'defaultRightExtensionId' | 'defaultRightExtension' | 'attachmentToAppendId' | 'attachmentToAppend' | 'finishId' | 'finish' | 'collectionId' | 'collection' | 'rules' | 'originalMarathonProductJson' | 'projectModules' | 'moduleCategories' | 'defaultLeftExtensionParents' | 'defaultRightExtensionParents' | 'attachmentToAppendParents' | 'moduleAttachments' | 'moduleAttachedTo' | 'moduleType'
      ordering: 'id' | 'partNumber' | 'externalId' | 'description' | 'thumbnailUrl' | 'bundleUrl' | 'isSubmodule' | 'hasPegs' | 'isMat' | 'isExtension' | 'shouldHideBasedOnWidth' | 'createdAt' | 'updatedAt' | 'alwaysDisplay' | 'isEdge' | 'defaultLeftExtensionId' | 'defaultRightExtensionId' | 'attachmentToAppendId' | 'finishId' | 'collectionId' | 'rules' | 'originalMarathonProductJson'
    }
    moduleAttachments: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'attachmentId' | 'attachment'
      ordering: 'id' | 'moduleId' | 'attachmentId'
    }
    moduleAttachedTo: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'moduleId' | 'module' | 'attachmentId' | 'attachment'
      ordering: 'id' | 'moduleId' | 'attachmentId'
    }
    moduleType: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'typeId' | 'moduleId' | 'type' | 'module'
      ordering: 'id' | 'typeId' | 'moduleId'
    }
  }
  Project: {
    projectModules: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'module' | 'parentId' | 'parentNanoId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'parentId' | 'parentNanoId' | 'projectId'
    }
    lists: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'externalId' | 'name' | 'projectId' | 'project'
      ordering: 'id' | 'externalId' | 'name' | 'projectId'
    }
  }
  ProjectModule: {
    children: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'module' | 'parentId' | 'parentNanoId' | 'parent' | 'children' | 'projectId' | 'project'
      ordering: 'id' | 'nanoId' | 'posX' | 'posY' | 'posZ' | 'rotY' | 'moduleId' | 'parentId' | 'parentNanoId' | 'projectId'
    }
  }
  Slide: {
    depths: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'display' | 'depth' | 'slideId' | 'slide' | 'projects'
      ordering: 'id' | 'display' | 'depth' | 'slideId'
    }
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
  }
  SlideDepth: {
    projects: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
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
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
    moduleType: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'typeId' | 'moduleId' | 'type' | 'module'
      ordering: 'id' | 'typeId' | 'moduleId'
    }
  }
  ModuleType: {

  }
  TypeTranslations: {

  }
  User: {
    project: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'type' | 'collectionId' | 'collection' | 'finishId' | 'finish' | 'slideId' | 'slide' | 'slideDepthId' | 'slideDepth' | 'userId' | 'user' | 'projectModules' | 'lists'
      ordering: 'id' | 'slug' | 'title' | 'cabinetWidth' | 'calculatedWidth' | 'gable' | 'typeId' | 'hasPegs' | 'collectionId' | 'finishId' | 'slideId' | 'slideDepthId' | 'userId'
    }
    session: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'userId' | 'token' | 'user'
      ordering: 'id' | 'userId' | 'token'
    }
  }
  Session: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    category: 'Category'
    categories: 'Category'
    moduleCategory: 'ModuleCategory'
    moduleCategories: 'ModuleCategory'
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
    list: 'List'
    lists: 'List'
    moduleAttachments: 'ModuleAttachments'
    moduleAttachments: 'ModuleAttachments'
    module: 'Module'
    modules: 'Module'
    project: 'Project'
    projects: 'Project'
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
    moduleType: 'ModuleType'
    moduleTypes: 'ModuleType'
    typeTranslations: 'TypeTranslations'
    typeTranslations: 'TypeTranslations'
    user: 'User'
    users: 'User'
    session: 'Session'
    sessions: 'Session'
  },
  Mutation: {
    createOneCategory: 'Category'
    updateOneCategory: 'Category'
    updateManyCategory: 'AffectedRowsOutput'
    deleteOneCategory: 'Category'
    deleteManyCategory: 'AffectedRowsOutput'
    upsertOneCategory: 'Category'
    createOneModuleCategory: 'ModuleCategory'
    updateOneModuleCategory: 'ModuleCategory'
    updateManyModuleCategory: 'AffectedRowsOutput'
    deleteOneModuleCategory: 'ModuleCategory'
    deleteManyModuleCategory: 'AffectedRowsOutput'
    upsertOneModuleCategory: 'ModuleCategory'
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
    createOneList: 'List'
    updateOneList: 'List'
    updateManyList: 'AffectedRowsOutput'
    deleteOneList: 'List'
    deleteManyList: 'AffectedRowsOutput'
    upsertOneList: 'List'
    createOneModuleAttachments: 'ModuleAttachments'
    updateOneModuleAttachments: 'ModuleAttachments'
    updateManyModuleAttachments: 'AffectedRowsOutput'
    deleteOneModuleAttachments: 'ModuleAttachments'
    deleteManyModuleAttachments: 'AffectedRowsOutput'
    upsertOneModuleAttachments: 'ModuleAttachments'
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
    createOneModuleType: 'ModuleType'
    updateOneModuleType: 'ModuleType'
    updateManyModuleType: 'AffectedRowsOutput'
    deleteOneModuleType: 'ModuleType'
    deleteManyModuleType: 'AffectedRowsOutput'
    upsertOneModuleType: 'ModuleType'
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
    createOneSession: 'Session'
    updateOneSession: 'Session'
    updateManySession: 'AffectedRowsOutput'
    deleteOneSession: 'Session'
    deleteManySession: 'AffectedRowsOutput'
    upsertOneSession: 'Session'
  },
  Category: {
    id: 'Int'
    slug: 'String'
    externalId: 'String'
    name: 'String'
    moduleCategories: 'ModuleCategory'
  }
  ModuleCategory: {
    id: 'Int'
    moduleId: 'Int'
    module: 'Module'
    categoryId: 'Int'
    category: 'Category'
  }
  Collection: {
    id: 'Int'
    slug: 'String'
    externalId: 'String'
    thumbnailUrl: 'String'
    hasPegs: 'Boolean'
    isComingSoon: 'Boolean'
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
    externalId: 'String'
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
  List: {
    id: 'Int'
    externalId: 'String'
    name: 'String'
    projectId: 'Int'
    project: 'Project'
  }
  ModuleAttachments: {
    id: 'Int'
    moduleId: 'Int'
    module: 'Module'
    attachmentId: 'Int'
    attachment: 'Module'
  }
  Module: {
    id: 'Int'
    partNumber: 'String'
    externalId: 'String'
    description: 'String'
    thumbnailUrl: 'String'
    bundleUrl: 'String'
    isSubmodule: 'Boolean'
    hasPegs: 'Boolean'
    isMat: 'Boolean'
    isExtension: 'Boolean'
    shouldHideBasedOnWidth: 'Boolean'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    alwaysDisplay: 'Boolean'
    isEdge: 'Boolean'
    defaultLeftExtensionId: 'Int'
    defaultLeftExtension: 'Module'
    defaultRightExtensionId: 'Int'
    defaultRightExtension: 'Module'
    attachmentToAppendId: 'Int'
    attachmentToAppend: 'Module'
    finishId: 'Int'
    finish: 'Finish'
    collectionId: 'Int'
    collection: 'Collection'
    rules: 'Json'
    originalMarathonProductJson: 'Json'
    projectModules: 'ProjectModule'
    moduleCategories: 'ModuleCategory'
    defaultLeftExtensionParents: 'Module'
    defaultRightExtensionParents: 'Module'
    attachmentToAppendParents: 'Module'
    moduleAttachments: 'ModuleAttachments'
    moduleAttachedTo: 'ModuleAttachments'
    moduleType: 'ModuleType'
  }
  Project: {
    id: 'Int'
    slug: 'String'
    title: 'String'
    cabinetWidth: 'Float'
    calculatedWidth: 'Float'
    gable: 'Float'
    typeId: 'Int'
    hasPegs: 'Boolean'
    type: 'Type'
    collectionId: 'Int'
    collection: 'Collection'
    finishId: 'Int'
    finish: 'Finish'
    slideId: 'Int'
    slide: 'Slide'
    slideDepthId: 'Int'
    slideDepth: 'SlideDepth'
    userId: 'Int'
    user: 'User'
    projectModules: 'ProjectModule'
    lists: 'List'
  }
  ProjectModule: {
    id: 'Int'
    nanoId: 'String'
    posX: 'Float'
    posY: 'Float'
    posZ: 'Float'
    rotY: 'Float'
    moduleId: 'Int'
    module: 'Module'
    parentId: 'Int'
    parentNanoId: 'String'
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
    externalId: 'String'
    thumbnailUrl: 'String'
    hasPegs: 'Boolean'
    translations: 'TypeTranslations'
    projects: 'Project'
    moduleType: 'ModuleType'
  }
  ModuleType: {
    id: 'Int'
    typeId: 'Int'
    moduleId: 'Int'
    type: 'Type'
    module: 'Module'
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
    marathonUserId: 'Int'
    isAdminUser: 'Boolean'
    project: 'Project'
    session: 'Session'
  }
  Session: {
    id: 'Int'
    userId: 'Int'
    token: 'String'
    user: 'User'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Category: Typegen.NexusPrismaFields<'Category'>
  ModuleCategory: Typegen.NexusPrismaFields<'ModuleCategory'>
  Collection: Typegen.NexusPrismaFields<'Collection'>
  CollectionFinishes: Typegen.NexusPrismaFields<'CollectionFinishes'>
  CollectionTranslations: Typegen.NexusPrismaFields<'CollectionTranslations'>
  Finish: Typegen.NexusPrismaFields<'Finish'>
  FinishTranslations: Typegen.NexusPrismaFields<'FinishTranslations'>
  List: Typegen.NexusPrismaFields<'List'>
  ModuleAttachments: Typegen.NexusPrismaFields<'ModuleAttachments'>
  Module: Typegen.NexusPrismaFields<'Module'>
  Project: Typegen.NexusPrismaFields<'Project'>
  ProjectModule: Typegen.NexusPrismaFields<'ProjectModule'>
  Slide: Typegen.NexusPrismaFields<'Slide'>
  SlideDepth: Typegen.NexusPrismaFields<'SlideDepth'>
  SlideSupplier: Typegen.NexusPrismaFields<'SlideSupplier'>
  Type: Typegen.NexusPrismaFields<'Type'>
  ModuleType: Typegen.NexusPrismaFields<'ModuleType'>
  TypeTranslations: Typegen.NexusPrismaFields<'TypeTranslations'>
  User: Typegen.NexusPrismaFields<'User'>
  Session: Typegen.NexusPrismaFields<'Session'>
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
  