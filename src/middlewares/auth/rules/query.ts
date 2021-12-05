import {and, rule} from 'graphql-shield';
import {Context} from '../../../typings/context';
import {isAuthenticated} from './common';

export const types = isAuthenticated;

export const slideSuppliers = isAuthenticated;

export const projects = and(
    isAuthenticated,
    rule({cache: 'contextual'})(async (_parent, args, ctx: Context) => {
        return ctx.user?.id === args?.where?.userId?.equals;
    })
);

export const project = and(
    isAuthenticated,
    rule({cache: 'contextual'})(async (_parent, args, ctx: Context) => {
        const project = await ctx.prisma.project.findUnique({where: {slug: args.where.slug}});
        return ctx.user?.id === project?.userId;
    })
);

export const projectModule = isAuthenticated;
export const projectModules = isAuthenticated;
export const module = isAuthenticated;
export const modules = isAuthenticated;
export const finishes = isAuthenticated;
export const type = isAuthenticated;
export const collections = isAuthenticated;
