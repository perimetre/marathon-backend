// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.BASEPATH = __dirname;

export const env = {
    BASEPATH: __dirname,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || '3000'
};
