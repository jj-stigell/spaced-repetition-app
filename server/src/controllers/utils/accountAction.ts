import { accountErrors } from '../../configs/errorCodes';
import AccountAction from '../../database/models/accountAction';
import { ApiError } from '../../types/error';
import { HttpCode } from '../../types/httpCode';

/**
 * Finds a account action by its ID.
 * @param {string} id - The ID of the account action to be found.
 * @returns {Promise<AccountAction>} - A promise that resolves with the found account model object.
 * @throws {ApiError} - If the account is not found, it throws an error with a message
 * indicating the missing account with the specific ID.
 */
export async function findAccountActionById(id: string): Promise<AccountAction> {
  const accountAction: AccountAction | null = await AccountAction.findByPk(id);
  if (!accountAction) {
    throw new ApiError(accountErrors.ERR_CONFIRMATION_CODE_NOT_FOUND, HttpCode.NotFound);
  }
  return accountAction;
}
