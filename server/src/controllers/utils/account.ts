import { accountErrors } from '../../configs/errorCodes';
import Account from '../../database/models/account';
import { ApiError } from '../../class';
import { HttpCode } from '../../type';

/**
 * Finds a account by its ID.
 * @param {number} id - The ID of the account to be found.
 * @param {boolean} checkVerified - Condition to check if the user email is verified.
 * @returns {Promise<Account>} - A promise that resolves with the found account model object.
 * @throws {ApiError} - If the account is not found, it throws an error with a message
 * indicating the missing account with the specific ID.
 */
export async function findAccountById(
  id: number, checkVerified: boolean = false
): Promise<Account> {
  const account: Account | null = await Account.findByPk(id);
  if (!account) {
    throw new ApiError(accountErrors.ERR_ACCOUNT_NOT_FOUND, HttpCode.NotFound);
  }

  if (!account.emailVerified && checkVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  return account;
}

/**
 * Finds a account by its email address.
 * @param {string} email - The email address of the account to be found.
 * @param {boolean} checkVerified - Condition to check if the user email is verified.
 * @returns {Promise<Account>} - A promise that resolves with the found account model object.
 * @throws {ApiError} - If the account is not found, it throws an error with a message
 * indicating the missing account with the specific email.
 */
export async function findAccountByEmail(
  email: string, checkVerified: boolean = false
): Promise<Account> {
  const account: Account | null = await Account.findOne({
    where: {
      email: email
    }
  });

  if (!account) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_FOUND, HttpCode.NotFound);
  }

  if (!account.emailVerified && checkVerified) {
    throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
  }

  return account;
}
