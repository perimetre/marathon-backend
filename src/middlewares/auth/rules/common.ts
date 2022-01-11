import { rule } from 'graphql-shield';
import { Context } from '../../../typings/context';

export const isAuthenticated = rule({ cache: 'contextual' })(async (_p, _a, ctx: Context) => {
  const authToken = ctx.req.headers['x-auth-token'];
  if (!authToken) return false;
  const validToken = await ctx.prisma.session.findFirst({ where: { token: authToken as string } });
  return !!validToken;
});
