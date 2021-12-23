interface QuantityValue {
  value: number;
  unit: {
    id: 'mm' | 'in';
    abbreviation: 'mm' | 'in';
    longname: string;
  };
}

interface Feature {
  id: number;
  name: string;
  description?: string | null;
  type: string;
}

export interface FeatureBooleanSelect extends Feature {
  checked?: string | null;
}

export interface FeatureCalculatedValue extends Feature {
  calculatedvalue?: number | null;
}

export interface FeatureCheckbox extends Feature {
  checked?: boolean | null;
}

export interface FeatureCountry extends Feature {
  country?: string | null;
}

export interface FeatureCountryMultiselect extends Feature {
  countries?: string[] | null;
}

export interface FeatureDate extends Feature {
  date?: string | null;
}

export interface FeatureDateTime extends Feature {
  datetime?: string | null;
}

export interface FeatureInput extends Feature {
  text?: string | null;
}

export interface FeatureInputQuantityValue extends Feature {
  inputquantityvalue?: QuantityValue | null;
}

export interface FeatureLanguage extends Feature {
  language?: string | null;
}

export interface FeatureLangugeMultiselect extends Feature {
  languages?: string[] | null;
}

export interface FeatureMultiselect extends Feature {
  selections?: string[] | null;
}

export interface FeatureNumeric extends Feature {
  number?: number | null;
}

export interface FeatureRgbaColor extends Feature {
  color?: string | null;
}

export interface FeatureSelect extends Feature {
  selection?: string | null;
}

export interface FeatureSlider extends Feature {
  slidervalue?: string | null;
}

export interface FeatureTextarea extends Feature {
  text?: string | null;
}

export interface FeatureTime extends Feature {
  time?: string | null;
}

export interface FeatureQuantityValue extends Feature {
  quantityvalue?: QuantityValue | null;
}

export interface FeatureWysiwyg extends Feature {
  text?: string | null;
}

export interface Asset {
  id: string;
  filename: string;
  fullpath: string | null;
  modificationDate: number;
  type: string;
  fileSize: number;
}

export interface SpCategories {
  id: string;
  categoryID: number;
  classname: string;
  index: number;
  key: string;
  name: string;
  slug: string;
}

export interface SpCollection {
  id: string;
  classname: string;
  collectionID: number;
  description: string;
  image: Asset;
  hasPegs: boolean;
  index: number;
  key: string;
  name: string;
  slug: string;
  subtitle: string;
}

export interface SpDrawerTypes {
  id: string;
  classname: string;
  drawerTypeID: number;
  index: number;
  key: string;
  name: string;
  slug: string;
}

export interface SpFinish {
  id: string;
  classname: string;
  description: string;
  finishID: number;
  image: Asset;
  index: number;
  key: string;
  name: string;
  slug: string;
}

export type FeatureCompose =
  | FeatureBooleanSelect
  | FeatureCalculatedValue
  | FeatureCheckbox
  | FeatureCountry
  | FeatureCountryMultiselect
  | FeatureDate
  | FeatureDateTime
  | FeatureInput
  | FeatureInputQuantityValue
  | FeatureLanguage
  | FeatureLangugeMultiselect
  | FeatureMultiselect
  | FeatureNumeric
  | FeatureRgbaColor
  | FeatureSelect
  | FeatureSlider
  | FeatureTextarea
  | FeatureTime
  | FeatureQuantityValue
  | FeatureWysiwyg;

export type Product = {
  id: string;
  partNumber?: string | null;
  p21Uid?: string | null;
  bundlePath?: Asset | null;
  className: string;
  creationDate: number;
  hasPegs?: boolean | null;
  isMat?: boolean | null;
  isSubmodule?: boolean | null;
  itemDescription: string;
  shortDescription: string;
  shouldHideBasedOnWidth?: boolean | null;
  modificationDate: number;
  titleDescription: string;
  productPictures: Asset[];

  spCategories?: SpCategories[] | null;
  spCollection?: SpCollection | null;
  spDrawerTypes?: SpDrawerTypes[] | null;
  spFinish?: SpFinish | null;

  finishes?: {
    element: {
      id: string;
      partNumber: string;
    };
    metadata: {
      name: string;
    };
  } | null;

  options?: {
    id: string;
    partNumber: string;
  } | null;

  configuratorAttributes: {
    id: number;
    description: string;
    features: FeatureCompose[];
  }[];
};
