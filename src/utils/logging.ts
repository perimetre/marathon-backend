/* eslint-disable @typescript-eslint/no-explicit-any */
// import { captureMessage, captureException } from '../lib/sentry';

const error = (error: any, message?: string, extra: Record<string, unknown> | string = {}) => {
  if (message) {
    console.error(message, error, extra);
  } else {
    console.error(error, extra);
  }

  // return captureException(error, {
  //   level: 'error',
  //   extra: !extra ? message : typeof extra === 'string' ? extra : { message, ...extra }
  // });
};

const fatal = (error: any, message?: string, extra: Record<string, unknown> | string = {}) => {
  if (message) {
    console.error(message, error, extra);
  } else {
    console.error(error, extra);
  }
  // return captureException(error, {
  //   level: 'fatal',
  //   extra: !extra ? message : typeof extra === 'string' ? extra : { message, ...extra }
  // });
};

const info = (message: string, extra: Record<string, unknown> | string = {}) => {
  console.log(message, extra);
  // return captureMessage(message, { level: 'info', extra });
};

const debug = (message: string, extra: Record<string, unknown> | string = {}) => {
  console.log('sentry.debug', message, extra);
  // return captureMessage(message, { level: 'debug', extra });
};

const warn = (message: string, extra: Record<string, unknown> | string = {}) => {
  console.warn(message, extra);
  // return captureMessage(message, { level: 'warning', extra });
};

const logging = {
  error,
  fatal,
  info,
  debug,
  warn
};

export default logging;
