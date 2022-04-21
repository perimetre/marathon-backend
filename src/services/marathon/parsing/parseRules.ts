import deepmerge from 'deepmerge';
import { isEqual } from 'lodash';
import { CsFeatureInput } from '../../../generated/graphql';
import { NexusGenObjects } from '../../../generated/nexus';
import { convertMmToInFormatted } from '../../../utils/conversion';
import { makeError } from '../../../utils/exception';
import { FeatureList, FEATURE_NAMES, MarathonModule } from './constants';
import {
  getQuantityValueFeature,
  numberFromMaybe,
  getBooleanSelectFeature,
  getInputFeature,
  getMultiSelectFeature,
  getNumericFeature,
  numberUndefinedFromMaybe
} from './parseValues';

/**
 * Makes a dimension rule object from a given "configurator attribute" from their api
 */
export const makeDimensionRulesFromAttribute = (
  featureList?: FeatureList
): NexusGenObjects['ModuleRules']['dimensions'] => {
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
  getOptions?: () => NonNullable<NexusGenObjects['ModuleRules']['rules']>['options']
): NexusGenObjects['ModuleRules']['rules'] => {
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
  getOptions?: () => NonNullable<NexusGenObjects['ModuleRules']['rules']>['options']
): NexusGenObjects['ModuleRules']['extensions'] | undefined => {
  //  Remove left/right feature that only contain left/right text in it
  const extensionFeatureList = featureList?.filter(
    (x) =>
      !(
        (x?.name === FEATURE_NAMES.EXT_SIDE_LEFT && (x as CsFeatureInput)?.text === 'left') ||
        (x?.name === FEATURE_NAMES.EXT_SIDE_RIGHT && (x as CsFeatureInput)?.text === 'right')
      )
  );

  const left = getInputFeature(extensionFeatureList, FEATURE_NAMES.EXT_SIDE_LEFT);
  const right = getInputFeature(extensionFeatureList, FEATURE_NAMES.EXT_SIDE_RIGHT);

  if (!left && !right) return undefined;

  return {
    left,
    right,
    options: getOptions && getOptions()
  };
};

export const makeRulesWithAttributes = (
  featureList: FeatureList,
  getPartNumber: () => string | undefined,
  isImprintExtension?: boolean,
  getFinishes?: () => NexusGenObjects['ModuleRules']['finishes'],
  getOptions?: () => NonNullable<NexusGenObjects['ModuleRules']['rules']>['options']
): NexusGenObjects['ModuleRules'] => {
  const dimensions = makeDimensionRulesFromAttribute(featureList);
  // If this module has extensions, its "options" goes under the extensions
  const rules = makeRulesObjectFromAttribute(featureList, getOptions);
  const extensions = makeRuleExtensionsFromAttribute(featureList, getOptions);

  return {
    partNumber: getPartNumber() || '',
    isImprintExtension: !!isImprintExtension,
    finishes: getFinishes && getFinishes(),
    dimensions,
    rules,
    extensions
  };
};

const makeRulesFromMarathonModule = (marathonModule: MarathonModule): NexusGenObjects['ModuleRules'] => {
  const partNumber = marathonModule?.partNumber?.trim();
  if (!partNumber) throw makeError('Cannot create rule without partNumber', 'ruleMergeMissingPartNumber');

  const specialAttributes = [
    FEATURE_NAMES.EXT_SIDE_LEFT,
    FEATURE_NAMES.EXT_SIDE_RIGHT,
    FEATURE_NAMES.QUEUE_MODULES_ATTRIBUTE,
    FEATURE_NAMES.QUEUE_APPEND_ATTRIBUTE
  ];

  // Merge all attributes that aren't the special attributes into a single one
  const catchAllFeatureList = marathonModule?.configuratorAttributes
    ?.filter(
      (attribute) => !specialAttributes.some((specialAttribute) => attribute?.description?.includes(specialAttribute))
    )
    .flatMap((x) => x?.features);

  return makeRulesWithAttributes(
    catchAllFeatureList as FeatureList,
    () => partNumber,
    false,
    () =>
      marathonModule?.finishes
        ?.map((x) => x?.element?.partNumber)
        .filter((x) => !!x) // Remove nulls and undefined values IF they exist
        .map((x) => x as string), // Cast to string because we know there are no null/undefined values since we filtered
    () =>
      marathonModule?.options
        ?.map((x) => x?.partNumber)
        .filter((x) => !!x) // Remove nulls and undefined values IF they exist
        .map((x) => x as string) // Cast to string because we know there are no null/undefined values since we filtered
  );
};

// TODO: Make a similar of this for extensions
export const makeQueueAppendRulesFromMarathonModule = (
  marathonModule: MarathonModule
):
  | {
      append?: Partial<NexusGenObjects['ModuleRules']>;
      queueModules?: Partial<NexusGenObjects['ModuleRules']>[];
    }
  | undefined => {
  // ---- Queue
  const queueModules = marathonModule?.configuratorAttributes
    ?.filter((attribute) => attribute?.description?.includes(FEATURE_NAMES.QUEUE_MODULES_ATTRIBUTE))
    ?.map((queueModuleAttribute) =>
      makeRulesWithAttributes(
        queueModuleAttribute?.features,
        () =>
          getInputFeature(queueModuleAttribute?.features, (feature) => feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)),
        false,
        () =>
          getMultiSelectFeature(queueModuleAttribute?.features, (feature) =>
            feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
          )
      )
    );

  // ---- Append
  const appendModulesAttribute = marathonModule?.configuratorAttributes?.find(
    (attribute) => attribute?.description === FEATURE_NAMES.QUEUE_APPEND_ATTRIBUTE
  );

  if (!queueModules && !appendModulesAttribute) return undefined;

  return {
    append: appendModulesAttribute
      ? makeRulesWithAttributes(
          appendModulesAttribute?.features,
          () =>
            getInputFeature(appendModulesAttribute?.features, (feature) =>
              feature?.name?.endsWith(FEATURE_NAMES.EXT_PART)
            ),
          false,
          () =>
            getMultiSelectFeature(appendModulesAttribute?.features, (feature) =>
              feature?.name?.endsWith(FEATURE_NAMES.EXT_FINISHES)
            )
        )
      : undefined,
    queueModules
  };
};

export const mergeRules = (
  marathonModule: MarathonModule,
  currentRules?: NexusGenObjects['ModuleRules'] | null
): NexusGenObjects['ModuleRules'] | undefined => {
  const partNumber = marathonModule?.partNumber?.trim() || currentRules?.partNumber;
  if (!partNumber) throw makeError('Cannot create rule without partNumber', 'ruleMergeMissingPartNumber');

  const marathonRules = makeRulesFromMarathonModule(marathonModule);

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
