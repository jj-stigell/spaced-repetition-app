const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');
const { sequelize } = require('../../database');
const { Op } = require('sequelize');
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

/**
 * Add new row to review history
 * @param {*} cardId 
 * @param {*} accountId 
 * @param {*} reviewResult 
 * @param {*} extraReview 
 * @param {*} timing 
 * @returns 
 */
const createAccountReview = async (cardId, accountId, reviewResult, extraReview, timing) => {
  try {
    return await models.AccountReview.create({
      accountId: accountId,
      cardId: cardId,
      result: reviewResult,
      extraReview: extraReview ? true : false,
      timing: timing
    });
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const fetchNewCards = async (deckId, accountId, limitReviews, selectedLanguage) => {
  try {
    const cardIds = await sequelize.query(rawQueries.selectNewCardIds, {
      replacements: {
        deckId: deckId,
        accountId: accountId,
        limitReviews: limitReviews,
      },
      model: models.CardList,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });

    const idInLearningOrder = cardIds.map(listItem => listItem.card_id);

    const cards = await models.Card.findAll({
      where: {
        'id': { [Op.in]: idInLearningOrder },
        'active': true
      },
      subQuery: false,
      nest: true,
      include: [
        {
          model: models.Kanji,
          include: [
            {
              model: models.KanjiTranslation,
              where: {
                language_id: selectedLanguage
              },
            },
            {
              model: models.Radical,
              attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
              include: {
                model: models.RadicalTranslation,
                where: {
                  language_id: selectedLanguage
                }
              },
            }
          ]
        },
        {
          model: models.Word,
          include: {
            model: models.WordTranslation,
            where: {
              language_id: selectedLanguage
            },
          }
        }
      ]
    });

    if (cardIds.length === 0) return null;

    cards.sort(function (a, b) {
      return idInLearningOrder.indexOf(a.id) - idInLearningOrder.indexOf(b.id);
    });

    return cards;
  } catch (error) {
    console.log(error);
    return internalServerError();
  }
};

const fetchDueCards = async (deckId, accountId, limitReviews, selectedLanguage) => {
  try {

    const cardIds = await sequelize.query(rawQueries.selectDueCardIds, {
      replacements: {
        deckId: deckId,
        accountId: accountId,
        limitReviews: limitReviews,
      },
      model: models.CardList,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });

    const idInLearningOrder = cardIds.map(listItem => listItem.card_id);

    const cards = await models.Card.findAll({
      where: {
        'id': { [Op.in]: idInLearningOrder },
        'active': true
      },
      subQuery: false,
      nest: true,
      include: [
        {
          model: models.Kanji,
          include: [
            {
              model: models.KanjiTranslation,
              where: {
                language_id: selectedLanguage
              },
            },
            {
              model: models.Radical,
              attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
              include: {
                model: models.RadicalTranslation,
                where: {
                  language_id: selectedLanguage
                }
              },
            }
          ]
        },
        {
          model: models.AccountCard,
          where: {
            accountId: accountId
          }
        },
        {
          model: models.Word,
          include: {
            model: models.WordTranslation,
            where: {
              language_id: selectedLanguage
            },
          }
        }
      ]
    });

    if (cardIds.length === 0) return null;

    cards.sort(function (a, b) {
      return idInLearningOrder.indexOf(a.id) - idInLearningOrder.indexOf(b.id);
    });

    return cards;
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
  createAccountReview,
  fetchNewCards,
  fetchDueCards,
  findReviewHistory,
  findDueReviewsCount,
  pushAllCards,
  pushCardsInDeck,
  findAccountCard
};
