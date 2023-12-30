import { Router } from 'express';
import passport from 'passport';

import {
  confirmEmail, resendConfirmEmail, requestResetPassword,
  resetPassword, changePassword, updateUserData, deleteAccount
} from '../controllers/account';
import { requestWrap } from '../middleware/requestWrap';

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
 * /api/v1/account:
 *   delete:
 *     tags: [Account]
 *     description: Mark account for deletion. Deletetion happens after 30 days.
 *     requestBody:
 *       description: Account password to confirm account deletion.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: my-password-123
 *                 description: Account password.
 *                 required: true
 *     responses:
 *       202:
 *         description: User marked for deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletionDate:
 *                       type: string
 *                       example: 24.12.2023
 *                       description: Date when the account will be deleted.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: The account is not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  requestWrap(deleteAccount)
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

/**
 * @swagger
 * /api/v1/account/password:
 *   patch:
 *     tags: [Account]
 *     description: Change account password.
 *     requestBody:
 *       description: Current and new password.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: ThisIsMyNewPassword123
 *                 description: Password currently used for the account in plain text.
 *                 required: true
 *               newPassword:
 *                 type: string
 *                 example: ThisIsMyCurrentPassword123
 *                 description: New password for the account in plain text.
 *                 required: true
 *     responses:
 *       200:
 *         description: Password changed succesfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: The account email is not confirmed or current password is incorrect.
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
 *     security:
 *       - cookieAuth: []
 */
router.patch(
  '/password',
  passport.authenticate('jwt', { session: false }),
  requestWrap(changePassword)
);

/**
 * @swagger
 * /api/v1/account:
 *   patch:
 *     tags: [Account]
 *     description: Change account settings (JLPT level, language, username).
 *     requestBody:
 *       description: Desired values to be changed.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jlptLevel:
 *                 type: integer
 *                 example: 1
 *                 description: JLPT level.
 *                 enum: [1, 2, 3, 4, 5]
 *               language:
 *                 type: string
 *                 example: 1
 *                 description: UI and study material language.
 *                 enum: [en, fi]
 *               username:
 *                 type: string
 *                 example: shintaro
 *                 description: New username for the account, allowed to update every 30 days.
 *     responses:
 *       200:
 *         description: Account details updated succesfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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
 *     security:
 *       - cookieAuth: []
 */
router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  requestWrap(updateUserData)
);
