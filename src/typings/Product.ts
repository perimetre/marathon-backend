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
  element: Product;
  metadata: {
    name: string;
  }[];
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
  childrenSortBy: string;
  classname: string;
  index: number;
  key: string;
  name: string;
  slug: string;
}

export interface SpCollection {
  id: string;
  childrenSortBy: string;
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
  childrenSortBy: string;
  classname: string;
  drawerTypeID: number;
  index: number;
  key: string;
  name: string;
  slug: string;
}

export interface SpFinish {
  id: string;
  childrenSortBy: string;
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
  | FeatureSelect
  | FeatureQuantityValue
  | FeatureMultiselect
  | FeatureBooleanSelect
  | FeatureInput
  | FeatureNumeric;

export type Product = {
  id: any;
  index: number;
  pimcoreId: string;
  partNumber: string;
  options: Product[];
  productPictures: Asset;
  bundlePath?: string;
  childrenSortBy: string;
  classname: string;
  creationDate: number;
  finishes: Finish[];
  hasPegs: boolean;
  isMat: boolean;
  isSubmodule: boolean;
  itemDescription: string;
  modificationDate: number;
  shortDescription: string;
  shouldHideBasedOnWidth: boolean;
  titleDescription: string;

  spCategories: SpCategories[];
  spCollection: SpCollection;
  spDrawerTypes: SpDrawerTypes[];
  spFinish: SpFinish;

  configuratorAttributes: {
    id: number;
    description: string;
    features: FeatureCompose[];
  }[];

  children: any;
};
