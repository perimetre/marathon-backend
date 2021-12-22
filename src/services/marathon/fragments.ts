export const SP_CATEGORY_FRAGMENT = `
  fragment SpCategory on object_spCategory {
    id
    slug
    classname
    index
    key
    name
    categoryID
    childrenSortBy
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
    name
    slug
  }
`;

export const SP_FINISH_FRAGMENT = `
  fragment SpFinish on object_spFinish {
    id
    name
    slug
    description
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

    classname
    childrenSortBy
    creationDate
    hasPegs
    isMat
    isSubmodule
    itemDescription
    modificationDate
    shortDescription
    shouldHideBasedOnWidth
    titleDescription

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
        ... on csFeatureQuantityValue {
          id
          name
          description
          type
          quantityvalue {
            value
            unit {
              id
            }
            toString
          }
        }
        ... on csFeatureSelect {
          id
          name
          description
          type
          selection
        }
        ... on csFeatureNumeric {
          id
          name
          description
          type
          number
        }
        ... on csFeatureBooleanSelect {
          id
          name
          description
          type
          checked
        }
        ... on csFeatureMultiselect {
          id
          name
          description
          type
          selections
        }
        ... on csFeatureInput {
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
