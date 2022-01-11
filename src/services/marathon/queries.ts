import { Product, SpCategories, SpCollection, SpDrawerTypes, SpFinish } from '../../typings/Product';
import {
  SP_CATEGORY_FRAGMENT,
  SP_COLLECTION_FRAGMENT,
  SP_DRAWER_TYPE_FRAGMENT,
  SP_FINISH_FRAGMENT,
  SP_PRODUCT_FRAGMENT
} from './fragments';

export type GetSpCategoryListingQuery = {
  data: { getSpCategoryListing: { edges: { node: SpCategories }[] } };
};
export const GET_SP_CATEGORY_LISTING = `
  query GetSpCategoryListing {
    getSpCategoryListing {
      edges {
        node {
          ...SpCategory
        }
      }
    }
  }
  ${SP_CATEGORY_FRAGMENT}
`;

export type GetSpCollectionListingQuery = {
  data: { getSpCollectionListing: { edges: { node: SpCollection }[] } };
};
export const GET_SP_COLLECTION_LISTING = `
  query GetSpCollectionListing {
    getSpCollectionListing {
      edges {
        node {
          ...SpCollection
        }
      }
    }
  }
  ${SP_COLLECTION_FRAGMENT}
`;

export type GetSpDrawerTypesListingQuery = {
  data: { getSpDrawerTypesListing: { edges: { node: SpDrawerTypes }[] } };
};
export const GET_SP_DRAWER_TYPES_LISTING = `
  query GetSpDrawerTypesListing {
    getSpDrawerTypesListing {
      edges {
        node {
          ...SpDrawerType
        }
      }
    }
  }
  ${SP_DRAWER_TYPE_FRAGMENT}
`;

export type GetSpFinishListingQuery = {
  data: { getSpFinishListing: { edges: { node: SpFinish }[] } };
};
export const GET_SP_FINISH_LISTING = `
  query GetSpFinishListing {
    getSpFinishListing {
      edges {
        node {
          ...SpFinish
        }
      }
    }
  }
  ${SP_FINISH_FRAGMENT}
`;

export type GetProductListingQuery = {
  data: { getProductListing: { edges: { node: Product }[] } };
};
export const GET_PRODUCT_LISTING = `
  query GetProductListing {
    getProductListing(published: true) {
      edges {
        node {
          ...Product
        }
      }
    }
  }
  ${SP_PRODUCT_FRAGMENT}
`;
