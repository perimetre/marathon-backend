import { objectType } from 'nexus';

export const ModuleUnit = objectType({
  name: 'ModuleUnit',
  definition(t) {
    t.nonNull.float('millimeters');
    t.string('inches');
  }
});

export const ModuleMinMax = objectType({
  name: 'ModuleMinMax',
  definition(t) {
    t.field('min', {
      type: ModuleUnit
    });

    t.field('max', {
      type: ModuleUnit
    });
  }
});

export const ModuleDimension = objectType({
  name: 'ModuleDimension',
  definition(t) {
    t.field('height', {
      type: ModuleUnit
    });

    t.field('width', {
      type: ModuleMinMax
    });

    t.field('depth', {
      type: ModuleMinMax
    });
  }
});

export const TrimOffsetMetadata = objectType({
  name: 'TrimOffsetMetadata',
  definition(t) {
    t.float('left');
    t.float('right');
    t.float('top');
    t.float('bottom');
  }
});

export const QueueInfoMetadata = objectType({
  name: 'QueueInfoMetadata',
  definition(t) {
    t.string('append', {
      description: 'Repeat models'
    });

    t.nonNull.list.nonNull.string('modules', {
      description: 'Last model after repeat'
    });
  }
});

export const ModuleRulesMetadata = objectType({
  name: 'ModuleRulesMetadata',
  definition(t) {
    t.field('requiredNetInterior', {
      type: ModuleMinMax,
      description:
        'The product can only be put inside the drawer, if the current net interior of the drawer belongs to the range of the piece'
    });

    t.float('rotation', {
      description: 'The amount (in degrees) that the product can be rotated'
    });

    t.float('angle', {
      description: 'The amount (in degrees) that the product can be angled'
    });

    t.list.string('options', {
      description: 'Options are which other modules can be put IN modules'
    });

    t.list.string('trimmable', {
      description: "Where a module can be cut if there's excess beyond the drawer"
    });

    t.field('trimOffset', {
      type: TrimOffsetMetadata
    });

    t.boolean('fullDepth', {
      description: "Whether or not this module is only valid if it's taking the drawer full depth"
    });

    t.boolean('isFiller', {
      description: 'Whether or not this module is a filler kind of module'
    });

    t.field('queue', {
      type: QueueInfoMetadata,
      description: 'Queue info'
    });
  }
});

export const ModuleCollectionsMetadata = objectType({
  name: 'ModuleCollectionsMetadata',
  definition(t) {
    t.string('slug');
    t.nonNull.string('externalId');
  }
});

export const ModuleExtensionsMetadata = objectType({
  name: 'ModuleExtensionsMetadata',
  definition(t) {
    t.string('left');
    t.string('right');
    t.list.string('options');
  }
});

export const ModuleFinishesMetadata = objectType({
  name: 'ModuleFinishesMetadata',
  definition(t) {
    t.string('slug');
    t.nonNull.string('externalId');
  }
});

export const ModuleDrawerTypesMetadata = objectType({
  name: 'ModuleDrawerTypesMetadata',
  definition(t) {
    t.string('slug');
    t.nonNull.string('externalId');
  }
});

export const ModuleCategoryMetadata = objectType({
  name: 'ModuleCategoryMetadata',
  definition(t) {
    t.string('slug');
    t.nonNull.string('externalId');
  }
});

export const ModuleRules = objectType({
  name: 'ModuleRules',
  definition(t) {
    t.nonNull.string('partNumber', {
      description: 'The module part number, probably equivalent to the module id'
    });

    t.nonNull.string('externalId');
    t.string('description');
    t.string('thumbnailUrl');
    t.string('bundleUrl');
    t.boolean('isSubmodule');
    t.boolean('hasPegs');
    t.boolean('isMat');
    t.boolean('shouldHideBasedOnWidth');
    t.boolean('alwaysDisplay');
    t.boolean('isEdge');
    t.boolean('isVirtualProduct');
    t.string('ownerExternalId');

    t.nonNull.boolean('isExtension');

    t.list.string('trims', {
      description: 'Different types of edges a module might have'
    });

    t.list.nonNull.string('otherFinishes', {
      description: 'The equivalent of same module but on other finishes'
    });

    t.nonNull.field('finish', {
      type: ModuleFinishesMetadata,
      description: 'The current finish of this module'
    });

    t.nonNull.field('collection', {
      type: ModuleCollectionsMetadata
    });

    t.list.field('drawerTypes', {
      type: ModuleDrawerTypesMetadata
    });

    t.list.field('categories', {
      type: ModuleCategoryMetadata
    });

    t.nonNull.field('dimensions', {
      type: ModuleDimension
    });

    t.field('rules', {
      type: ModuleRulesMetadata
    });

    t.field('extensions', {
      type: ModuleExtensionsMetadata,
      description: 'Extensions are sub pieces that MUST BE CONNECTED to the main product or other extension.'
    });
  }
});
