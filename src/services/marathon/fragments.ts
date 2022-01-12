export const SP_CATEGORY_FRAGMENT = `
  fragment SpCategory on object_spCategory {
    id
    categoryID
    classname
    index
    key
    name
    slug
  }
`;

export const SP_COLLECTION_FRAGMENT = `
  fragment SpCollection on object_spCollection {
    id
    slug
    subtitle
    description
    hasPegs
    key
    name
    image {
      ... on asset {
        id
        filename
        fullpath
      }
    }
  }
`;

export const SP_DRAWER_TYPE_FRAGMENT = `
  fragment SpDrawerType on object_spDrawerTypes {
    id
    drawerTypeID
    classname
    index
    key
    name
    slugerTypeID
    classname
    index
    key
    name
    slug
  }
`;

export const SP_FINISH_FRAGMENT = `
  fragment SpFinish on object_spFinish {
    id
    finishID
    classname
    description
    index
    key
    name
    slug
    image {
      ... on asset {
        id
        filename
        fullpath
      }
    }
  }
`;

export const SP_PRODUCT_FRAGMENT = `
  fragment Product on object_product {
    id
    partNumber: itemId
    p21Uid
    bundlePath {
      ... on asset {
        id
        filename
        fullpath
      }
    }
    classname
    creationDate
    hasPegs
    isMat
    isSubmodule
    itemDescription
    shortDescription
    shouldHideBasedOnWidth
    modificationDate
    titleDescription
    productPictures {
      ... on asset {
        id
        filename
        fullpath
      }
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
    finishes {
      element {
        id
        partNumber: itemId
      }
      metadata {
        name
      }
    }
    options {
      ... on object_product {
        id
        partNumber: itemId
      }
    }
    configuratorAttributes {
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
  }
  ${SP_CATEGORY_FRAGMENT}
  ${SP_COLLECTION_FRAGMENT}
  ${SP_DRAWER_TYPE_FRAGMENT}
  ${SP_FINISH_FRAGMENT}
`;
