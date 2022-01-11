import { ApolloError } from 'apollo-server';

export class FrontError extends Error {
  status: number | undefined;
  succeeded: boolean | undefined;
  constructor(message?: string, name?: string, status?: number, succeeded?: boolean) {
    super(message);
    this.name = name || 'FrontError';
    this.status = status || 500;
    this.succeeded = succeeded || false;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * This function creates a formatted Apollo Server error that will only be forwarded to the client.
 * Sentry is NOT notified about these errors (this method should be mostly used for user facing errors)
 *
 * @param {string} message - The error message. If you only set this argument, the message forwarded will be displayed to the client as it is (no translations)
 * @param {string} code - If you have a custom code mapped in the serverErrors key of the locales in the client, set it here
 * (if you do so, your message will still be sent to the client but we use the code instead to map the error to its translation)
 * @param {string} status - Status code, used only in our RESTful API route calls
 * @return {string} A formatted Apollo Server error
 *
 */
export const makeFrontError = (message: string, code?: string, status?: number) =>
  code ? new ApolloError(message, code, { custom: true, status }) : new ApolloError(message);

export const makeError = (message?: string, name?: string, status?: number, succeeded?: boolean) =>
  new FrontError(message, name, status, succeeded);
