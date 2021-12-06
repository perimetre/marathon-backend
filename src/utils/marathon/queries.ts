import { Product } from '../../typings/Product';

export type GetProductListingQuery = {
  data: { getProductListing: { edges: { node: Product }[] } };
};

// {"where":{"partNumber":{"in":["04-AREA-CT-GM-D"]}}}

export const GET_PRODUCT_LISTING = `
  query GetProductListing {
    getProductListing(published: true, filter: "{\\"itemId\\":{\\"$like\\":\\"04-AU-WAL-CD-B\\"}}") {
      edges {
        node {
          pimcoreId: id
          partNumber: itemId
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
              __typename
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
      }
    }
  }
`;
