import { Router } from 'express';

import {
  confirmEmail, resendConfirmEmail, requestResetPassword, resetPassword
} from '../controllers/account';
import { requestWrap } from '../util/requestWrap.ts';

export const router: Router = Router();

/**
 * @swagger
 * /api/v1/account/confirmation:
 *   post:
 *     tags: [Account]
 *     description: Confirm the email address of newly created/updated account email.
 *     requestBody:
 *       description: The email confirmation id.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationId:
 *                 type: string
 *                 example: d61c527a-654a-43eb-abad-233139ae110d
 *                 description: Confirmation id, UUID V4.
 *                 required: true
 *     responses:
 *       200:
 *         description: Email confirmation succesful.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: The account or the confirmation is not found or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       409:
 *         description: Incorrect confirmation type or email already confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 */
router.post(
  '/confirmation',
  requestWrap(confirmEmail)
);

/**
 * @swagger
 * /api/v1/account/confirmation/resend:
 *   post:
 *     tags: [Account]
 *     description: Resend confirm code for email address of newly created/updated account email.
 *     requestBody:
 *       description: The email address to be confirmed.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@email.com
 *                 description: Email address that requests new confirmation code.
 *                 required: true
 *     responses:
 *       200:
 *         description: Email confirmation succesful.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         description: The account with specific email address not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       409:
 *         description: Email already confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 */
router.post(
  '/confirmation/resend',
  requestWrap(resendConfirmEmail)
);

/**
 * @swagger
 * /api/v1/account/password/reset:
 *   post:
 *     tags: [Account]
 *     description: Request password reset link if the user has forgotten their password.
 *     requestBody:
 *       description: The email address of the account.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@email.com
 *                 description: Email address that requests password reset link.
 *                 required: true
 *     responses:
 *       200:
 *         description: Password reset link sent to email succesfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: The account email is not confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       404:
 *         description: The account with specific email address not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 */
router.post(
  '/password/reset',
  requestWrap(requestResetPassword)
);

/**
 * @swagger
 * /api/v1/account/password/reset:
 *   patch:
 *     tags: [Account]
 *     description: Reset password based on confirmation code sent to the user email.
 *     requestBody:
 *       description: The email address to be confirmed.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationId:
 *                 type: string
 *                 example: d61c527a-654a-43eb-abad-233139ae110d
 *                 description: Confirmation id, UUID V4.
 *                 required: true
 *               password:
 *                 type: string
 *                 example: TestinG12345
 *                 description: New password.
 *                 required: true
 *     responses:
 *       200:
 *         description: Password changed succesfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: The account email is not confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       404:
 *         description: The account not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       409:
 *         description: Incorrect confirmation type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 */
router.patch(
  '/password/reset',
  requestWrap(resetPassword)
);
