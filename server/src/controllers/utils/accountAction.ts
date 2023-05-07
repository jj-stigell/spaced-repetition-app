import { accountErrors } from '../../configs/errorCodes';
import AccountAction from '../../database/models/accountAction';
import { ApiError } from '../../class';
import { ActionType, HttpCode } from '../../type';

/**
 * Finds a account action by its ID.
 * @param {string} id - The ID of the account action to be found.
 * @param {ActionType} actionType - The type of the action.
 * @returns {Promise<AccountAction>} - A promise that resolves with the found account model object.
 * @throws {ApiError} - If the account is not found, it throws an error with a message
 * indicating the missing account with the specific ID.
 */
export async function findAccountActionById(
  id: string, actionType: ActionType
): Promise<AccountAction> {
  const accountAction: AccountAction | null = await AccountAction.findByPk(id);
  if (!accountAction) {
    throw new ApiError(accountErrors.ERR_CONFIRMATION_CODE_NOT_FOUND, HttpCode.NotFound);
  }

  if (accountAction.type !== actionType) {
    throw new ApiError(accountErrors.ERR_INCORRECT_ACTION_TYPE, HttpCode.Conflict);
  }

  if (accountAction.expireAt < new Date) {
    throw new ApiError(accountErrors.ERR_CONFIRMATION_CODE_EXPIRED, HttpCode.NotFound);
  }

  return accountAction;
}
