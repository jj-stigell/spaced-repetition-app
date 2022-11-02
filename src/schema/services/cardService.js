const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');
const { sequelize } = require('../../database');
const rawQueries = require('./rawQueries');

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

const pushAllCards = async (days, accountId) => {
  try {
    await sequelize.query(rawQueries.pushAllCardsNDays, {
      replacements: {
        days: days,
        accountId: accountId
      },
      model: models.AccountCard,
      type: sequelize.QueryTypes.UPDATE,
      raw: true
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const pushCardsInDeck = async (deckId, days, accountId) => {
  try {
    await sequelize.query(rawQueries.pushCardsInDeckIdNDays, {
      replacements: {
        days: days,
        deckId: deckId,
        accountId: accountId
      },
      model: models.AccountCard,
      type: sequelize.QueryTypes.UPDATE,
      raw: true
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

module.exports = {
  findReviewHistory,
  findDueReviewsCount,
  pushAllCards,
  pushCardsInDeck
};
