import { Router } from 'express';
import passport from 'passport';

import { login, logout, register } from '../controllers/auth';
import { requestWrap } from '../util/requestWrap';

export const router: Router = Router();

/**
 * @swagger
 * definitions:
 *   Credentials:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         description: Account email address.
 *         required: true
 *       password:
 *         type: string
 *         description: Account plaintext password.
 *         required: true
 *   RegisterRequest:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: Username for the account.
 *         required: true
 *       email:
 *         type: string
 *         description: Email address, to be used as a credential.
 *         required: true
 *       password:
 *         type: string
 *         description: Plaintext password.
 *         required: true
 *       acceptTos:
 *         type: boolean
 *         description: Information on accepting the terms of service.
 *         required: true
 *       allowNewsLetter:
 *         type: boolean
 *         description: Permit for sending news letters to the account email address.
 *         required: false
 *       language:
 *         type: string
 *         description: Language code (ISO 639-1) for the account, defaults to "EN".
 *         required: false
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     description: >
 *       Attempts to create an account with the specified information.
 *     requestBody:
 *       description: Basic account information.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/RegisterRequest'
 *     responses:
 *       200:
 *         description: >
 *           The account has been created succesfully and confirmation
 *           email is sent to the provided email address.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: An account with the specified email or username already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 */
router.post(
  '/register',
  requestWrap(register)
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     description: Log in to existing user account.
 *     requestBody:
 *       description: The credentials for the user, the email and password.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Credentials'
 *     responses:
 *       200:
 *         description: The login has succeeded. An access token is return in a cookie.
 *         headers:
 *            Set-Cookie:
 *              description: JWT token, allowing access to the API.
 *              schema:
 *                type: string
 *                example: jwt=xxxxx.yyyyy.zzzzz; Secure; HttpOnly; SameSite=None
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: xXxMike
 *                       description: Account username.
 *                     email:
 *                       type: string
 *                       example: mike@gmail.com
 *                       description: Account email.
 *                     role:
 *                       type: string
 *                       example: MEMBER
 *                       description: Account role in the backend.
 *                       enum: [NON_MEMBER, MEMBER, READ_RIGHT, WRITE_RIGHT, SUPERUSER]
 *                     allowNewsLetter:
 *                       type: boolean
 *                       example: true
 *                       description: Is the news letter receiving enabled.
 *                     language:
 *                       type: string
 *                       example: EN
 *                       description: Account language.
 *                     jlptLevel:
 *                       type: integer
 *                       example: 1
 *                       description: JLPT level.
 *                       enum: [1, 2, 3, 4, 5]
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/login',
  requestWrap(login)
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     description: >
 *       Log out of a session, requesting the browser to remove
 *       its session JWT token from the cookie.
 *
 *       This requires the user to be already logged in, authenticated via a
 *       JWT token in the cookie.
 *     responses:
 *       200:
 *         description: The user has successfully logged out.
 *       401:
 *         description: The user is not logged in, or the JWT token is invalid/expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.post(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  requestWrap(logout)
);
