const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');

const findDeckById = async (deckId) => {
  try {
    return await models.Deck.findByPk(deckId);
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const findAllDecks = async (includeInactive) => {
  try {
    if (!includeInactive) {
      return await models.Deck.findAll({
        where: { 'active': true },
        subQuery: false,
        nest: true,
        include: {
          model: models.DeckTranslation,
          where: {
            'active': true
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
            'active': true
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const findAccountDeckSettings = async (deckId, accountId) => {
  try {
    return await models.AccountDeckSettings.findOne({
      where: {
        'account_id': accountId,
        'deck_id': deckId
      },
      nest: true
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const createAccountDeckSettings = async (deckId, accountId) => {
  try {
    return await models.AccountDeckSettings.create({
      accountId: accountId,
      deckId: deckId
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

module.exports = {
  findDeckById,
  findAllDecks,
  findAccountDeckSettings,
  createAccountDeckSettings
};