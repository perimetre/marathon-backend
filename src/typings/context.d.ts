import { PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';

// This is the type that will be used for the "context" variable for all resolvers.
// If changing anything here, don't forget to generate types again with "npm run graphql:codegen"!
export type Context = {
  prisma: PrismaClient;
  locale: string;
  platform: string;
  user?: User;
} & ExpressContext;
