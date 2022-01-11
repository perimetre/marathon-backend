import { intArg, mutationField, nonNull, nullable } from 'nexus';
import { makeError } from '../../utils/exception';
import { nanoid } from 'nanoid';
import logging from '../../utils/logging';
import { marathonService } from '../../services/marathon';
import { NexusGenArgTypes } from '../../generated/nexus';

export const ProjectMutations = [
  mutationField('cloneOneProject', {
    type: nonNull('Project'),
    args: { id: nonNull(intArg()) },
    resolve: async (_, args, ctx) => {
      try {
        const project = await ctx.prisma.project.findUnique({ where: { id: args.id } });
        if (!project) {
          throw makeError('Project not found!', 'projectNotFound');
        }

        const { id, ...restProject } = project;

        const projectModules = await ctx.prisma.project.findUnique({ where: { id: args.id } }).projectModules();

        return await ctx.prisma.project.create({
          data: {
            ...restProject,
            userId: ctx.user?.id,
            title: `${project.title} - clone`,
            slug: `${project.slug}-clone`,
            projectModules: {
              createMany: {
                data: projectModules.map(({ id, projectId, ...projectModule }) => ({
                  ...projectModule,
                  nanoId: nanoid()
                }))
              }
            }
          }
        });
      } catch (err: any) {
        logging.error(err, 'Error trying to clone project');
        throw makeError('Error while trying to clone project', 'cloneProjectError');
      }
    }
  }),
  mutationField('createList', {
    type: nullable('List'),
    args: { id: nonNull(intArg()) },
    resolve: async (_, args: NexusGenArgTypes['Mutation']['createList'], ctx) => {
      return await marathonService({ db: ctx.prisma }).createList(
        args.id,
        ctx.req.headers['x-auth-token'] as string | undefined
      );
    }
  })
];
