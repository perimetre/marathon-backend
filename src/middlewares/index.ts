import { IMiddleware, IMiddlewareGenerator } from 'graphql-middleware';
import { authMiddleware } from './auth';

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const middlewares: (IMiddleware | IMiddlewareGenerator<any, any, any>)[] = [];

  const auth = authMiddleware();
  if (auth) {
    middlewares.push(auth);
  }

  return middlewares;
};
