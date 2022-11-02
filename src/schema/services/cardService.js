const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');
const rawQueries = require('./rawQueries');

const findCardById = async (cardId) => {
  try {
    return await models.AccountCard.findByPk(cardId);
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const createAccountCard = async (cardId, accountId, story, hint) => {
  try {
    return await models.AccountCard.create({
      accountId: accountId,
      cardId: cardId,
      dueAt: sequelize.DataTypes.NOW,
      easyFactor: constants.defaultEasyFactor,
      reviewCount: 0,
      accountStory: story ? story : null,
      accountHint: hint ? hint : null
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const updateAccountCard = async (cardId, accountId, story, hint) => {
  try {
    return await models.AccountCard.create({
      accountId: accountId,
      cardId: cardId,
      dueAt: sequelize.DataTypes.NOW,
      easyFactor: constants.defaultEasyFactor,
      reviewCount: 0,
      accountStory: story ? story : null,
      accountHint: hint ? hint : null
    });
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

const findAccountCard = async (cardId, accountId) => {
  try {
    return await models.AccountCard.findOne({
      where: {
        accountId: accountId,
        cardId: cardId
      }
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

module.exports = {
  findCardById,
  createAccountCard,
  updateAccountCard,
  findReviewHistory,
  findDueReviewsCount,
  pushAllCards,
  pushCardsInDeck,
  findAccountCard
};
