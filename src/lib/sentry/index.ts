import { Express } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { env } from '../../env';

type ContextType = {
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' | 'critical';
  extra?: Record<string, unknown> | string;
};

let sentryInitialized = false;

export const initSentry = (app?: Express) => {
  const { SENTRY_DSN, NODE_ENV } = env;
  if (SENTRY_DSN) {
    Sentry.init({
      environment: NODE_ENV,
      dsn: SENTRY_DSN,
      integrations: app
        ? [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app })
          ]
        : [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true })
          ],
      tracesSampleRate: 1.0
    });

    sentryInitialized = true;
  }
};

export const captureMessage = (message: string, context: ContextType = {}): void => {
  if (!sentryInitialized) {
    initSentry();
  }

  const { SENTRY_DSN } = env;
  if (SENTRY_DSN && sentryInitialized) {
    Sentry.withScope((scope) => {
      if (context && context.level) {
        scope.setLevel(context.level as Sentry.Severity);
      }
      if (context && context.extra) {
        scope.setExtras(typeof context.extra === 'string' ? { message: context.extra } : context.extra);
      }
      Sentry.captureMessage(message);
    });
  }
};

export const captureException = (error: Error, context: ContextType = {}): void => {
  if (!sentryInitialized) {
    initSentry();
  }

  const { SENTRY_DSN } = env;
  if (SENTRY_DSN && sentryInitialized) {
    Sentry.withScope((scope) => {
      if (context && context.level) {
        scope.setLevel(context.level as Sentry.Severity);
      }
      if (context && context.extra) {
        scope.setExtras(typeof context.extra === 'string' ? { message: context.extra } : context.extra);
      }
      Sentry.captureException(error);
    });
  }
};
