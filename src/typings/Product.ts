interface Feature {
  id: number;
  name?: string;
  description?: string;
  type?: string;
}

export interface FeatureSelect extends Feature {
  selection?: string;
}

export interface FeatureQuantityValue extends Feature {
  quantityvalue: {
    value: number;
    unit: {
      id: string;
    };
    toString: string;
  };
}

export interface FeatureMultiselect extends Feature {
  selections: string[];
}

export interface FeatureBooleanSelect extends Feature {
  checked: boolean;
}

export interface FeatureInput extends Feature {
  text: string | null;
}

export interface FeatureNumeric extends Feature {
  number: string | null;
}

export interface Finish {
  element: {
    id: string;
    partNumber: string;
  };
  metadata: {
    name: string;
  }[];
}

export interface Asset {
  id: string;
  filename: string;
  fullpath: string | null;
}

export type FeatureCompose =
  | FeatureSelect
  | FeatureQuantityValue
  | FeatureMultiselect
  | FeatureBooleanSelect
  | FeatureInput
  | FeatureNumeric;

export type Product = {
  pimcoreId: string;
  partNumber: string;
  finishes: Finish[];
  options: Product[];
  productPictures: Asset;
  configuratorAttributes: {
    id: number;
    description: string;
    features: FeatureCompose[];
  }[];
};
