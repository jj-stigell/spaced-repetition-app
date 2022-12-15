const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');
const { sequelize } = require('../../database');
const { Op } = require('sequelize');
const constants = require('../../util/constants');
const rawQueries = require('./rawQueries');

/**
 * Find card by its id (PK)
 * @param {integer} cardId - id of the card
 * @returns {Card} card found
 */
const findCardById = async (cardId) => {
  try {
    return await models.Card.findByPk(cardId);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Creates a new account card, can be during review.
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} story - custom account specific story
 * @param {string} hint - custom account specific hint
 * @param {float} easyFactor - float to determine next reviews new interval
 * @param {date} newDueDate - date when card is next due
 * @param {integer} newInterval - new interval in days, used to set card mature
 * @param {boolean} isReview - if review; dueAt and mature also set
 * @returns {AccountCard} newly created account card
 */
const createAccountCard = async (cardId, accountId, story, hint, easyFactor, newDueDate, newInterval, isReview) => {
  try {
    if (isReview) {
      return await models.AccountCard.create({
        accountId: accountId,
        cardId: cardId,
        dueAt: newDueDate,
        mature: newInterval > constants.matureInterval ? true : false,
        easyFactor: easyFactor ? easyFactor : constants.card.defaultEasyFactor,
        reviewCount: 1,
        accountStory: story ? story : null,
        accountHint: hint ? hint : null
      });
    }

    return await models.AccountCard.create({
      accountId: accountId,
      cardId: cardId,
      reviewCount: 0,
      easyFactor: constants.card.defaultEasyFactor,
      accountStory: story ? story : null,
      accountHint: hint ? hint : null
    });

  } catch (error) {
    return internalServerError(error);
  }
};


/**
 * Update existing account card
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} story - custom account specific story
 * @param {string} hint - custom account specific hint
 * @returns 
 */
const updateAccountCard = async (cardId, accountId, story, hint) => {
  try {
    return await models.AccountCard.create({
      accountId: accountId,
      cardId: cardId,
      easyFactor: constants.card.defaultEasyFactor,
      reviewCount: 0,
      accountStory: story ? story : null,
      accountHint: hint ? hint : null
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Add new row to review history
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} reviewResult - ENUM string representing result of the review
 * @param {boolean} extraReview - if user does more than one review of the card on due date
 * @param {integer} timing - time user spent reviewing the card
 * @returns {AccountReview} created account review
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
    return internalServerError(error);
  }
};

/**
 * Fetch unreviewed cards from deck
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - how many cards are taken from the deck
 * @param {string} languageId - what translations are used
 * @returns {object} cards found
 */
const fetchNewCards = async (deckId, accountId, limitReviews, languageId) => {
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

    if (cardIds.length === 0) return null;

    const idInLearningOrder = cardIds.map(listItem => listItem.card_id);

    const cards = await models.CardList.findAll({
      where: {
        deckId: deckId,
        cardId: { [Op.in]: idInLearningOrder }
      },
      subQuery: false,
      nest: true,
      include: {
        model: models.Card,
        where: {
          active: true
        },
        include: [
          {
            model: models.Kanji,
            include: [
              {
                model: models.KanjiTranslation,
                where: {
                  language_id: languageId
                },
              },
              {
                model: models.Radical,
                attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: models.RadicalTranslation,
                  where: {
                    language_id: languageId
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
                language_id: languageId
              },
            }
          }
        ]
      },
      order: [['learningOrder', 'ASC']]
    });

    return cards;
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Fetch unreviewed cards from deck
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - how many cards are taken from the deck
 * @param {string} languageId - what translations are used
 * @returns {object} cards found
 */
const fetchDueCards = async (deckId, accountId, limitReviews, languageId) => {
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

    if (cardIds.length === 0) return null;

    const idInLearningOrder = cardIds.map(listItem => listItem.card_id);

    const cards = await models.CardList.findAll({
      where: {
        deckId: deckId,
        cardId: { [Op.in]: idInLearningOrder }
      },
      subQuery: false,
      nest: true,
      include: {
        model: models.Card,
        where: {
          active: true
        },
        include: [
          {
            model: models.Kanji,
            include: [
              {
                model: models.KanjiTranslation,
                where: {
                  language_id: languageId
                },
              },
              {
                model: models.Radical,
                attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: models.RadicalTranslation,
                  where: {
                    language_id: languageId
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
                language_id: languageId
              },
            }
          }
        ]
      },
      order: [['learningOrder', 'ASC']]
    });
    return cards;
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Fetch all cards based on their type
 * @param {string} cardType - type of the car, 'KANJI', 'WORD', etc.
 * @param {integer} accountId - accounts id number
 * @param {string} languageId - what translations are used
 * @returns {object} cards found
 */
const fetchCardsByType = async (cardType, accountId, languageId) => {
  try {
    return await models.Card.findAll({
      where: {
        type: cardType,
        active: true
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
                language_id: languageId
              },
            },
            {
              model: models.Radical,
              attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
              include: {
                model: models.RadicalTranslation,
                where: {
                  language_id: languageId
                }
              },
            }
          ]
        },
        {
          model: models.AccountCard,
          required: false,
          where: {
            accountId: accountId
          }
        },
        {
          model: models.Word,
          include: {
            model: models.WordTranslation,
            where: {
              language_id: languageId
            },
          }
        }
      ]
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find how many reviews account has made in the past 'limitReviews' days.
 * Only days with reviews are returned, if zero reviews those are omitted.
 * @param {integer} limitReviews - for how many days back is history fetched
 * @param {integer} accountId - accounts id number
 * @returns {object} count of past reviews grouped by date
 */
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
    return internalServerError(error);
  }
};

/**
 * Find how many reviews account has due in the future for 'limitReviews' days.
 * Only days with reviews are returned, if zero reviews those are omitted.
 * @param {integer} limitReviews - for how many days forward is there due data fetched
 * @param {integer} accountId - accounts id number
 * @returns {object} count of due reviews grouped by date
 */
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
    return internalServerError(error);
  }
};

/**
 * Find learning progress by card type.
 * Set to three categories {new, learning, mature}.
 * @param {string} cardType - type of the car, 'KANJI', 'WORD', etc.
 * @param {integer} accountId - accounts id number
 * @returns {object} grouped by learning status
 */
const findLearningProgressByType = async (cardType , accountId) => {
  try {
    return await sequelize.query(rawQueries.groupByTypeAndLearningStatus, {
      replacements: {
        cardType : cardType ,
        accountId: accountId
      },
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Push all cards in to the future for account with 'accountId'
 * @param {integer} days - how many days cards are pushed forward
 * @param {integer} accountId - accounts id number
 */
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
    return internalServerError(error);
  }
};

/**
 * Push all cards in deck 'deckId' for account with 'accountId'
 * @param {integer} deckId - id of the deck
 * @param {integer} days - how many days cards are pushed forward
 * @param {integer} accountId - accounts id number
 */
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
    return internalServerError(error);
  }
};

/**
 * Find account card (with account specific data) by card and account id
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @returns {AccountCard} found account card
 */
const findAccountCard = async (cardId, accountId) => {
  try {
    return await models.AccountCard.findOne({
      where: {
        accountId: accountId,
        cardId: cardId
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findCardById,
  createAccountCard,
  updateAccountCard,
  createAccountReview,
  fetchNewCards,
  fetchDueCards,
  fetchCardsByType,
  findReviewHistory,
  findDueReviewsCount,
  findLearningProgressByType,
  pushAllCards,
  pushCardsInDeck,
  findAccountCard
};
