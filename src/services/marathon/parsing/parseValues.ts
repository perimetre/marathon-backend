import {
  CsFeatureQuantityValue,
  CsFeatureMultiselect,
  CsFeatureInput,
  CsFeatureNumeric,
  CsFeatureBooleanSelect
} from '../../../generated/graphql';
import { convertInToMmFormatted, convertMmToInFormatted } from '../../../utils/conversion';
import { makeError } from '../../../utils/exception';
import { FeatureList, FEATURE_NAMES } from './constants';

/**
 * Tries to grab a value of @param featureName from a feature list
 */
export const getQuantityValueFeature = <TResult>(
  featureList: FeatureList,
  featureName: string,
  featureUnitId: string,
  format?: (value?: unknown) => TResult
): TResult => {
  // Get the feature with the name we want from the list
  const feature = featureList?.find((feature) => feature?.name === featureName) as CsFeatureQuantityValue | undefined;

  // If unit is wrong
  if (feature?.quantityvalue?.unit?.id && feature.quantityvalue.unit.id !== featureUnitId) {
    if (featureUnitId === FEATURE_NAMES.MM_ID && feature.quantityvalue.unit.id === FEATURE_NAMES.IN_ID) {
      const inchValue = convertInToMmFormatted(`${feature.quantityvalue.value || 0}`);

      return format ? format(inchValue) : (inchValue as unknown as TResult);
    } else if (featureUnitId === FEATURE_NAMES.IN_ID && feature.quantityvalue.unit.id === FEATURE_NAMES.MM_ID) {
      const mmValue = convertMmToInFormatted(`${feature.quantityvalue.value || 0}`);

      return format ? format(mmValue) : (mmValue as unknown as TResult);
    } else {
      throw makeError(
        `Expected ${featureName} feature as ${featureUnitId}, but was returned as "${feature?.quantityvalue?.unit?.id}" with value "${feature.quantityvalue.value}"`,
        'ruleMergeFeatureQuantityUnit'
      );
    }
  }

  // Format or return plain
  return format ? format(feature?.quantityvalue?.value) : (feature?.quantityvalue?.value as unknown as TResult);
};

export const getMultiSelectFeature = (
  featureList: FeatureList,
  featureName: string | ((feature: NonNullable<FeatureList>[number]) => boolean | undefined)
): string[] | undefined =>
  (
    featureList?.find((feature) =>
      typeof featureName === 'string' ? feature?.name === featureName : featureName(feature)
    ) as CsFeatureMultiselect | undefined
  )?.selections
    ?.filter((x) => !!x) // Remove nulls and undefined values IF they exist
    .map((x) => x as string);

export const getInputFeature = (
  featureList: FeatureList,
  featureName: string | ((feature: NonNullable<FeatureList>[number]) => boolean | undefined)
): string | undefined => {
  const stringValue = (
    featureList?.find((feature) =>
      typeof featureName === 'string' ? feature?.name === featureName : featureName(feature)
    ) as CsFeatureInput | undefined
  )?.text;

  return stringValue !== null ? stringValue : undefined;
};

export const getNumericFeature = <TResult>(
  featureList: FeatureList,
  featureName: string | ((feature: NonNullable<FeatureList>[number]) => boolean | undefined),
  format?: (value?: unknown) => TResult
) => {
  const stringValue = (
    featureList?.find((feature) =>
      typeof featureName === 'string' ? feature?.name === featureName : featureName(feature)
    ) as CsFeatureNumeric | undefined
  )?.number as unknown as TResult;

  return format ? format(stringValue) : (stringValue as unknown as TResult);
};

export const getBooleanSelectFeature = (
  featureList: FeatureList,
  featureName: string | ((feature: NonNullable<FeatureList>[number]) => boolean | undefined)
): boolean | undefined => {
  const boolValue = (
    featureList?.find((feature) =>
      typeof featureName === 'string' ? feature?.name === featureName : featureName(feature)
    ) as CsFeatureBooleanSelect | undefined
  )?.checked;

  return boolValue !== null ? boolValue : undefined;
};

/**
 * Tries to safely convert a param to a number
 */
export const numberFromMaybe = (originalValue?: string | number | null | unknown): number => {
  let value = originalValue;

  if (typeof value !== 'number') value = parseFloat(`${value}`);

  // Casting because we convert the value above
  return value && !isNaN(value as number) ? (value as number) : 0;
};

export const numberUndefinedFromMaybe = (originalValue?: string | number | null | unknown): number | undefined => {
  if (!originalValue) return undefined;
  let value = originalValue;

  if (typeof value !== 'number') value = parseFloat(`${value}`);

  if (value && !isNaN(value as number)) {
    // Casting because we convert the value above
    return value as number;
  } else {
    // console.log(`Value ${originalValue} converted to unexpected ${value}`);
    return undefined;
  }
};
