import { GetProductListingQuery } from '../../../generated/graphql';
import { NexusGenObjects } from '../../../generated/nexus';
import { NoNullFields } from '../../../utils/types';

export const FEATURE_NAMES = {
  DIMENSION_HEIGHT: 'height',
  MM_ID: 'mm',
  IN_ID: 'in',
  MIN_WIDTH: 'width_min',
  MAX_WIDTH: 'width_max',
  MIN_DEPTH: 'depth_min',
  MAX_DEPTH: 'depth_max',
  TRIMMABLE: 'trimmable',
  TRIM_OFFSET_BOTTOM: 'trim_offset_bottom',
  TRIM_OFFSET_TOP: 'trim_offset_top',
  TRIM_OFFSET_LEFT: 'trim_offset_left',
  TRIM_OFFSET_RIGHT: 'trim_offset_right',
  DIMENSION_ATTRIBUTE: 'Dimensions - Drawer Organizers',
  QUEUE_MODULES_ATTRIBUTE: 'Queue Modules for SpiceRack',
  QUEUE_APPEND_ATTRIBUTE: 'Queue Append for SpiceRack',
  RIGHT_EXTENSION_ATTRIBUTE: 'Right Extensions for Imprint CT',
  LEFT_EXTENSION_ATTRIBUTE: 'Left Extensions for Imprint CT',
  RULES_ATTRIBUTE: 'Rules for Options',
  EXT_PART: 'ext_part',
  EXT_ID: 'ext_id',
  EXT_FINISHES: 'ext_finishes',
  ROTATION: 'rotation',
  ANGLE: 'angle',
  FULL_DEPTH: 'fullDepth',
  IS_FILLER: 'isFiller',
  EXT_SIDE_LEFT: 'imprint_ext_side_left',
  EXT_SIDE_RIGHT: 'imprint_ext_side_right',
  QUEUE_MODULES: 'queue_modules',
  QUEUE_APPEND: 'queue_append',
  PRODUCT_PICTURE_FULL_PATH: 'product_picture_full_path',
  HAS_PEGS: 'has_pegs',
  IS_MAT: 'is_mat'
  // SHOULD_HIDE_BASED_ON_WIDTH: 'should_hide_based_on_width'
};

export type MarathonModule = NonNullable<
  NonNullable<NonNullable<NonNullable<GetProductListingQuery['getProductListing']>['edges']>[0]>['node']
>;

export type ConfiguratorAttribute = NonNullable<NonNullable<MarathonModule>['configuratorAttributes']>[number];

export type FeatureList = NonNullable<ConfiguratorAttribute>['features'];

export type ModuleRules = NoNullFields<NexusGenObjects['ModuleRules']>;
