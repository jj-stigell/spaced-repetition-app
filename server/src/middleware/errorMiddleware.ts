import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

import { generalErrors } from '../configs/errorCodes';
import logger from '../configs/winston';
import { ApiError } from '../class';
import { HttpCode } from '../types';

/**
 * Express middleware for centralized error handling.
 * This function intercepts errors thrown from anywhere in the application and formats
 * them into a consistent response structure. It also logs the error details using Winston.
 *
 * @param {unknown} err - The error object caught by this middleware. Its type is checked
 *                        to handle different error types (ApiError, ValidationError, etc.)
 *                        appropriately.
 * @param {Request} _req - The Express request object. Not used directly here, but necessary
 *                         for the middleware signature.
 * @param {Response} res - The Express response object. Used to send a structured error response.
 * @param {NextFunction} next - The next middleware function in the stack. Not used here, but
 *                              necessary for the middleware signature.
 */
export default function errorMiddleware(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: unknown, _req: Request, res: Response, next: NextFunction
): void {

  if (err instanceof ApiError) {
    res.status(err.statusCode);

    res.send({
      errors: [
        {
          code: err.message
        }
      ],
    });
    logger.error(err.message);
    return;
  }

  if (err instanceof ValidationError) {
    res.status(HttpCode.BadRequest).send({
      errors: err.errors.map((error: string) => {
        return {
          code: error
        };
      })
    });
    logger.error(err.errors);
    return;
  }

  // Fallback if no other error matches
  res.status(HttpCode.InternalServerError).send({
    errors: [
      {
        code: generalErrors.INTERNAL_SERVER_ERROR
      }
    ]
  });
  logger.error(err);
  return;
}
