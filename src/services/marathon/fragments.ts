import { gql } from '@apollo/client/core';

export const ASSET_FRAGMENT = gql`
  fragment Asset on asset {
    id
    creationDate
    fullpath
    mimetype
    modificationDate
    type
    filesize
    metadata {
      name
      type
      data
      language
    }
  }
`;

export const SP_CATEGORY_FRAGMENT = gql`
  fragment SpCategory on object_spCategory {
    id
    name
    slug
  }
`;

export const SP_COLLECTION_FRAGMENT = gql`
  fragment SpCollection on object_spCollection {
    id
    hasPegs
    slug
    subtitle
    description
    name
    isComingSoon
    image {
      ... on asset {
        id
        fullpath
      }
    }
  }
`;

export const SP_DRAWER_TYPE_FRAGMENT = gql`
  fragment SpDrawerType on object_spDrawerTypes {
    id
    name
    slug
    hasPegs
    # isComingSoon
    description
    image {
      ... on asset {
        id
        fullpath
      }
    }
  }
`;

export const SP_FINISH_FRAGMENT = gql`
  fragment SpFinish on object_spFinish {
    id
    description
    name
    slug
    isComingSoon
    image {
      ... on asset {
        id
        filename
        fullpath
      }
    }
  }
`;

export const CONFIGURATOR_ATTRIBUTES_FRAGMENT = gql`
  fragment ConfiguratorAttributes on csGroup {
    id
    description
    features {
      ... on csFeatureBooleanSelect {
        id
        name
        description
        type
        checked
      }
      ... on csFeatureCalculatedValue {
        id
        name
        description
        type
        calculatedvalue
      }
      ... on csFeatureCheckbox {
        id
        name
        description
        type
        checked
      }
      ... on csFeatureCountry {
        id
        name
        description
        type
        country
      }
      ... on csFeatureCountryMultiselect {
        id
        name
        description
        type
        countries
      }
      ... on csFeatureDate {
        id
        name
        description
        type
        date
      }
      ... on csFeatureDatetime {
        id
        name
        description
        type
        datetime
      }
      ... on csFeatureInput {
        id
        name
        description
        type
        text
      }
      ... on csFeatureInputQuantityValue {
        id
        name
        description
        type
        inputquantityvalue {
          value
          unit {
            id
            abbreviation
            longname
          }
        }
      }
      ... on csFeatureLanguage {
        id
        name
        description
        type
        language
      }
      ... on csFeatureLangugeMultiselect {
        id
        name
        description
        type
        languages
      }
      ... on csFeatureMultiselect {
        id
        name
        description
        type
        selections
      }
      ... on csFeatureNumeric {
        id
        name
        description
        type
        number
      }
      ... on csFeatureRgbaColor {
        id
        name
        description
        type
        color
      }
      ... on csFeatureSelect {
        id
        name
        description
        type
        selection
      }
      ... on csFeatureSlider {
        id
        name
        description
        type
        slidervalue
      }
      ... on csFeatureTextarea {
        id
        name
        description
        type
        text
      }
      ... on csFeatureTime {
        id
        name
        description
        type
        time
      }
      ... on csFeatureQuantityValue {
        id
        name
        description
        type
        quantityvalue {
          value
          unit {
            id
            abbreviation
            longname
          }
        }
      }
      ... on csFeatureWysiwyg {
        id
        name
        description
        type
        text
      }
    }
  }
`;

export const SP_PRODUCT_FRAGMENT = gql`
  fragment Product on object_product {
    id
    partNumber: itemId
    childrenSortBy
    classname
    creationDate
    hasPegs
    index
    isMat
    isSubmodule
    itemDescription
    modificationDate
    p21Uid
    shortDescription
    shouldHideBasedOnWidth
    titleDescription
    isEdge
    alwaysDisplay
    productPictures {
      ...Asset
    }
    properties {
      ... on property_checkbox {
        name
        type
        checked
      }
      ... on property_text {
        name
        type
        text
      }
      ... on property_object {
        name
        type
        object {
          ... on object_product {
            id
            itemId
          }
        }
      }
    }
    tags {
      id
      name
      path
    }
    spCategories {
      ...SpCategory
    }
    spCollection {
      ...SpCollection
    }
    spDrawerTypes {
      ...SpDrawerType
    }
    spFinish {
      ...SpFinish
    }
    bundlePath {
      ...Asset
    }
    finishes {
      element {
        id
        partNumber: itemId
      }
      metadata {
        name
      }
    }
    configuratorAttributes {
      ...ConfiguratorAttributes
    }
    options {
      ... on object_product {
        id
        partNumber: itemId
      }
    }
    children {
      ... on object_product {
        id
        partNumber: itemId
      }
    }
  }
  ${ASSET_FRAGMENT}
  ${SP_CATEGORY_FRAGMENT}
  ${SP_COLLECTION_FRAGMENT}
  ${SP_DRAWER_TYPE_FRAGMENT}
  ${SP_FINISH_FRAGMENT}
  ${CONFIGURATOR_ATTRIBUTES_FRAGMENT}
`;
