import { intArg, mutationField, nonNull } from 'nexus';
import { makeError } from '../../utils/exception';
import { nanoid } from 'nanoid';
import logging from '../../utils/logging';

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
        throw makeError('Erro while trying to clone project', 'cloneProjectError');
      }
    }
  })
];
