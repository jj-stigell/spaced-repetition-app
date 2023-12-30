import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { generalErrors } from '../configs/errorCodes';
import logger from '../configs/winston';
import { findAccountById } from '../controllers/utils/account';
import Account from '../database/models/account';
import { ApiError } from '../class';
import { Role, HttpCode } from '../types';

/**
 * Middleware function to enforce role-based access control.
 * Checks if the authenticated user has one of the specified roles,
 * allowing access to the resource only if the user's role matches the allowed roles.
 *
 * @param {Array<Role>} allowedRoles - An array of roles that are permitted to access the resource.
 *                                     The roles are typically defined as an enumeration.
 *
 * @returns {function} - Returns an Express middleware function that takes standard `req`, `res`,
 *                       and `next` parameters. The middleware function performs the following:
 *                       1. Retrieves the authenticated user's information from the request.
 *                       2. Validates if the user's role is included in the `allowedRoles`.
 *                       3. If the user is not authorized (role not allowed), responds with
 *                          an HTTP 403 Forbidden status and logs the unauthorized access attempt.
 *                       4. If authorized, passes control to the next middleware in the stack.
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
