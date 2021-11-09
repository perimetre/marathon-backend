import { objectType } from 'nexus';
import { registerModelsWithPrismaBinding } from '../utils/nexus';

export const Session = objectType({
  name: 'Session',
  definition(t) {
    registerModelsWithPrismaBinding(t);
  }
});
