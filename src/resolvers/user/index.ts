import { mutationField, nonNull, nullable, arg, inputObjectType } from 'nexus';
import axios, { AxiosResponse } from 'axios';
import { env } from '../../env';
import { makeError } from '../../utils/exception';
import logging from '../../utils/logging';
import { URL } from 'url';
import { marathonService } from '../../services/marathon';

export const UserSingIn = inputObjectType({
  name: 'UserSingIn',
  definition(t) {
    t.string('email');
    t.string('password');
  }
});

export const UserMutations = [
  mutationField('login', {
    type: nullable('Session'),
    args: { user: nonNull(arg({ type: 'UserSingIn' })) },
    resolve: async (_parent, args, ctx) => {
      try {
        const { user } = args;
        const request = await marathonService({ db: ctx.prisma }).login(user);

        if (request.status === 200) {
          let verifyUser = await ctx.prisma.user.findFirst({ where: { email: user.email as string } });
          if (!verifyUser) {
            verifyUser = await ctx.prisma.user.create({
              data: {
                email: user.email as string,
                marathonUserId: request.data.user_id
              }
            });
          }
          return await ctx.prisma.session.create({
            data: {
              userId: verifyUser.id,
              token: request.data.user_token
            }
          });
        }

        return null;
      } catch (err: any) {
        if (err.response.status === 403 || err.response.status === 401) {
          throw makeError('Email or password is incorrect', 'wrongCredentials');
        } else if (err.response.status === 404) {
          throw makeError('External service is unreachable or was not found', 'unreachableService');
        }
        logging.error(err, 'Error on login');
        throw makeError('Failed on login', err.response.statusText);
      }
    }
  })
];
