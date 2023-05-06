import { cardErrors } from '../../configs/errorCodes';
import Card from '../../database/models/card';
import { ApiError } from '../../class';
import { HttpCode } from '../../type';

/**
 * Finds a card by its ID.
 * @param {number} id - The ID of the card to be found.
 * @returns {Promise<Card>} - A promise that resolves with the found card model object.
 * @throws {ApiError} - If the card is not found, it throws an error with a message
 * indicating the missing card with the specific ID.
 */
export async function findCardById(id: number): Promise<Card> {
  const card: Card | null = await Card.findByPk(id);
  if (!card) {
    throw new ApiError(cardErrors.ERR_CARD_NOT_FOUND, HttpCode.NotFound);
  }
  return card;
}
