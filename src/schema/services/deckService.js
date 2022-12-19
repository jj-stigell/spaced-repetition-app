const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const models = require('../../models');

/**
 * Find deck by its id (PK).
 * @param {integer} deckId - id of the deck
 * @returns {Deck} found deck
 */
const findDeckById = async (deckId) => {
  try {
    return await models.Deck.findByPk(deckId);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find all decks.
 * @param {boolean} includeInactive - include decks that are not active at the moment
 * @returns {Array<Deck>} array of all decks
 */
const findAllDecks = async (includeInactive) => {
  try {
    if (!includeInactive) {
      return await models.Deck.findAll({
        where: { active: true },
        subQuery: false,
        nest: true,
        include: {
          model: models.DeckTranslation,
          where: {
            active: true
          }
        }
      });
    } else {
      return await models.Deck.findAll({
        subQuery: false,
        nest: true,
        include: {
          model: models.DeckTranslation,
          where: {
            active: true
          }
        }
      });
    }
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find account specific deck.
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - account id
 * @returns {AccountDeckSettings} account specific settings
 */
const findAccountDeckSettings = async (deckId, accountId) => {
  try {
    return await models.AccountDeckSettings.findOne({
      where: {
        accountId: accountId,
        deckId: deckId
      },
      nest: true
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create a new deck settings for account.
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - account id
 * @param {boolean} favorite - is deck favorited or not
 * @param {integer} reviewInterval - maximum review interval, default if not provided
 * @param {integer} reviewsPerDay - maximum reviews per day for the deck, default if not provided
 * @param {integer} newCardsPerDay - maximum amount of new cards for the deck, default if not provided
 * @returns {AccountDeckSettings} newly created account deck settings
 */
const createAccountDeckSettings = async (
  deckId, accountId, favorite,
  reviewInterval = constants.defaultInterval,
  reviewsPerDay = constants.defaultReviewPerDay,
  newCardsPerDay = constants.defaultNewPerDay
) => {
  try {
    return await models.AccountDeckSettings.create({
      accountId: accountId,
      deckId: deckId,
      favorite: favorite ? true : false,
      reviewInterval: reviewInterval,
      reviewsPerDay: reviewsPerDay,
      newCardsPerDay: newCardsPerDay
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find decks translation information based on deck id and translation id.
 * @param {integer} deckId - id of the deck
 * @param {string} languageId - what translations are used
 * @returns {Array<DeckTranslation>} all translations for deck
 */
const findDeckTranslation = async (deckId, languageId) => {
  try {
    return await models.DeckTranslation.findAll({
      where: {
        deckId: deckId,
        languageId: languageId
      },
      nest: true
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findDeckById,
  findAllDecks,
  findAccountDeckSettings,
  createAccountDeckSettings,
  findDeckTranslation
};
