const { internalServerError } = require('../../util/errors/graphQlErrors');
//const constants = require('../../util/constants');
const models = require('../../models');
const { sequelize } = require('../../database');
const rawQueries = require('./rawQueries');

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

const findReviewHistory = async (limitReviews, accountId) => {
  try {
    return await sequelize.query(rawQueries.fetchDailyReviewHistoryNDays, {
      replacements: {
        limitReviews: limitReviews,
        accountId: accountId
      },
      model: models.AccountReview,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const findDueReviewsCount = async (limitReviews, accountId) => {
  try {
    return await sequelize.query(rawQueries.fetchDueReviewsNDays, {
      replacements: {
        limitReviews: limitReviews,
        accountId: accountId
      },
      model: models.AccountCard,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

module.exports = {
  findAllDecks,
  findReviewHistory,
  findDueReviewsCount
};
