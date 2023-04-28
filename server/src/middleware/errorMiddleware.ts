import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

import { generalErrors } from '../configs/errorCodes';
import logger from '../configs/winston';
import { ApiError } from '../type/error';
import { HttpCode } from '../type/httpCode';

/**
 * Middleware function that handles errors.
 * @param {unknown} err - The error that occurred.
 * @param {Request} _req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns - None.
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
    logger.error(err);
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
    logger.error(err);
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
