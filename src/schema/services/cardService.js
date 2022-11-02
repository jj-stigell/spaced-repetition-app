const { internalServerError } = require('../../util/errors/graphQlErrors');
//const constants = require('../../util/constants');
const models = require('../../models');

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

module.exports = {
  findAllDecks
};
