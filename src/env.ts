// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.BASEPATH = __dirname;

export const env = {
  BASEPATH: __dirname,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || '3000',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  PRISMA_LOG_QUERY: process.env.NODE_ENV,
  BEARER: process.env.BEARER,
  SENTRY_DSN: process.env.SENTRY_DSN,
  AWS_S3_ENDPOINT_URL: process.env.AWS_S3_ENDPOINT_URL,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_S3_REGION_NAME: process.env.AWS_S3_REGION_NAME,
  AWS_STORAGE_BUCKET_NAME: process.env.AWS_STORAGE_BUCKET_NAME,
  AWS_DEFAULT_ACL: process.env.AWS_DEFAULT_ACL,
  PUBLIC_MEDIA_URI: process.env.PUBLIC_MEDIA_URI,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en',
  ASSET_BUNDLE_FOLDER: process.env.ASSET_BUNDLE_FOLDER,
  DEFAULT_PLATFORM: process.env.DEFAULT_PLATFORM || 'webgl',
  MARATHON_API: process.env.MARATHON_API,
  MARATHON_API_LOGIN: process.env.MARATHON_API_LOGIN,
  MARATHON_API_GRAPHQL: process.env.MARATHON_API_GRAPHQL,
  MARATHON_API_GRAPHQL_KEY: process.env.MARATHON_API_GRAPHQL_KEY,
  MARATHON_API_CREATE_LIST: process.env.MARATHON_API_CREATE_LIST,
  MARATHON_API_SYNC: process.env.MARATHON_API_SYNC,
  MARATHON_SYNC_PRODUCTS_PER_PAGE:
    process.env.MARATHON_SYNC_PRODUCTS_PER_PAGE && !isNaN(Number(process.env.MARATHON_SYNC_PRODUCTS_PER_PAGE))
      ? Number(process.env.MARATHON_SYNC_PRODUCTS_PER_PAGE)
      : 50,
  MARATHON_SYNC_EMPTY_PAGES_TO_STOP:
    process.env.MARATHON_SYNC_EMPTY_PAGES_TO_STOP && !isNaN(Number(process.env.MARATHON_SYNC_EMPTY_PAGES_TO_STOP))
      ? Number(process.env.MARATHON_SYNC_EMPTY_PAGES_TO_STOP)
      : 50
};
