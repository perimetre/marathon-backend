import { gql } from '@apollo/client/core';

import {
  SP_CATEGORY_FRAGMENT,
  SP_COLLECTION_FRAGMENT,
  SP_DRAWER_TYPE_FRAGMENT,
  SP_FINISH_FRAGMENT,
  SP_PRODUCT_FRAGMENT
} from './fragments';

export const GET_SP_CATEGORY_LISTING = gql`
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

export const GET_SP_CATEGORY_STATUS = gql`
  query GetSpCategoryStatus {
    getSpCategoryListing(first: 5) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const GET_SP_COLLECTION_LISTING = gql`
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

export const GET_SP_COLLECTION_STATUS = gql`
  query GetSpCollectionStatus {
    getSpCollectionListing(first: 5) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const GET_SP_DRAWER_TYPES_LISTING = gql`
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

export const GET_SP_DRAWER_TYPES_STATUS = gql`
  query GetSpDrawerTypesStatus {
    getSpDrawerTypesListing(first: 5) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const GET_SP_FINISH_LISTING = gql`
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

export const GET_SP_FINISH_STATUS = gql`
  query GetSpFinishStatus {
    getSpFinishListing(first: 5) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const GET_PRODUCT_LISTING = gql`
  query GetProductListing($first: Int, $after: Int, $filter: String) {
    getProductListing(published: true, first: $first, after: $after, filter: $filter) {
      edges {
        node {
          ...Product
        }
      }
    }
  }
  ${SP_PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_STATUS = gql`
  query GetProductStatus {
    getProductListing(published: true, first: 5) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: Int) {
    getProduct(id: $id) {
      ...Product
    }
  }
  ${SP_PRODUCT_FRAGMENT}
`;
