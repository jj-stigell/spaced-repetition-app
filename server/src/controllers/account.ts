// Modules
import { Request, Response } from 'express';
import * as yup from 'yup';

// Project imports
import { account as accountConstants, regex } from '../configs/constants';
import { NODE_ENV } from '../configs/environment';
import models from '../database/models';
import Account from '../database/models/account';
import AccountAction from '../database/models/accountAction';
import { accountErrors, validationErrors } from '../configs/errorCodes';
import { ApiError } from '../class';
import { findAccountById, findAccountByEmail } from './utils/account';
import { findAccountActionById } from './utils/accountAction';
import { sendEmailConfirmation, sendPasswordResetLink } from './utils/mailer';
import { JwtPayload } from 'jsonwebtoken';
import {
  ActionType, HttpCode, ResetPasswordData, ChangePasswordData, JlptLevel
} from '../type';
import { comparePassword } from './utils/password';

/**
 * Confirm new account email address.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If the code is not found, its expired, or already
 * confirmed, function throws an error with a relevant error code.
 */
export async function confirmEmail(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    confirmationId: yup.string()
      .uuid(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_CONFIRMATION_CODE_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false }
  );
  const confirmationId: string = req.body.confirmationId;

  const confirmation: AccountAction = await findAccountActionById(
    confirmationId, ActionType.CONFIRM_EMAIL
  );

  const account: Account = await findAccountById(confirmation.accountId);

  if (account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_ALREADY_CONFIRMED, HttpCode.Conflict);
  }

  account.set({
    emailVerified: true
  });

  await account.save();
  res.status(HttpCode.Ok).json();
}

/**
 * Resend confirmation code to accounts email address.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If the account is not found or account's email is already
 * confirmed, function throws an error with a relevant error code.
 */
export async function resendConfirmEmail(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    email: yup.string()
      .email(validationErrors.ERR_NOT_VALID_EMAIL)
      .max(accountConstants.EMAIL_MAX_LENGTH, validationErrors.ERR_EMAIL_TOO_LONG)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_EMAIL_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false });
  const email: string = req.body.email;

  const account: Account = await findAccountByEmail(email);

  if (account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_ALREADY_CONFIRMED, HttpCode.Conflict);
  }

  const confirmation: AccountAction = await models.AccountAction.create({
    accountId: account.id,
    type: 'CONFIRM_EMAIL',
    expireAt: new Date(Date.now() + accountConstants.CONFIRMATION_EXPIRY_TIME)
  });

  if (NODE_ENV !== 'test') {
    await sendEmailConfirmation(
      account.languageId, account.username, account.email, confirmation.id
    );
  }

  res.status(HttpCode.Ok).json();
}

/**
 * Send link for the account to reset their password.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If the account's email is already confirmed,
 * function throws an error with a relevant error code.
 */
export async function requestResetPassword(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    email: yup.string()
      .email(validationErrors.ERR_NOT_VALID_EMAIL)
      .max(accountConstants.EMAIL_MAX_LENGTH, validationErrors.ERR_EMAIL_TOO_LONG)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_EMAIL_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false });
  const email: string = req.body.email;

  const account: Account = await findAccountByEmail(email);

  if (!account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  const confirmation: AccountAction = await models.AccountAction.create({
    accountId: account.id,
    type: ActionType.RESET_PASSWORD,
    expireAt: new Date(Date.now() + accountConstants.CONFIRMATION_EXPIRY_TIME)
  });

  if (NODE_ENV !== 'test') {
    await sendPasswordResetLink(
      account.languageId, account.username, account.email, confirmation.id
    );
  }

  res.status(HttpCode.Ok).json();
}

/**
 * Reset account password.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If errors are encountered,
 * function throws an error with a relevant error code.
 */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    confirmationId: yup.string()
      .uuid(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_CONFIRMATION_CODE_REQUIRED),
    password: yup.string()
      .max(accountConstants.PASSWORD_MAX_LENGTH, validationErrors.ERR_PASSWORD_TOO_LONG)
      .min(accountConstants.PASSWORD_MIN_LENGTH, validationErrors.ERR_PASSWORD_TOO_SHORT)
      .matches(regex.LOWERCASE_REGEX, validationErrors.ERR_PASSWORD_LOWERCASE)
      .matches(regex.UPPERCASE_REGEX, validationErrors.ERR_PASSWORD_UPPERCASE)
      .matches(regex.NUMBER_REGEX, validationErrors.ERR_PASSWORD_NUMBER)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_PASSWORD_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false });
  const { confirmationId, password }: ResetPasswordData = req.body;

  const confirmation: AccountAction = await findAccountActionById(
    confirmationId, ActionType.RESET_PASSWORD
  );

  const account: Account = await findAccountById(confirmation.accountId, true);

  account.update({
    password
  });

  await account.save();
  res.status(HttpCode.Ok).json();
}

/**
 * Change account password.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If errors are encountered,
 * function throws an error with a relevant error code.
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    currentPassword: yup.string()
      .required(validationErrors.ERR_PASSWORD_REQUIRED),
    newPassword: yup.string()
      .max(accountConstants.PASSWORD_MAX_LENGTH, validationErrors.ERR_PASSWORD_TOO_LONG)
      .min(accountConstants.PASSWORD_MIN_LENGTH, validationErrors.ERR_PASSWORD_TOO_SHORT)
      .matches(regex.LOWERCASE_REGEX, validationErrors.ERR_PASSWORD_LOWERCASE)
      .matches(regex.UPPERCASE_REGEX, validationErrors.ERR_PASSWORD_UPPERCASE)
      .matches(regex.NUMBER_REGEX, validationErrors.ERR_PASSWORD_NUMBER)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_PASSWORD_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false });
  const { currentPassword, newPassword }: ChangePasswordData = req.body;

  if (currentPassword === newPassword) {
    throw new ApiError(accountErrors.ERR_PASSWORD_CURRENT_AND_NEW_EQUAL, HttpCode.BadRequest);
  }

  const user: JwtPayload = req.user as JwtPayload;
  const account: Account = await findAccountById(user.id);

  if (!account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  const match: boolean = await comparePassword(account.password, currentPassword);
  if (!match) {
    throw new ApiError(accountErrors.ERR_PASSWORD_CURRENT_INCORRECT, HttpCode.Forbidden);
  }

  account.update({
    password: newPassword
  });

  await account.save();
  res.status(HttpCode.Ok).json();
}

/**
 * Update user personal data (excluding password).
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If errors are encountered,
 * function throws an error with a relevant error code.
 */
export async function updateUserData(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    jlptLevel: yup.number()
      .oneOf(
        [JlptLevel.N1, JlptLevel.N2, JlptLevel.N3, JlptLevel.N4, JlptLevel.N5],
        validationErrors.ERR_INVALID_JLPT_LEVEL
      )
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired(),
    language: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'], validationErrors.ERR_LANGUAGE_ID_NOT_VALID)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired()
  });

  await requestSchema.validate(req.body, { abortEarly: false });
  const user: JwtPayload = req.user as JwtPayload;
  const account: Account = await findAccountById(user.id);

  if (!account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  account.update({
    selectedJlptLevel: req.body.jlptLevel ?? account.selectedJlptLevel,
    languageId: req.body.language ?? account.languageId
  });

  await account.save();
  res.status(HttpCode.Ok).json();
}
