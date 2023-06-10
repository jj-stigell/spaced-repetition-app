import { NextFunction, Request, Response } from 'express';

import { generalErrors } from '../configs/errorCodes';
import logger from '../configs/winston';
import { findAccountById } from '../controllers/utils/account';
import Account from '../database/models/account';
import { ApiError } from '../class';
import { JwtPayload } from 'jsonwebtoken';
import { Role, HttpCode } from '../type';

/**
 * Middleware function that checks if the user making the request has the required
 * role(s) to access the resource.
 * @param {Array<Role>} allowedRoles - An array of roles that are allowed to access the resource.
 * @returns {function} - Returns a middleware function that can be used in a route handler.
 */
export function authorizationMiddleware(
  allowedRoles: Array<Role>
): (req: Request, res: Response, next: NextFunction) => void {

  return async function (req: Request, res: Response, next: NextFunction) {
    const user: JwtPayload | undefined = req.user;

    if (!user) {
      throw new ApiError(generalErrors.UNAUTHORIZED, HttpCode.Unauthorized);
    }

    const userFromDb: Account = await findAccountById(user.id);

    if (!allowedRoles.includes(userFromDb.role as Role)) {
      res.status(HttpCode.Forbidden).send({
        errors: [
          {
            code: generalErrors.FORBIDDEN
          }
        ]
      });
      logger.warn(
        `unauthorized access attempt ${req.path}, user: ${user.id}, session: ${user.sessionId}`
      );
      return;
    }
    next();
  };
}
