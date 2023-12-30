import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an asynchronous route handler to catch and forward any errors.
 * @param {Function} handler - An asynchronous function that handles an Express route.
 * It takes Express's `req`, `res`, and `next` parameters.
 * @returns {RequestHandler} - Returns an Express RequestHandler. This wrapper function
 * automatically catches any errors that occur in the asynchronous `handler` function
 * and forwards them to Express's default error handling mechanism via the `next` callback.
 */
export function requestWrap(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
