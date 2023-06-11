import { deckErrors } from '../../configs/errorCodes';
import { ApiError } from '../../class';
import Deck from '../../database/models/deck';
import { HttpCode } from '../../type';

/**
 * Finds a deck by its ID.
 * @param {number} id - The ID of the deck to be found.
 * @returns {Promise<Deck>} - A promise that resolves with the found deck model object.
 * @throws {ApiError} - If the deck is not found, it throws an error with a message
 * indicating the missing deck with the specific ID.
 */
export async function findDeckById(id: number): Promise<Deck> {
  const deck: Deck | null = await Deck.findByPk(id);
  if (!deck) {
    throw new ApiError(deckErrors.ERR_DECK_NOT_FOUND, HttpCode.NotFound);
  }
  if (!deck.active) {
    throw new ApiError('Deck not active', HttpCode.NotFound);
  }
  return deck;
}
