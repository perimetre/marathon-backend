export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ElementProperty = Property_Checkbox | Property_Object | Property_Text;

export type InputQuantityValue = {
  __typename?: 'InputQuantityValue';
  toString?: Maybe<Scalars['String']>;
  unit?: Maybe<QuantityValueUnit>;
  value?: Maybe<Scalars['String']>;
};


export type InputQuantityValueToStringArgs = {
  language?: InputMaybe<Scalars['String']>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges?: Maybe<Array<Maybe<ProductEdge>>>;
  /** The total count of all queryable objects for this schema listing */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Object_Product>;
};

export type QuantityValue = {
  __typename?: 'QuantityValue';
  toString?: Maybe<Scalars['String']>;
  unit?: Maybe<QuantityValueUnit>;
  value?: Maybe<Scalars['Float']>;
};


export type QuantityValueToStringArgs = {
  language?: InputMaybe<Scalars['String']>;
};

export type QuantityValueUnit = {
  __typename?: 'QuantityValueUnit';
  abbreviation?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  longname?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getProduct?: Maybe<Object_Product>;
  getProductListing?: Maybe<ProductConnection>;
  getSpCategory?: Maybe<Object_SpCategory>;
  getSpCategoryListing?: Maybe<SpCategoryConnection>;
  getSpCollection?: Maybe<Object_SpCollection>;
  getSpCollectionListing?: Maybe<SpCollectionConnection>;
  getSpDrawerTypes?: Maybe<Object_SpDrawerTypes>;
  getSpDrawerTypesListing?: Maybe<SpDrawerTypesConnection>;
  getSpFinish?: Maybe<Object_SpFinish>;
  getSpFinishListing?: Maybe<SpFinishConnection>;
};


export type QueryGetProductArgs = {
  defaultLanguage?: InputMaybe<Scalars['String']>;
  fullpath?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryGetProductListingArgs = {
  after?: InputMaybe<Scalars['Int']>;
  defaultLanguage?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fullpaths?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sortOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetSpCategoryArgs = {
  defaultLanguage?: InputMaybe<Scalars['String']>;
  fullpath?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSpCategoryListingArgs = {
  after?: InputMaybe<Scalars['Int']>;
  defaultLanguage?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fullpaths?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sortOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetSpCollectionArgs = {
  defaultLanguage?: InputMaybe<Scalars['String']>;
  fullpath?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSpCollectionListingArgs = {
  after?: InputMaybe<Scalars['Int']>;
  defaultLanguage?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fullpaths?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sortOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetSpDrawerTypesArgs = {
  defaultLanguage?: InputMaybe<Scalars['String']>;
  fullpath?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSpDrawerTypesListingArgs = {
  after?: InputMaybe<Scalars['Int']>;
  defaultLanguage?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fullpaths?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sortOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetSpFinishArgs = {
  defaultLanguage?: InputMaybe<Scalars['String']>;
  fullpath?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSpFinishListingArgs = {
  after?: InputMaybe<Scalars['Int']>;
  defaultLanguage?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  fullpaths?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sortOrder?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type SpCategoryConnection = {
  __typename?: 'SpCategoryConnection';
  edges?: Maybe<Array<Maybe<SpCategoryEdge>>>;
  /** The total count of all queryable objects for this schema listing */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SpCategoryEdge = {
  __typename?: 'SpCategoryEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Object_SpCategory>;
};

export type SpCollectionConnection = {
  __typename?: 'SpCollectionConnection';
  edges?: Maybe<Array<Maybe<SpCollectionEdge>>>;
  /** The total count of all queryable objects for this schema listing */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SpCollectionEdge = {
  __typename?: 'SpCollectionEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Object_SpCollection>;
};

export type SpDrawerTypesConnection = {
  __typename?: 'SpDrawerTypesConnection';
  edges?: Maybe<Array<Maybe<SpDrawerTypesEdge>>>;
  /** The total count of all queryable objects for this schema listing */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SpDrawerTypesEdge = {
  __typename?: 'SpDrawerTypesEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Object_SpDrawerTypes>;
};

export type SpFinishConnection = {
  __typename?: 'SpFinishConnection';
  edges?: Maybe<Array<Maybe<SpFinishEdge>>>;
  /** The total count of all queryable objects for this schema listing */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SpFinishEdge = {
  __typename?: 'SpFinishEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Object_SpFinish>;
};

export type Asset = {
  __typename?: 'asset';
  _siblings?: Maybe<Array<Maybe<Asset_Tree>>>;
  children?: Maybe<Array<Maybe<Asset_Tree>>>;
  creationDate?: Maybe<Scalars['Int']>;
  data?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  filesize?: Maybe<Scalars['Int']>;
  fullpath?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  metadata?: Maybe<Array<Maybe<Asset_Metadata_Item>>>;
  mimetype?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  parent?: Maybe<Asset_Tree>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  resolutions?: Maybe<Array<Maybe<Resolutions>>>;
  srcset?: Maybe<Array<Maybe<Srcset>>>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
  type?: Maybe<Scalars['String']>;
};


export type AssetDataArgs = {
  thumbnail?: InputMaybe<Scalars['String']>;
};


export type AssetFullpathArgs = {
  thumbnail?: InputMaybe<Scalars['String']>;
};


export type AssetMetadataArgs = {
  ignore_language?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
};


export type AssetPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type AssetResolutionsArgs = {
  thumbnail: Scalars['String'];
  types?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};


export type AssetSrcsetArgs = {
  thumbnail: Scalars['String'];
};


export type AssetTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

export type Asset_Folder = {
  __typename?: 'asset_folder';
  _siblings?: Maybe<Array<Maybe<Asset_Tree>>>;
  children?: Maybe<Array<Maybe<Asset_Tree>>>;
  creationDate?: Maybe<Scalars['Int']>;
  filename?: Maybe<Scalars['String']>;
  fullpath?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  modificationDateDate?: Maybe<Scalars['Int']>;
  parent?: Maybe<Asset_Folder>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
};


export type Asset_FolderFullpathArgs = {
  thumbnail?: InputMaybe<Scalars['String']>;
};


export type Asset_FolderPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Asset_Metadata_Item = {
  __typename?: 'asset_metadata_item';
  data?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Asset_Tree = Asset | Asset_Folder;

export type CsFeature = CsFeatureBooleanSelect | CsFeatureCalculatedValue | CsFeatureCheckbox | CsFeatureCountry | CsFeatureCountryMultiselect | CsFeatureDate | CsFeatureDatetime | CsFeatureInput | CsFeatureInputQuantityValue | CsFeatureLanguage | CsFeatureLangugeMultiselect | CsFeatureMultiselect | CsFeatureNumeric | CsFeatureQuantityValue | CsFeatureRgbaColor | CsFeatureSelect | CsFeatureSlider | CsFeatureTextarea | CsFeatureTime | CsFeatureWysiwyg;

export type CsFeatureBooleanSelect = CsFeatureInterface & {
  __typename?: 'csFeatureBooleanSelect';
  checked?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureCalculatedValue = CsFeatureInterface & {
  __typename?: 'csFeatureCalculatedValue';
  calculatedvalue?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureCheckbox = CsFeatureInterface & {
  __typename?: 'csFeatureCheckbox';
  checked?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureCountry = CsFeatureInterface & {
  __typename?: 'csFeatureCountry';
  country?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureCountryMultiselect = CsFeatureInterface & {
  __typename?: 'csFeatureCountryMultiselect';
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureDate = CsFeatureInterface & {
  __typename?: 'csFeatureDate';
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type CsFeatureDateDateArgs = {
  format?: InputMaybe<Scalars['String']>;
};

export type CsFeatureDatetime = CsFeatureInterface & {
  __typename?: 'csFeatureDatetime';
  datetime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureInput = CsFeatureInterface & {
  __typename?: 'csFeatureInput';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureInputQuantityValue = CsFeatureInterface & {
  __typename?: 'csFeatureInputQuantityValue';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  inputquantityvalue?: Maybe<InputQuantityValue>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureInterface = {
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureLanguage = CsFeatureInterface & {
  __typename?: 'csFeatureLanguage';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  language?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureLangugeMultiselect = CsFeatureInterface & {
  __typename?: 'csFeatureLangugeMultiselect';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureMultiselect = CsFeatureInterface & {
  __typename?: 'csFeatureMultiselect';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  selections?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureNumeric = CsFeatureInterface & {
  __typename?: 'csFeatureNumeric';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureQuantityValue = CsFeatureInterface & {
  __typename?: 'csFeatureQuantityValue';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  quantityvalue?: Maybe<QuantityValue>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureRgbaColor = CsFeatureInterface & {
  __typename?: 'csFeatureRgbaColor';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureSelect = CsFeatureInterface & {
  __typename?: 'csFeatureSelect';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  selection?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureSlider = CsFeatureInterface & {
  __typename?: 'csFeatureSlider';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  slidervalue?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureTextarea = CsFeatureInterface & {
  __typename?: 'csFeatureTextarea';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureTime = CsFeatureInterface & {
  __typename?: 'csFeatureTime';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsFeatureWysiwyg = CsFeatureInterface & {
  __typename?: 'csFeatureWysiwyg';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CsGroup = {
  __typename?: 'csGroup';
  description?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<CsFeature>>>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type Element = {
  id?: Maybe<Scalars['ID']>;
};

export type Element_Metadata_Item_6202bfdc40cd6 = {
  __typename?: 'element_metadata_item_6202bfdc40cd6';
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Element_Tag = {
  __typename?: 'element_tag';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

export type Hotspot_Metadata_Object = Object_Product | Object_SpCategory | Object_SpCollection | Object_SpDrawerTypes | Object_SpFinish;

export type Object_Product = Element & {
  __typename?: 'object_product';
  _siblings?: Maybe<Array<Maybe<Object_Tree>>>;
  bundlePath?: Maybe<Object_Product_BundlePath>;
  children?: Maybe<Array<Maybe<Object_Tree>>>;
  childrenSortBy?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  /** returns a list of group containers */
  configuratorAttributes?: Maybe<Array<Maybe<CsGroup>>>;
  creationDate?: Maybe<Scalars['Int']>;
  finishes?: Maybe<Array<Maybe<Object_Product_Finishes>>>;
  hasPegs?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  index?: Maybe<Scalars['Int']>;
  isMat?: Maybe<Scalars['Boolean']>;
  isSubmodule?: Maybe<Scalars['Boolean']>;
  itemDescription?: Maybe<Scalars['String']>;
  itemId?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  options?: Maybe<Array<Maybe<Object_Product_Options>>>;
  p21Uid?: Maybe<Scalars['String']>;
  parent?: Maybe<Object_Tree>;
  productPictures?: Maybe<Array<Maybe<Object_Product_ProductPictures>>>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  shortDescription?: Maybe<Scalars['String']>;
  shouldHideBasedOnWidth?: Maybe<Scalars['Boolean']>;
  spCategories?: Maybe<Array<Maybe<Object_Product_SpCategories>>>;
  spCollection?: Maybe<Object_Product_SpCollection>;
  spDrawerTypes?: Maybe<Array<Maybe<Object_Product_SpDrawerTypes>>>;
  spFinish?: Maybe<Object_Product_SpFinish>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
  titleDescription?: Maybe<Scalars['String']>;
};


export type Object_Product_SiblingsArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_ProductChildrenArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_ProductConfiguratorAttributesArgs = {
  language?: InputMaybe<Scalars['String']>;
};


export type Object_ProductPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_ProductTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

/** pseudo class for field bundlePath */
export type Object_Product_BundlePath = Asset;

export type Object_Product_Finishes = {
  __typename?: 'object_product_finishes';
  element?: Maybe<Object_Product>;
  metadata?: Maybe<Array<Maybe<Element_Metadata_Item_6202bfdc40cd6>>>;
};

export type Object_Product_Options = Object_Product;

export type Object_Product_ProductPictures = Asset;

export type Object_Product_SpCategories = Object_SpCategory;

/** pseudo class for field spCollection */
export type Object_Product_SpCollection = Object_SpCollection;

export type Object_Product_SpDrawerTypes = Object_SpDrawerTypes;

/** pseudo class for field spFinish */
export type Object_Product_SpFinish = Object_SpFinish;

export type Object_SpCategory = Element & {
  __typename?: 'object_spCategory';
  _siblings?: Maybe<Array<Maybe<Object_Tree>>>;
  categoryID?: Maybe<Scalars['Int']>;
  children?: Maybe<Array<Maybe<Object_Tree>>>;
  childrenSortBy?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  index?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Object_Tree>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
};


export type Object_SpCategory_SiblingsArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCategoryChildrenArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCategoryPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCategoryTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

export type Object_SpCollection = Element & {
  __typename?: 'object_spCollection';
  _siblings?: Maybe<Array<Maybe<Object_Tree>>>;
  children?: Maybe<Array<Maybe<Object_Tree>>>;
  childrenSortBy?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  collectionID?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  hasPegs?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Object_SpCollection_Image>;
  index?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Object_Tree>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  slug?: Maybe<Scalars['String']>;
  subtitle?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
};


export type Object_SpCollection_SiblingsArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCollectionChildrenArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCollectionPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpCollectionTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

/** pseudo class for field image */
export type Object_SpCollection_Image = Asset;

export type Object_SpDrawerTypes = Element & {
  __typename?: 'object_spDrawerTypes';
  _siblings?: Maybe<Array<Maybe<Object_Tree>>>;
  children?: Maybe<Array<Maybe<Object_Tree>>>;
  childrenSortBy?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  drawerTypeID?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  index?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Object_Tree>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
};


export type Object_SpDrawerTypes_SiblingsArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpDrawerTypesChildrenArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpDrawerTypesPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpDrawerTypesTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

export type Object_SpFinish = Element & {
  __typename?: 'object_spFinish';
  _siblings?: Maybe<Array<Maybe<Object_Tree>>>;
  children?: Maybe<Array<Maybe<Object_Tree>>>;
  childrenSortBy?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  finishID?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Object_SpFinish_Image>;
  index?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  modificationDate?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Object_Tree>;
  properties?: Maybe<Array<Maybe<ElementProperty>>>;
  slug?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Element_Tag>>>;
};


export type Object_SpFinish_SiblingsArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpFinishChildrenArgs = {
  objectTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpFinishPropertiesArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type Object_SpFinishTagsArgs = {
  name?: InputMaybe<Scalars['String']>;
};

/** pseudo class for field image */
export type Object_SpFinish_Image = Asset;

export type Object_Tree = Object_Product | Object_SpCategory | Object_SpCollection | Object_SpDrawerTypes | Object_SpFinish;

export type Property_Checkbox = {
  __typename?: 'property_checkbox';
  checked?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Property_Object = {
  __typename?: 'property_object';
  name?: Maybe<Scalars['String']>;
  object?: Maybe<Hotspot_Metadata_Object>;
  type?: Maybe<Scalars['String']>;
};

export type Property_Text = {
  __typename?: 'property_text';
  name?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Resolutions = {
  __typename?: 'resolutions';
  resolution?: Maybe<Scalars['Float']>;
  url?: Maybe<Scalars['String']>;
};

export type Srcset = {
  __typename?: 'srcset';
  descriptor?: Maybe<Scalars['String']>;
  resolutions?: Maybe<Array<Maybe<Resolutions>>>;
  url?: Maybe<Scalars['String']>;
};


export type SrcsetResolutionsArgs = {
  types?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type AssetFragment = { __typename?: 'asset', id?: string | null, creationDate?: number | null, fullpath?: string | null, mimetype?: string | null, modificationDate?: number | null, type?: string | null, filesize?: number | null, metadata?: Array<{ __typename?: 'asset_metadata_item', name?: string | null, type?: string | null, data?: string | null, language?: string | null } | null> | null };

export type SpCategoryFragment = { __typename?: 'object_spCategory', id?: string | null, name?: string | null, slug?: string | null };

export type SpCollectionFragment = { __typename?: 'object_spCollection', id?: string | null, hasPegs?: boolean | null, slug?: string | null, subtitle?: string | null, description?: string | null, name?: string | null, image?: { __typename?: 'asset', id?: string | null, fullpath?: string | null } | null };

export type SpDrawerTypeFragment = { __typename?: 'object_spDrawerTypes', id?: string | null, name?: string | null, slug?: string | null };

export type SpFinishFragment = { __typename?: 'object_spFinish', id?: string | null, description?: string | null, name?: string | null, slug?: string | null, image?: { __typename?: 'asset', id?: string | null, filename?: string | null, fullpath?: string | null } | null };

export type ConfiguratorAttributesFragment = { __typename?: 'csGroup', id?: number | null, description?: string | null, features?: Array<{ __typename?: 'csFeatureBooleanSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCalculatedValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, calculatedvalue?: string | null } | { __typename?: 'csFeatureCheckbox', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCountry', id?: number | null, name?: string | null, description?: string | null, type?: string | null, country?: string | null } | { __typename?: 'csFeatureCountryMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, countries?: Array<string | null> | null } | { __typename?: 'csFeatureDate', id?: number | null, name?: string | null, description?: string | null, type?: string | null, date?: string | null } | { __typename?: 'csFeatureDatetime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, datetime?: string | null } | { __typename?: 'csFeatureInput', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureInputQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, inputquantityvalue?: { __typename?: 'InputQuantityValue', value?: string | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureLanguage', id?: number | null, name?: string | null, description?: string | null, type?: string | null, language?: string | null } | { __typename?: 'csFeatureLangugeMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, languages?: Array<string | null> | null } | { __typename?: 'csFeatureMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selections?: Array<string | null> | null } | { __typename?: 'csFeatureNumeric', id?: number | null, name?: string | null, description?: string | null, type?: string | null, number?: string | null } | { __typename?: 'csFeatureQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, quantityvalue?: { __typename?: 'QuantityValue', value?: number | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureRgbaColor', id?: number | null, name?: string | null, description?: string | null, type?: string | null, color?: string | null } | { __typename?: 'csFeatureSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selection?: string | null } | { __typename?: 'csFeatureSlider', id?: number | null, name?: string | null, description?: string | null, type?: string | null, slidervalue?: string | null } | { __typename?: 'csFeatureTextarea', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureTime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, time?: string | null } | { __typename?: 'csFeatureWysiwyg', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | null> | null };

export type ProductFragment = { __typename?: 'object_product', id?: string | null, childrenSortBy?: string | null, classname?: string | null, creationDate?: number | null, hasPegs?: boolean | null, index?: number | null, isMat?: boolean | null, isSubmodule?: boolean | null, itemDescription?: string | null, modificationDate?: number | null, p21Uid?: string | null, shortDescription?: string | null, shouldHideBasedOnWidth?: boolean | null, titleDescription?: string | null, partNumber?: string | null, productPictures?: Array<{ __typename?: 'asset', id?: string | null, creationDate?: number | null, fullpath?: string | null, mimetype?: string | null, modificationDate?: number | null, type?: string | null, filesize?: number | null, metadata?: Array<{ __typename?: 'asset_metadata_item', name?: string | null, type?: string | null, data?: string | null, language?: string | null } | null> | null } | null> | null, properties?: Array<{ __typename?: 'property_checkbox', name?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'property_object', name?: string | null, type?: string | null, object?: { __typename?: 'object_product', id?: string | null, itemId?: string | null } | { __typename?: 'object_spCategory' } | { __typename?: 'object_spCollection' } | { __typename?: 'object_spDrawerTypes' } | { __typename?: 'object_spFinish' } | null } | { __typename?: 'property_text', name?: string | null, type?: string | null, text?: string | null } | null> | null, tags?: Array<{ __typename?: 'element_tag', id?: string | null, name?: string | null, path?: string | null } | null> | null, spCategories?: Array<{ __typename?: 'object_spCategory', id?: string | null, name?: string | null, slug?: string | null } | null> | null, spCollection?: { __typename?: 'object_spCollection', id?: string | null, hasPegs?: boolean | null, slug?: string | null, subtitle?: string | null, description?: string | null, name?: string | null, image?: { __typename?: 'asset', id?: string | null, fullpath?: string | null } | null } | null, spDrawerTypes?: Array<{ __typename?: 'object_spDrawerTypes', id?: string | null, name?: string | null, slug?: string | null } | null> | null, spFinish?: { __typename?: 'object_spFinish', id?: string | null, description?: string | null, name?: string | null, slug?: string | null, image?: { __typename?: 'asset', id?: string | null, filename?: string | null, fullpath?: string | null } | null } | null, bundlePath?: { __typename?: 'asset', id?: string | null, creationDate?: number | null, fullpath?: string | null, mimetype?: string | null, modificationDate?: number | null, type?: string | null, filesize?: number | null, metadata?: Array<{ __typename?: 'asset_metadata_item', name?: string | null, type?: string | null, data?: string | null, language?: string | null } | null> | null } | null, finishes?: Array<{ __typename?: 'object_product_finishes', element?: { __typename?: 'object_product', id?: string | null, partNumber?: string | null } | null, metadata?: Array<{ __typename?: 'element_metadata_item_6202bfdc40cd6', name?: string | null } | null> | null } | null> | null, configuratorAttributes?: Array<{ __typename?: 'csGroup', id?: number | null, description?: string | null, features?: Array<{ __typename?: 'csFeatureBooleanSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCalculatedValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, calculatedvalue?: string | null } | { __typename?: 'csFeatureCheckbox', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCountry', id?: number | null, name?: string | null, description?: string | null, type?: string | null, country?: string | null } | { __typename?: 'csFeatureCountryMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, countries?: Array<string | null> | null } | { __typename?: 'csFeatureDate', id?: number | null, name?: string | null, description?: string | null, type?: string | null, date?: string | null } | { __typename?: 'csFeatureDatetime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, datetime?: string | null } | { __typename?: 'csFeatureInput', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureInputQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, inputquantityvalue?: { __typename?: 'InputQuantityValue', value?: string | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureLanguage', id?: number | null, name?: string | null, description?: string | null, type?: string | null, language?: string | null } | { __typename?: 'csFeatureLangugeMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, languages?: Array<string | null> | null } | { __typename?: 'csFeatureMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selections?: Array<string | null> | null } | { __typename?: 'csFeatureNumeric', id?: number | null, name?: string | null, description?: string | null, type?: string | null, number?: string | null } | { __typename?: 'csFeatureQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, quantityvalue?: { __typename?: 'QuantityValue', value?: number | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureRgbaColor', id?: number | null, name?: string | null, description?: string | null, type?: string | null, color?: string | null } | { __typename?: 'csFeatureSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selection?: string | null } | { __typename?: 'csFeatureSlider', id?: number | null, name?: string | null, description?: string | null, type?: string | null, slidervalue?: string | null } | { __typename?: 'csFeatureTextarea', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureTime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, time?: string | null } | { __typename?: 'csFeatureWysiwyg', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | null> | null } | null> | null, options?: Array<{ __typename?: 'object_product', id?: string | null, partNumber?: string | null } | null> | null, children?: Array<{ __typename?: 'object_product', id?: string | null, partNumber?: string | null } | { __typename?: 'object_spCategory' } | { __typename?: 'object_spCollection' } | { __typename?: 'object_spDrawerTypes' } | { __typename?: 'object_spFinish' } | null> | null };

export type GetSpCategoryListingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpCategoryListingQuery = { __typename?: 'Query', getSpCategoryListing?: { __typename?: 'SpCategoryConnection', edges?: Array<{ __typename?: 'SpCategoryEdge', node?: { __typename?: 'object_spCategory', id?: string | null, name?: string | null, slug?: string | null } | null } | null> | null } | null };

export type GetSpCategoryStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpCategoryStatusQuery = { __typename?: 'Query', getSpCategoryListing?: { __typename?: 'SpCategoryConnection', edges?: Array<{ __typename?: 'SpCategoryEdge', node?: { __typename?: 'object_spCategory', id?: string | null } | null } | null> | null } | null };

export type GetSpCollectionListingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpCollectionListingQuery = { __typename?: 'Query', getSpCollectionListing?: { __typename?: 'SpCollectionConnection', edges?: Array<{ __typename?: 'SpCollectionEdge', node?: { __typename?: 'object_spCollection', id?: string | null, hasPegs?: boolean | null, slug?: string | null, subtitle?: string | null, description?: string | null, name?: string | null, image?: { __typename?: 'asset', id?: string | null, fullpath?: string | null } | null } | null } | null> | null } | null };

export type GetSpCollectionStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpCollectionStatusQuery = { __typename?: 'Query', getSpCollectionListing?: { __typename?: 'SpCollectionConnection', edges?: Array<{ __typename?: 'SpCollectionEdge', node?: { __typename?: 'object_spCollection', id?: string | null } | null } | null> | null } | null };

export type GetSpDrawerTypesListingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpDrawerTypesListingQuery = { __typename?: 'Query', getSpDrawerTypesListing?: { __typename?: 'SpDrawerTypesConnection', edges?: Array<{ __typename?: 'SpDrawerTypesEdge', node?: { __typename?: 'object_spDrawerTypes', id?: string | null, name?: string | null, slug?: string | null } | null } | null> | null } | null };

export type GetSpDrawerTypesStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpDrawerTypesStatusQuery = { __typename?: 'Query', getSpDrawerTypesListing?: { __typename?: 'SpDrawerTypesConnection', edges?: Array<{ __typename?: 'SpDrawerTypesEdge', node?: { __typename?: 'object_spDrawerTypes', id?: string | null } | null } | null> | null } | null };

export type GetSpFinishListingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpFinishListingQuery = { __typename?: 'Query', getSpFinishListing?: { __typename?: 'SpFinishConnection', edges?: Array<{ __typename?: 'SpFinishEdge', node?: { __typename?: 'object_spFinish', id?: string | null, description?: string | null, name?: string | null, slug?: string | null, image?: { __typename?: 'asset', id?: string | null, filename?: string | null, fullpath?: string | null } | null } | null } | null> | null } | null };

export type GetSpFinishStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpFinishStatusQuery = { __typename?: 'Query', getSpFinishListing?: { __typename?: 'SpFinishConnection', edges?: Array<{ __typename?: 'SpFinishEdge', node?: { __typename?: 'object_spFinish', id?: string | null } | null } | null> | null } | null };

export type GetProductListingQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['Int']>;
}>;


export type GetProductListingQuery = { __typename?: 'Query', getProductListing?: { __typename?: 'ProductConnection', edges?: Array<{ __typename?: 'ProductEdge', node?: { __typename?: 'object_product', id?: string | null, childrenSortBy?: string | null, classname?: string | null, creationDate?: number | null, hasPegs?: boolean | null, index?: number | null, isMat?: boolean | null, isSubmodule?: boolean | null, itemDescription?: string | null, modificationDate?: number | null, p21Uid?: string | null, shortDescription?: string | null, shouldHideBasedOnWidth?: boolean | null, titleDescription?: string | null, partNumber?: string | null, productPictures?: Array<{ __typename?: 'asset', id?: string | null, creationDate?: number | null, fullpath?: string | null, mimetype?: string | null, modificationDate?: number | null, type?: string | null, filesize?: number | null, metadata?: Array<{ __typename?: 'asset_metadata_item', name?: string | null, type?: string | null, data?: string | null, language?: string | null } | null> | null } | null> | null, properties?: Array<{ __typename?: 'property_checkbox', name?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'property_object', name?: string | null, type?: string | null, object?: { __typename?: 'object_product', id?: string | null, itemId?: string | null } | { __typename?: 'object_spCategory' } | { __typename?: 'object_spCollection' } | { __typename?: 'object_spDrawerTypes' } | { __typename?: 'object_spFinish' } | null } | { __typename?: 'property_text', name?: string | null, type?: string | null, text?: string | null } | null> | null, tags?: Array<{ __typename?: 'element_tag', id?: string | null, name?: string | null, path?: string | null } | null> | null, spCategories?: Array<{ __typename?: 'object_spCategory', id?: string | null, name?: string | null, slug?: string | null } | null> | null, spCollection?: { __typename?: 'object_spCollection', id?: string | null, hasPegs?: boolean | null, slug?: string | null, subtitle?: string | null, description?: string | null, name?: string | null, image?: { __typename?: 'asset', id?: string | null, fullpath?: string | null } | null } | null, spDrawerTypes?: Array<{ __typename?: 'object_spDrawerTypes', id?: string | null, name?: string | null, slug?: string | null } | null> | null, spFinish?: { __typename?: 'object_spFinish', id?: string | null, description?: string | null, name?: string | null, slug?: string | null, image?: { __typename?: 'asset', id?: string | null, filename?: string | null, fullpath?: string | null } | null } | null, bundlePath?: { __typename?: 'asset', id?: string | null, creationDate?: number | null, fullpath?: string | null, mimetype?: string | null, modificationDate?: number | null, type?: string | null, filesize?: number | null, metadata?: Array<{ __typename?: 'asset_metadata_item', name?: string | null, type?: string | null, data?: string | null, language?: string | null } | null> | null } | null, finishes?: Array<{ __typename?: 'object_product_finishes', element?: { __typename?: 'object_product', id?: string | null, partNumber?: string | null } | null, metadata?: Array<{ __typename?: 'element_metadata_item_6202bfdc40cd6', name?: string | null } | null> | null } | null> | null, configuratorAttributes?: Array<{ __typename?: 'csGroup', id?: number | null, description?: string | null, features?: Array<{ __typename?: 'csFeatureBooleanSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCalculatedValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, calculatedvalue?: string | null } | { __typename?: 'csFeatureCheckbox', id?: number | null, name?: string | null, description?: string | null, type?: string | null, checked?: boolean | null } | { __typename?: 'csFeatureCountry', id?: number | null, name?: string | null, description?: string | null, type?: string | null, country?: string | null } | { __typename?: 'csFeatureCountryMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, countries?: Array<string | null> | null } | { __typename?: 'csFeatureDate', id?: number | null, name?: string | null, description?: string | null, type?: string | null, date?: string | null } | { __typename?: 'csFeatureDatetime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, datetime?: string | null } | { __typename?: 'csFeatureInput', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureInputQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, inputquantityvalue?: { __typename?: 'InputQuantityValue', value?: string | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureLanguage', id?: number | null, name?: string | null, description?: string | null, type?: string | null, language?: string | null } | { __typename?: 'csFeatureLangugeMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, languages?: Array<string | null> | null } | { __typename?: 'csFeatureMultiselect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selections?: Array<string | null> | null } | { __typename?: 'csFeatureNumeric', id?: number | null, name?: string | null, description?: string | null, type?: string | null, number?: string | null } | { __typename?: 'csFeatureQuantityValue', id?: number | null, name?: string | null, description?: string | null, type?: string | null, quantityvalue?: { __typename?: 'QuantityValue', value?: number | null, unit?: { __typename?: 'QuantityValueUnit', id?: string | null, abbreviation?: string | null, longname?: string | null } | null } | null } | { __typename?: 'csFeatureRgbaColor', id?: number | null, name?: string | null, description?: string | null, type?: string | null, color?: string | null } | { __typename?: 'csFeatureSelect', id?: number | null, name?: string | null, description?: string | null, type?: string | null, selection?: string | null } | { __typename?: 'csFeatureSlider', id?: number | null, name?: string | null, description?: string | null, type?: string | null, slidervalue?: string | null } | { __typename?: 'csFeatureTextarea', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | { __typename?: 'csFeatureTime', id?: number | null, name?: string | null, description?: string | null, type?: string | null, time?: string | null } | { __typename?: 'csFeatureWysiwyg', id?: number | null, name?: string | null, description?: string | null, type?: string | null, text?: string | null } | null> | null } | null> | null, options?: Array<{ __typename?: 'object_product', id?: string | null, partNumber?: string | null } | null> | null, children?: Array<{ __typename?: 'object_product', id?: string | null, partNumber?: string | null } | { __typename?: 'object_spCategory' } | { __typename?: 'object_spCollection' } | { __typename?: 'object_spDrawerTypes' } | { __typename?: 'object_spFinish' } | null> | null } | null } | null> | null } | null };

export type GetProductStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductStatusQuery = { __typename?: 'Query', getProductListing?: { __typename?: 'ProductConnection', edges?: Array<{ __typename?: 'ProductEdge', node?: { __typename?: 'object_product', id?: string | null } | null } | null> | null } | null };
