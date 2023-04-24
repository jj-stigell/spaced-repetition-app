// Modules
import argon from 'argon2';
import { Request, Response } from 'express';
import * as yup from 'yup';

// Project imports
import { account as accountConstants, regex } from '../configs/constants';
import { NODE_ENV } from '../configs/environment';
import models from '../database/models';
import Account from '../database/models/account';
import AccountAction from '../database/models/accountAction';
import { accountErrors, validationErrors } from '../configs/errorCodes';
import { ApiError } from '../type/error';
import { HttpCode } from '../type/httpCode';
import { ResetPassword } from '../type/request';
import { findAccountById, findAccountByEmail } from './utils/account';
import { findAccountActionById } from './utils/accountAction';
import { sendEmailConfirmation, sendPasswordResetLink } from './utils/mailer';

/**
 * Confirm new account email address.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If the code is not found, its expired, or already
 * confirmed, function throws an error with a relevant error code.
 */
export async function confirmEmail(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    confirmationId: yup
      .string()
      .uuid(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_CONFIRMATION_CODE_REQUIRED)
  });

  await requestSchema.validate(req.body, { abortEarly: false }
  );
  const confirmationId: string = req.body.confirmationId;

  const confirmation: AccountAction = await findAccountActionById(confirmationId);

  if (confirmation.type !== 'CONFIRM_EMAIL') {
    throw new ApiError(accountErrors.ERR_INCORRECT_ACTION_TYPE, HttpCode.Conflict);
  }

  if (confirmation?.expireAt && confirmation.expireAt < new Date) {
    throw new ApiError(accountErrors.ERR_CONFIRMATION_CODE_EXPIRED, HttpCode.NotFound);
  }

  const account: Account = await findAccountById(confirmation.accountId);

  if (account.emailVerified) {
    throw new ApiError(accountErrors.ERR_ALREADY_CONFIRMED, HttpCode.Conflict);
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
    throw new ApiError(accountErrors.ERR_ALREADY_CONFIRMED, HttpCode.Conflict);
  }

  const confirmation: AccountAction = await models.AccountAction.create({
    accountId: account.id,
    type: 'CONFIRM_EMAIL',
    expireAt: new Date(Date.now() + accountConstants.CONFIRMATION_EXPIRY_TIME)
  });

  if (NODE_ENV !== 'test') {
    await sendEmailConfirmation(
      account.languageId, account.username, email, confirmation.id
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
    type: 'RESET_PASSWORD',
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
    confirmationId: yup
      .string()
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
  const { confirmationId, password }: ResetPassword = req.body;

  const confirmation: AccountAction = await findAccountActionById(confirmationId);

  if (confirmation.type !== 'RESET_PASSWORD') {
    throw new ApiError(accountErrors.ERR_INCORRECT_ACTION_TYPE, HttpCode.Conflict);
  }

  const account: Account = await findAccountById(confirmation.accountId);

  if (!account.emailVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  account.update({
    password: await argon.hash(password.trim()),
  });

  await account.save();
  await confirmation.destroy();

  res.status(HttpCode.Ok).json();
}
