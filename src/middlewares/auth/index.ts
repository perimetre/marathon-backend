import { ForbiddenError } from 'apollo-server';
import { allow, deny, shield } from 'graphql-shield';
import * as mutation from './rules/mutation';
import * as query from './rules/query';
import { env } from '../../env';

export const authMiddleware = () => {
  // Permissions
  return shield(
    {
      Query: {
        ...query,
        '*': allow
      },
      Mutation: {
        ...mutation,
        '*': deny
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
