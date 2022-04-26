import deepmerge from 'deepmerge';
import { helpers } from 'faker';
import { isEqual } from 'lodash';
import path from 'path';
import { CsFeatureInput } from '../../../generated/graphql';
import { NexusGenObjects } from '../../../generated/nexus';
import { convertMmToInFormatted } from '../../../utils/conversion';
import { makeError } from '../../../utils/exception';
import { replaceExtension } from '../../../utils/file';
import logging from '../../../utils/logging';
import { FeatureList, FEATURE_NAMES, MarathonModule, ModuleRules } from './constants';
import {
  getBooleanSelectFeature,
  getInputFeature,
  getMultiSelectFeature,
  getNumericFeature,
  getQuantityValueFeature,
  numberFromMaybe,
  numberUndefinedFromMaybe
} from './parseValues';

/**
 * Makes a dimension rule object from a given "configurator attribute" from their api
 */
export const makeDimensionRulesFromAttribute = (featureList?: FeatureList): ModuleRules['dimensions'] => {
  // -------- Height

  const heightMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.DIMENSION_HEIGHT,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  // -------- Width

  const minWidthMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.MIN_WIDTH,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const maxWidthMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.MAX_WIDTH,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  // -------- Depth

  const minDepthMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.MIN_DEPTH,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const maxDepthMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.MAX_DEPTH,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  return {
    height: {
      millimeters: heightMM,
      // Currently they don't provide in so we must convert from mm
      inches: convertMmToInFormatted(`${heightMM}`)
    },
    width: {
      min: {
        millimeters: minWidthMM,
        // Currently they don't provide in so we must convert from mm
        inches: convertMmToInFormatted(`${minWidthMM}`)
      },
      max: {
        millimeters: maxWidthMM,
        // Currently they don't provide in so we must convert from mm
        inches: convertMmToInFormatted(`${maxWidthMM}`)
      }
    },
    depth: {
      min: {
        millimeters: minDepthMM,
        // Currently they don't provide in so we must convert from mm
        inches: convertMmToInFormatted(`${minDepthMM}`)
      },
      max: {
        millimeters: maxDepthMM,
        // Currently they don't provide in so we must convert from mm
        inches: convertMmToInFormatted(`${maxDepthMM}`)
      }
    }
  };
};

export const makeRulesObjectFromAttribute = (
  featureList?: FeatureList,
  getOptions?: () => NonNullable<ModuleRules['rules']>['options']
): ModuleRules['rules'] => {
  // -------- Trimmable

  const trimmable = getMultiSelectFeature(featureList, FEATURE_NAMES.TRIMMABLE);

  // -------- Trim offset

  const trimOffsetBottomMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.TRIM_OFFSET_BOTTOM,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const trimOffsetTopMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.TRIM_OFFSET_TOP,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const trimOffsetLeftMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.TRIM_OFFSET_LEFT,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const trimOffsetRightMM = getQuantityValueFeature(
    featureList,
    FEATURE_NAMES.TRIM_OFFSET_RIGHT,
    FEATURE_NAMES.MM_ID,
    numberFromMaybe
  );

  const trimOffset = {
    // Force undefined if zero
    bottom: trimOffsetBottomMM || undefined,
    top: trimOffsetTopMM || undefined,
    left: trimOffsetLeftMM || undefined,
    right: trimOffsetRightMM || undefined
  };

  // -------- Angle/rotation

  const rotation = getNumericFeature(featureList, FEATURE_NAMES.ROTATION, numberUndefinedFromMaybe);
  const angle = getNumericFeature(featureList, FEATURE_NAMES.ANGLE, numberUndefinedFromMaybe);

  // -------- Booleans

  const isFiller = getBooleanSelectFeature(featureList, FEATURE_NAMES.IS_FILLER);
  const fullDepth = getBooleanSelectFeature(featureList, FEATURE_NAMES.FULL_DEPTH);

  const append = getInputFeature(featureList, FEATURE_NAMES.QUEUE_APPEND);
  const queueModules = getMultiSelectFeature(featureList, FEATURE_NAMES.QUEUE_MODULES);

  return {
    trimmable,
    trimOffset: Object.entries(trimOffset).some((x) => x[1] !== undefined) ? trimOffset : undefined,
    // requiredNetInterior,
    rotation,
    angle,
    fullDepth,
    isFiller,
    queue:
      append || queueModules
        ? {
            append,
            // We know that if there's an append or queue modules, it's not undefined
            modules: queueModules as string[]
          }
        : undefined,
    options:
      // If this module has extensions, its options will go under the extensions parent. So we ignore it here
      !featureList?.some(
        (feature) => feature?.name === FEATURE_NAMES.EXT_SIDE_LEFT || feature?.name === FEATURE_NAMES.EXT_SIDE_RIGHT
      ) && getOptions
        ? getOptions()
        : undefined
  };
};

const makeRuleExtensionsFromAttribute = (
  featureList?: FeatureList,
  getOptions?: () => NonNullable<ModuleRules['rules']>['options']
): ModuleRules['extensions'] | undefined => {
  // For some reason, there are TWO attributes with the same name, yay!
  // So we remove the useless one, which only have 'left' or 'right' as its text value, instead of what we expect
  const extensionFeatureList = featureList?.filter(
    (x) =>
      !(
        (x?.name === FEATURE_NAMES.EXT_SIDE_LEFT && (x as CsFeatureInput)?.text === 'left') ||
        (x?.name === FEATURE_NAMES.EXT_SIDE_RIGHT && (x as CsFeatureInput)?.text === 'right')
      )
  );

  // With the incorrect ones removed, we can grab the correct ones
  const left = getInputFeature(extensionFeatureList, FEATURE_NAMES.EXT_SIDE_LEFT);
  const right = getInputFeature(extensionFeatureList, FEATURE_NAMES.EXT_SIDE_RIGHT);

  if (!left && !right) return undefined;

  return {
    left,
    right,
    options: getOptions && getOptions()
  };
};

export const makeRulesFromMarathonModule = (
  marathonModule: MarathonModule
): {
  module: ModuleRules;
  attachments?: ReturnType<typeof makeAttachments>;
  extensions?: ReturnType<typeof makeExtensions>;
  alternative?: ModuleRules;
} => {
  const externalId = marathonModule.id;
  if (!externalId) throw makeError(`Module ${marathonModule.partNumber} does not have an id`, 'ruleMergeMissingId');

  const marathonFinish = marathonModule.spFinish;
  if (!marathonFinish || !marathonFinish.id)
    throw makeError(
      `Module ${marathonModule.partNumber} ${externalId} does not have a finish`,
      'ruleMergeMissingFinish'
    );

  const marathonCollection = marathonModule.spCollection;
  if (!marathonCollection || !marathonCollection.id)
    throw makeError(
      `Module ${marathonModule.partNumber} ${externalId} does not have a collection`,
      'ruleMergeMissingCollection'
    );

  const marathonDrawerTypes = marathonModule.spDrawerTypes;

  const specialAttributes = [
    FEATURE_NAMES.LEFT_EXTENSION_ATTRIBUTE,
    FEATURE_NAMES.RIGHT_EXTENSION_ATTRIBUTE,
    FEATURE_NAMES.QUEUE_MODULES_ATTRIBUTE,
    FEATURE_NAMES.QUEUE_APPEND_ATTRIBUTE
  ];

  // Merge all attributes that aren't the special attributes into a single one for ease of use since they decided to make things complicated
  // by "Special attributes" I mean whole attributes that contain an entire module in it, and not just rules. Like extensions and attachments
  const catchAllFeatureList = marathonModule.configuratorAttributes
    ?.filter(
      (attribute) => !specialAttributes.some((specialAttribute) => attribute?.description?.includes(specialAttribute))
    )
    .flatMap((x) => x?.features) as FeatureList;

  const getOptionsFn = () =>
    marathonModule.options
      ?.map((x) => x?.partNumber)
      .filter((x) => !!x) // Remove nulls and undefined values IF they exist
      .map((x) => x as string); // Cast to string because we know there are no null/undefined values since we filtered

  const dimensions = makeDimensionRulesFromAttribute(catchAllFeatureList);

  // If this module has extensions, its "options" goes under the extensions
  const rules = makeRulesObjectFromAttribute(catchAllFeatureList, getOptionsFn);

  // This "extensions" is not the complete extension _object_ but rather the extension property that only references part numbers of those objects
  const extensions = makeRuleExtensionsFromAttribute(catchAllFeatureList, getOptionsFn);

  const otherFinishes = marathonModule.finishes
    ?.map((x) => x?.element?.partNumber)
    .filter((x) => !!x) // Remove nulls and undefined values IF they exist
    .map((x) => x as string); // Cast to string because we know there are no null/undefined values since we filtered

  const sourceThumbnail =
    marathonModule.productPictures && marathonModule.productPictures.length > 0
      ? marathonModule.productPictures[0]?.fullpath?.trim()
      : undefined;

  const module: ModuleRules = {
    partNumber: marathonModule.partNumber || externalId,
    externalId: externalId,
    description:
      marathonModule.shortDescription || marathonModule.titleDescription || marathonModule.itemDescription || undefined,
    thumbnailUrl: sourceThumbnail,
    // bundleUrl: module?.bundlePath?.fullpath?.trim() || undefined,
    isSubmodule: marathonModule.isSubmodule || false,
    hasPegs: marathonModule.hasPegs || false,
    isMat: marathonModule.isMat || false,
    shouldHideBasedOnWidth:
      marathonModule.shouldHideBasedOnWidth !== undefined && marathonModule.shouldHideBasedOnWidth !== null
        ? marathonModule.shouldHideBasedOnWidth
        : true,
    alwaysDisplay: marathonModule.alwaysDisplay || false,
    isEdge: marathonModule.isEdge || false,
    isExtension: false, // False in this case, we'll manually set to true on the method regarding extensions
    finish: {
      externalId: marathonFinish.id,
      slug: marathonFinish.slug || undefined
    },
    collection: {
      externalId: marathonCollection.id,
      slug: marathonCollection.slug || undefined
    },
    drawerTypes: marathonDrawerTypes?.map((marathonDrawerType) => ({
      // Casting because we check previously right at the beginning and throw if it doesn't have an id
      externalId: marathonDrawerType?.id as string,
      slug: marathonDrawerType?.slug
    })),
    categories: marathonModule.spCategories
      ?.filter((x) => x && !!x?.id)
      .map((marathonCategory) => ({
        // Casting because we are filtering right above
        externalId: marathonCategory?.id as string,
        slug: marathonCategory?.slug
      })),
    otherFinishes,
    dimensions,
    rules,
    extensions
  };

  return {
    module,
    attachments: makeAttachments(module, marathonModule),
    extensions: makeExtensions(module, marathonModule),
    alternative: marathonModule.alternative
      ? {
          ...module,
          externalId: `${module.externalId}-alternative-${
            marathonModule.alternative.partNumber || `${module.partNumber}-B`
          }`,
          isVirtualProduct: true,
          ownerExternalId: module.externalId,
          hasPegs: marathonModule.alternative.hasPegs || false,
          partNumber: marathonModule.alternative.partNumber || `${module.partNumber}-B`
        }
      : undefined
  };
};

export const makeAttachments = (
  parent: ModuleRules,
  marathonModule: MarathonModule
):
  | {
      append: ModuleRules;
      queueModules: ModuleRules[];
    }
  | undefined => {
  // ---- Queue
  const queueModules = marathonModule?.configuratorAttributes // Of all configurator attributes
    ?.filter((attribute) => attribute?.description?.includes(FEATURE_NAMES.QUEUE_MODULES_ATTRIBUTE)) // We grab only the ones that includes the queue modules description
    ?.map((queueModuleAttribute) => {
      const partNumber =
        getInputFeature(queueModuleAttribute?.features, (feature) => feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)) ||
        `${parent.externalId}-queue-module`;

      let isVirtualProduct = false;

      let externalId = getInputFeature(queueModuleAttribute?.features, (feature) =>
        feature?.name?.endsWith(FEATURE_NAMES.EXT_ID)
      );

      if (!externalId) {
        externalId = helpers.slugify(partNumber).toLowerCase() + '-queue-module';
        isVirtualProduct = true;
      }

      const otherFinishes = getMultiSelectFeature(queueModuleAttribute?.features, (feature) =>
        feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
      );

      const dimensions = makeDimensionRulesFromAttribute(queueModuleAttribute?.features);
      const rules = makeRulesObjectFromAttribute(queueModuleAttribute?.features);

      // const sourceThumbnail = getInputFeature(queueModuleAttribute?.features, FEATURE_NAMES.THUMBNAIL_URL);
      const hasPegs = getBooleanSelectFeature(queueModuleAttribute?.features, FEATURE_NAMES.HAS_PEGS);

      return {
        ...parent,
        partNumber,
        externalId,
        isVirtualProduct,
        description: undefined, // They don't provide descriptions for nested modules
        thumbnailUrl: undefined, // Not really used for queue modules
        isSubmodule: true, // Not really used for queue modules but they are kinda like submodules
        hasPegs: hasPegs || false, // Not used for queue modules
        shouldHideBasedOnWidth: false, // Not used for queue modules
        alwaysDisplay: false, // Queue modules don't show up as pegboard(this isn't even used)
        isEdge: false, // Queue modules are never edge
        isExtension: false,
        isMat: false,
        otherFinishes,

        // Only those two are important for queue modules
        dimensions,
        rules
      } as ModuleRules;
    });

  // ---- Append
  // There should only be one append, as opposed of multiple queueModules
  // so we grab the one that the description correctly match
  const appendModulesAttribute = marathonModule?.configuratorAttributes?.find(
    (attribute) => attribute?.description === FEATURE_NAMES.QUEUE_APPEND_ATTRIBUTE
  );

  // Bail if there's none
  if (!queueModules || queueModules.length <= 0 || !appendModulesAttribute) return undefined;

  const partNumber =
    getInputFeature(appendModulesAttribute?.features, (feature) => feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)) ||
    parent.rules?.queue?.append ||
    `${parent.externalId}-append`;

  let isVirtualProduct = false;

  let externalId = getInputFeature(appendModulesAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_ID)
  );

  if (!externalId) {
    externalId = helpers.slugify(partNumber).toLowerCase() + '-append';
    isVirtualProduct = true;
  }

  const otherFinishes = getMultiSelectFeature(appendModulesAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
  );

  const dimensions = makeDimensionRulesFromAttribute(appendModulesAttribute?.features);
  const rules = makeRulesObjectFromAttribute(appendModulesAttribute?.features);

  // const sourceThumbnail = getInputFeature(appendModulesAttribute?.features, FEATURE_NAMES.THUMBNAIL_URL);
  const hasPegs = getBooleanSelectFeature(appendModulesAttribute?.features, FEATURE_NAMES.HAS_PEGS);

  return {
    append: {
      ...parent,
      partNumber,
      externalId,
      isVirtualProduct,
      description: undefined, // They don't provide descriptions for nested modules
      thumbnailUrl: undefined, // Not really used for queue modules
      isSubmodule: true, // Not really used for queue modules but they are kinda like submodules
      hasPegs: hasPegs || false, // Not used for queue modules
      shouldHideBasedOnWidth: false, // Not used for queue modules
      alwaysDisplay: false, // Queue modules don't show up as pegboard(this isn't even used)
      isEdge: false, // Queue modules are never edge
      isExtension: false,
      isMat: false,
      otherFinishes,

      // Only those two are important for queue modules
      dimensions,
      rules
    },
    queueModules
  };
};

export const makeExtensions = (
  parent: ModuleRules,
  marathonModule: MarathonModule
):
  | {
      left: ModuleRules;
      right?: ModuleRules;
    }
  | undefined => {
  // First, we grab the left and right extensions, using the expected attributes descriptions

  const leftExtensionAttribute = marathonModule?.configuratorAttributes?.find(
    (attribute) => attribute?.description === FEATURE_NAMES.LEFT_EXTENSION_ATTRIBUTE
  );

  const rightExtensionAttribute = marathonModule?.configuratorAttributes?.find(
    (attribute) => attribute?.description === FEATURE_NAMES.RIGHT_EXTENSION_ATTRIBUTE
  );

  // Bail if there's none
  if (!leftExtensionAttribute || !rightExtensionAttribute) return undefined;

  // Then, for some reason, extensions finishes are not arrays but a single input like everything else 🤷 so lets grab them too
  const leftPartNumber =
    getInputFeature(leftExtensionAttribute?.features, (feature) => feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)) ||
    parent.extensions?.left ||
    `${parent.externalId}-left-extension`;
  let leftVirtualProduct = false;

  let leftExternalId = getInputFeature(leftExtensionAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_ID)
  );

  if (!leftExternalId) {
    leftExternalId = helpers.slugify(leftPartNumber).toLowerCase();
    leftVirtualProduct = true;
  }

  const leftFinish = getInputFeature(leftExtensionAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
  );
  const leftOtherFinishes = leftFinish ? [leftFinish] : undefined;
  const leftDimensions = makeDimensionRulesFromAttribute(leftExtensionAttribute?.features);
  const leftRules = makeRulesObjectFromAttribute(leftExtensionAttribute?.features);
  const leftThumbnail = getInputFeature(leftExtensionAttribute?.features, FEATURE_NAMES.PRODUCT_PICTURE_FULL_PATH);

  const rightPartNumber =
    getInputFeature(rightExtensionAttribute?.features, (feature) => feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)) ||
    parent.extensions?.right ||
    `${parent.externalId}-right-extension`;
  let rightVirtualProduct = false;

  let rightExternalId = getInputFeature(rightExtensionAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_ID)
  );
  if (!rightExternalId) {
    rightExternalId = helpers.slugify(rightPartNumber).toLowerCase();
    rightVirtualProduct = true;
  }
  const rightFinish = getInputFeature(rightExtensionAttribute?.features, (feature) =>
    feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
  );
  const rightOtherFinishes = rightFinish ? [rightFinish] : undefined;
  const rightDimensions = makeDimensionRulesFromAttribute(rightExtensionAttribute?.features);
  const rightRules = makeRulesObjectFromAttribute(rightExtensionAttribute?.features);
  const rightThumbnail = getInputFeature(rightExtensionAttribute?.features, FEATURE_NAMES.PRODUCT_PICTURE_FULL_PATH);

  return {
    // And convert them to the format we expect
    left: {
      ...parent,
      extensions: undefined,
      partNumber: leftPartNumber,
      externalId: leftExternalId,
      isVirtualProduct: leftVirtualProduct,
      description: undefined, // They don't provide descriptions for nested modules
      thumbnailUrl: leftThumbnail,
      isSubmodule: true, // Not really used for extensions modules but they are kinda like submodules
      hasPegs: false, // Not used for extensions
      shouldHideBasedOnWidth: false, // Not used for extensions
      alwaysDisplay: false, // extensions don't show up as pegboard(this isn't even used)
      isEdge: false, // extensions are never edge,
      isExtension: true,
      isMat: false,
      otherFinishes: leftOtherFinishes,
      dimensions: leftDimensions,
      rules: leftRules
    },
    right:
      rightPartNumber !== leftPartNumber
        ? {
            ...parent,
            extensions: undefined,
            partNumber: rightPartNumber,
            externalId: rightExternalId,
            isVirtualProduct: rightVirtualProduct,
            description: undefined, // They don't provide descriptions for nested modules
            thumbnailUrl: rightThumbnail,
            isSubmodule: true, // Not really used for extensions modules but they are kinda like submodules
            hasPegs: false, // Not used for extensions
            shouldHideBasedOnWidth: false, // Not used for extensions
            alwaysDisplay: false, // extensions don't show up as pegboard(this isn't even used)
            isEdge: false, // extensions are never edge,
            isExtension: true,
            isMat: false,
            otherFinishes: rightOtherFinishes,
            dimensions: rightDimensions,
            rules: rightRules
          }
        : undefined
  };
};

export const mergeRules = (marathonRules: ModuleRules, currentRules?: ModuleRules | null): ModuleRules | undefined => {
  // If we already have rules, we merge ours with marathon but making sure marathon's will override ours. If not, we just return marathon's
  return currentRules
    ? deepmerge(currentRules, marathonRules, {
        // combine arrays using object equality (like in sets)
        arrayMerge: (destinationArray, sourceArray) => [
          ...sourceArray,
          ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s)))
        ]
      })
    : marathonRules;
};
