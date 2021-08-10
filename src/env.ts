// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.BASEPATH = __dirname;

export const env = {
  BASEPATH: __dirname,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || '3000',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  PRISMA_LOG_QUERY: process.env.NODE_ENV,
  BEARER: process.env.BEARER
};
