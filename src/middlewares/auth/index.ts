import { ForbiddenError } from 'apollo-server';
import { allow, shield } from 'graphql-shield';
// import * as mutation from './rules/mutation';
// import * as query from './rules/query';
import { env } from '../../env';
import { hasBearer } from './rules/common';

export const authMiddleware = () => {
  // Permissions
  return shield(
    {
      Query: {
        // ...query,
        '*': hasBearer
      },
      Mutation: {
        // ...mutation,
        // '*': deny
        '*': hasBearer
      }
      // Other type specific rules are left out in favor of the fallbackRule
    },
    {
      fallbackRule: allow,
      fallbackError: new ForbiddenError('unauthorized'),
      debug: env.NODE_ENV === 'development',
      allowExternalErrors: true
    }
  );
};
