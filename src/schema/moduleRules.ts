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

    t.list.nonNull.string('options', {
      description: 'Options are which other modules can be put IN modules'
    });

    t.list.nonNull.string('trimmable', {
      description: "Where a module can be cut if there's excess beyond the drawer"
    });

    t.field('trimOffset', {
      type: TrimOffsetMetadata
    });

    t.boolean('fullDepth', {
      description: "Whether or not this module is only valid if it's taking the drawer full depth"
    });
  }
});

export const ModuleExtensionsMetadata = objectType({
  name: 'ModuleExtensionsMetadata',
  definition(t) {
    t.string('left');
    t.string('right');
    t.list.nonNull.string('options');
  }
});

export const ModuleRules = objectType({
  name: 'ModuleRules',
  definition(t) {
    t.nonNull.string('partNumber', {
      description: 'The module part number, probably equivalent to the module id'
    });

    t.list.nonNull.string('finishes', {
      description:
        'Modules that are basically this module but in a different finish(color), to allow the ui to easily switch between them'
    });

    t.list.nonNull.string('trims', {
      description: 'Different types of edges a module might have'
    });

    t.field('dimensions', {
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
