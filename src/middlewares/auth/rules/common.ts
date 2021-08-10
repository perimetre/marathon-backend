import { rule } from 'graphql-shield';
import { Context } from '../../../typings/context';
import { env } from '../../../env';

export const isAuthenticated = rule({ cache: 'contextual' })(
  (_p, _a, ctx: Context) => !!env.BEARER && ctx.bearer === env.BEARER
);
