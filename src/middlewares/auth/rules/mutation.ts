import { Prisma } from '.prisma/client';
import { allow, rule, and } from 'graphql-shield';
import { Context } from '../../../typings/context';
import { isAuthenticated } from './common';

// Refer to https://graphql-shield.vercel.app/docs/rules#cache to double check caching rules

export const login = allow;

export const createOneProject = and(
  isAuthenticated,
  rule({ cache: 'strict' })(async (_parent, args: Prisma.ProjectCreateArgs, ctx: Context) => {
    // Only allow to create projects for my user
    const userId = args.data.user?.connect?.id || args.data.userId;
    return !!userId && userId === Number(ctx.user?.id);
  })
);

const updateDeleteProjectRule = and(
  isAuthenticated,
  rule({ cache: 'strict' })(
    async (_parent, args: Prisma.ProjectDeleteArgs | Prisma.ProjectUpdateArgs, ctx: Context) => {
      // Only allow to update projects that are from my user
      return (await ctx.prisma.project.count({ where: { userId: Number(ctx.user?.id), id: args.where.id } })) > 0;
    }
  )
);
export const updateOneProject = updateDeleteProjectRule;
export const deleteOneProject = updateDeleteProjectRule;
export const cloneOneProject = isAuthenticated;

export const createOneProjectModule = and(
  isAuthenticated,
  rule({ cache: 'strict' })(async (_parent, args: Prisma.ProjectModuleCreateArgs, ctx: Context) => {
    // Only allow to create project modules for a project that is mine

    const slug = args.data?.project?.connect?.slug;
    const id = args.data?.project?.connect?.id;

    if (slug) {
      return (await ctx.prisma.project.count({ where: { userId: Number(ctx.user?.id), slug } })) > 0;
    } else if (id) {
      return (await ctx.prisma.project.count({ where: { userId: Number(ctx.user?.id), id } })) > 0;
    } else {
      return false;
    }
  })
);

const updateDeleteProjectModuleRule = and(
  isAuthenticated,
  rule({ cache: 'strict' })(
    async (_parent, args: Prisma.ProjectModuleUpdateArgs | Prisma.ProjectModuleDeleteArgs, ctx: Context) => {
      // Only allow to update project modules for a project that is mine
      return (
        (await ctx.prisma.projectModule.count({
          where: {
            id: args.where.id,
            project: { userId: Number(ctx.user?.id) }
          }
        })) > 0
      );
    }
  )
);
export const updateOneProjectModule = updateDeleteProjectModuleRule;
export const deleteOneProjectModule = updateDeleteProjectModuleRule;

// We don't know how the where will be, so it's hard to identify whether the projects we're working with is ours
// TODO: After we have the queries, update this rule
const updateDeleteManyProjectModuleRule = isAuthenticated;
export const updateManyProjectModule = updateDeleteManyProjectModuleRule;
export const deleteManyProjectModule = updateDeleteManyProjectModuleRule;
