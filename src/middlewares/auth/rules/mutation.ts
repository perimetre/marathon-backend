import { Prisma } from '.prisma/client';
import { allow, rule } from 'graphql-shield';
import { Context } from '../../../typings/context';
import { isAuthenticated } from './common';

export const createOneProject = isAuthenticated;

export const updateOneProject = rule({ cache: 'contextual' })(
  async (_parent, args: Prisma.ProjectUpdateArgs, ctx: Context) => {
    return (await ctx.prisma.project.count({ where: { userId: Number(ctx.user?.id), id: args.where.id } })) > 0;
  }
);

export const deleteOneProject = rule({ cache: 'contextual' })(
  async (_parent, args: Prisma.ProjectDeleteArgs, ctx: Context) => {
    return (await ctx.prisma.project.count({ where: { userId: Number(ctx.user?.id), id: args.where.id } })) > 0;
  }
);

export const login = allow;
