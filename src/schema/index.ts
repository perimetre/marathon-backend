import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';
import path from 'path';
import requireAll from 'require-all';
import getMiddlewares from '../middlewares';
import { applyMiddleware } from 'graphql-middleware';

// Require all schema files
const schemas = Object.entries(
  requireAll({
    // In the current folder
    dirname: path.join(__dirname, './'),
    // Remove this index file
    filter: (fileName: string) => {
      if (fileName === 'index.ts') return;
      if (fileName.endsWith('.map')) return;
      return fileName;
    }
  })
)
  // Get only the executable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .map((entry) => entry[1] as any);

export default applyMiddleware(
  makeSchema({
    // The imported schemas
    types: [...schemas /*, Object.entries(Resolvers).map((entry) => entry[1])*/],
    plugins: [
      nexusPrisma({
        paginationStrategy: 'prisma',
        experimentalCRUD: true,
        outputs: {
          typegen: path.join(__dirname, '../generated/nexus-prisma.d.ts')
        }
      })
    ],
    outputs: {
      // The path to the auto generated schema
      schema: path.join(__dirname, '../generated/schema.graphql'),
      // The path to the auto generated typescript types
      typegen: path.join(__dirname, '../generated/nexus.d.ts')
    },
    contextType: {
      module: path.join(__dirname, '../typings/context.d.ts'),
      export: 'Context'
    },
    prettierConfig: require.resolve('../../.prettierrc.js')
  }),
  ...getMiddlewares()
);
