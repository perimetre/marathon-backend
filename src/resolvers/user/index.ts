import { mutationField, nonNull, nullable, arg, inputObjectType } from 'nexus';
import axios, { AxiosResponse } from 'axios';
import { env } from '../../env';
import { makeError } from '../../utils/exception';

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

        const request = (await axios({
          method: 'POST',
          url: env.MARATHON_API_LOGIN,
          headers: {
            Authorization: `Basic ${Buffer.from(`${user.email}:${user.password}`).toString('base64')}`
          }
        })) as AxiosResponse<{ user_id: number; user_token: string }>;

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
        }
        throw makeError('Failed on login', err.response.statusText);
      }
    }
  })
];
