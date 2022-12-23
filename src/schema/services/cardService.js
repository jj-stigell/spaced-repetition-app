const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const { sequelize } = require('../../database');
const rawQueries = require('./rawQueries');
const models = require('../../models');
const { Op } = require('sequelize');

const { Sequelize } = require('sequelize');


/**
 * Find card by its id (PK).
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
 * @param {float} easyFactor - float to determine next reviews new interval
 * @param {date} newDueDate - date when card is next due
 * @param {integer} newInterval - new interval in days, used to set card mature
 * @param {string} reviewType - ENUM string of the review, 'RECALL', 'RECOGNISE', etc.
 * @param {date} createdAt - date when card was created, client-side date
 * @returns {AccountCard} newly created account card
 */
const createAccountCard = async (cardId, accountId, easyFactor, newDueDate, newInterval, reviewType, createdAt) => {
  try {
    return await models.AccountCard.create({
      accountId: accountId,
      cardId: cardId,
      dueAt: newDueDate,
      reviewType: reviewType,
      mature: newInterval >= constants.card.matureInterval ? true : false,
      easyFactor: easyFactor ? easyFactor : constants.card.defaultEasyFactor,
      reviewCount: 1,
      createdAt: createdAt
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Add new row to review history.
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} reviewResult - ENUM string representing result of the review
 * @param {string} reviewType - ENUM string of the review, 'RECALL', 'RECOGNISE', etc.
 * @param {boolean} extraReview - if user does more than one review of the card on due date
 * @param {integer} timing - time user spent reviewing the card
 * @param {Date} currentDate - current date for the client, can differ from server date
 * @returns {AccountReview} created account review
 */
const createAccountReview = async (cardId, accountId, reviewResult, reviewType, extraReview, timing, currentDate) => {
  try {
    return await models.AccountReview.create({
      accountId: accountId,
      cardId: cardId,
      result: reviewResult,
      type: reviewType,
      extraReview: extraReview ? true : false,
      timing: timing,
      createdAt: currentDate
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Fetch unreviewed cards from deck.
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
        limitReviews: limitReviews
      },
      model: models.CardList,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });

    if (cardIds.length === 0) return null;

    const idInLearningOrder = cardIds.map(listItem => listItem.id);

    return await models.CardList.findAll({
      where: {
        deckId: deckId,
        id: { [Op.in]: idInLearningOrder }
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
            attributes: ['id', 'kanji', 'jlptLevel', 'onyomi', 'onyomiRomaji', 'kunyomi', 'kunyomiRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: [
              {
                model: models.KanjiTranslation,
                attributes: ['keyword', 'story', 'hint', 'otherMeanings', 'description', 'createdAt', 'updatedAt'],
                where: {
                  language_id: languageId
                },
              },
              {
                model: models.Radical,
                attributes: ['radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: models.RadicalTranslation,
                  attributes: ['translation', 'description', 'createdAt', 'updatedAt'],
                  where: {
                    language_id: languageId
                  }
                },
              }
            ]
          },
          {
            model: models.AccountCard,
            attributes: ['id', 'reviewCount', 'easyFactor', 'dueAt', 'mature', 'createdAt', 'updatedAt'],
            required: false,
            where: {
              accountId: accountId
            }
          },
          {
            model: models.AccountCardCustomData,
            attributes: ['accountStory', 'accountHint']
          },
          {
            model: models.Word,
            attributes: ['id', 'word', 'jlptLevel', 'furigana', 'reading', 'readingRomaji', 'createdAt', 'updatedAt'],
            include: {
              model: models.WordTranslation,
              attributes: ['translation', 'hint', 'description', 'createdAt', 'updatedAt'],
              where: {
                language_id: languageId
              },
            }
          }
        ]
      },
      order: [['learningOrder', 'ASC']]
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Fetch due cards cards from deck
 * @param {integer} deckId - id of the deck
 * @param {integer} accountId - accounts id number
 * @param {integer} limitReviews - how many cards are selected from the deck
 * @param {string} languageId - what translations are used
 * @param {Date} currentDate - current date for the client, can differ from server date
 * @returns {object} cards found
 */
const fetchDueCards = async (deckId, accountId, limitReviews, languageId, currentDate) => {
  try {
    const cardIds = await sequelize.query(rawQueries.selectDueCardIds, {
      replacements: {
        deckId: deckId,
        accountId: accountId,
        limitReviews: limitReviews,
        currentDate: currentDate
      },
      model: models.CardList,
      type: sequelize.QueryTypes.SELECT,
      raw: true
    });

    if (cardIds.length === 0) return null;

    const idInLearningOrder = cardIds.map(listItem => listItem.id);

    return await models.CardList.findAll({
      where: {
        deckId: deckId,
        id: { [Op.in]: idInLearningOrder }
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
            attributes: ['id', 'kanji', 'jlptLevel', 'onyomi', 'onyomiRomaji', 'kunyomi', 'kunyomiRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: [
              {
                model: models.KanjiTranslation,
                attributes: ['keyword', 'story', 'hint', 'otherMeanings', 'description', 'createdAt', 'updatedAt'],
                where: {
                  language_id: languageId
                },
              },
              {
                model: models.Radical,
                attributes: ['radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: models.RadicalTranslation,
                  attributes: ['translation', 'description', 'createdAt', 'updatedAt'],
                  where: {
                    language_id: languageId
                  }
                },
              }
            ]
          },
          {
            model: models.AccountCard,
            attributes: ['id', 'reviewCount', 'easyFactor', 'dueAt', 'mature', 'createdAt', 'updatedAt'],
            required: false,
            where: Sequelize.and(
              { accountId: accountId },
              Sequelize.where(Sequelize.cast(Sequelize.col('card_list.review_type'),'text'), '=', Sequelize.cast(Sequelize.col('card.account_cards.review_type'), 'text'))
            )
          },
          {
            model: models.AccountCardCustomData,
            attributes: ['accountStory', 'accountHint']
          },
          {
            model: models.Word,
            attributes: ['id', 'word', 'jlptLevel', 'furigana', 'reading', 'readingRomaji', 'createdAt', 'updatedAt'],
            include: {
              model: models.WordTranslation,
              attributes: ['translation', 'hint', 'description', 'createdAt', 'updatedAt'],
              where: {
                language_id: languageId
              },
            }
          }
        ]
      },
      order: [['learningOrder', 'ASC']]
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Fetch all cards based on their type. NOTE at the moment, when handling the
 * account card, only the first one is taken when returning to the user.
 * Each card can have two account cards based on review type, 'RECALL' and 'RECOGNISE'
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
          attributes: ['id', 'kanji', 'jlptLevel', 'onyomi', 'onyomiRomaji', 'kunyomi', 'kunyomiRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
          include: [
            {
              model: models.KanjiTranslation,
              attributes: ['keyword', 'story', 'hint', 'otherMeanings', 'description', 'createdAt', 'updatedAt'],
              where: {
                language_id: languageId
              },
            },
            {
              model: models.Radical,
              attributes: ['radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
              include: {
                model: models.RadicalTranslation,
                attributes: ['translation', 'description', 'createdAt', 'updatedAt'],
                where: {
                  language_id: languageId
                }
              },
            }
          ]
        },
        {
          model: models.AccountCard,
          attributes: ['id', 'reviewCount', 'easyFactor', 'dueAt', 'mature', 'createdAt', 'updatedAt'],
          required: false,
          where: {
            accountId: accountId
          }
        },
        {
          model: models.AccountCardCustomData,
          attributes: ['accountStory', 'accountHint']
        },
        {
          model: models.Word,
          attributes: ['id', 'word', 'jlptLevel', 'furigana', 'reading', 'readingRomaji', 'createdAt', 'updatedAt'],
          include: {
            model: models.WordTranslation,
            attributes: ['translation', 'hint', 'description', 'createdAt', 'updatedAt'],
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
 * For example with limitReviews = 3, finds due count for the next 3 days where
 * there are cards due. Only days with reviews are returned, if zero reviews those are omitted.
 * @param {integer} limitReviews - for how many days forward is there due data fetched
 * @param {integer} accountId - accounts id number
 * @param {Date} currentDate - current date for the client, can differ from server date
 * @returns {object} count of due reviews grouped by date
 */
const findDueReviewsCount = async (limitReviews, accountId, currentDate) => {
  try {
    return await sequelize.query(rawQueries.fetchDueReviewsNDays, {
      replacements: {
        limitReviews: limitReviews,
        accountId: accountId,
        currentDate: currentDate
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
 * Cards are divided into three categories {new, learning, mature}.
 * @param {string} cardType - type of the card, 'KANJI', 'WORD', etc.
 * @param {string} reviewType - type of the review, 'RECALL', 'RECOGNISE', etc.
 * @param {integer} accountId - accounts id number
 * @returns {object} grouped by learning status
 */
const findLearningProgressByType = async (cardType , reviewType, accountId) => {
  try {
    return await sequelize.query(rawQueries.groupByTypeAndLearningStatus, {
      replacements: {
        cardType : cardType ,
        accountId: accountId,
        reviewType: reviewType
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
 * @param {Date} currentDate - current date for the client, can differ from server date
 * @param {Date} newDueDate - new due date for cards due today
 * @param {integer} days - number of days for cards with future due date
 * @param {integer} accountId - accounts id number
 */
const pushAllCards = async (currentDate, newDueDate, days, accountId) => {
  try {
    await sequelize.query(rawQueries.pushAllCardsNDays, {
      replacements: {
        currentDate: currentDate,
        newDueDate: newDueDate,
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
 * Push all cards in deck 'deckId' for account with 'accountId'.
 * @param {Date} currentDate - current date for the client, can differ from server date
 * @param {Date} newDueDate - new due date for cards due today
 * @param {integer} days - number of days for cards with future due date
 * @param {integer} accountId - accounts id number
 * @param {integer} deckId - id of the deck
 */
const pushCardsInDeck = async (currentDate, newDueDate, days, accountId, deckId) => {
  try {
    await sequelize.query(rawQueries.pushCardsInDeckNDays, {
      replacements: {
        currentDate: currentDate,
        newDueDate: newDueDate,
        days: days,
        accountId: accountId,
        deckId: deckId
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
 * Find account card (with account specific data) by card and account id.
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} reviewType - ENUM string of the review, 'RECALL', 'RECOGNISE', etc.
 * @returns {AccountCard} found account card
 */
const findAccountCard = async (cardId, accountId, reviewType) => {
  try {
    return await models.AccountCard.findOne({
      where: {
        accountId: accountId,
        cardId: cardId,
        reviewType: reviewType
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find account card (with account specific data) by card and account id.
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @returns {AccountCardCustomData} found account card custom data
 */
const findAccountCardCustomData = async (cardId, accountId) => {
  try {
    return await models.AccountCardCustomData.findOne({
      attributes: ['id', 'accountId', 'cardId', 'accountStory', 'accountHint', 'createdAt', 'updatedAt'],
      where: {
        accountId: accountId,
        cardId: cardId
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create new custom card for the account for the specific card.
 * @param {integer} cardId - id of the card
 * @param {integer} accountId - accounts id number
 * @param {string} story - custom account and card specific story
 * @param {string} hint - custom account and card specific hint
 * @returns 
 */
const createAccountCardCustomData = async (cardId, accountId, story, hint) => {
  try {
    return await models.AccountCardCustomData.create({
      accountId: accountId,
      cardId: cardId,
      accountStory: story ? story : null,
      accountHint: hint ? hint : null
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findCardById,
  createAccountCard,
  createAccountReview,
  fetchNewCards,
  fetchDueCards,
  fetchCardsByType,
  findReviewHistory,
  findDueReviewsCount,
  findLearningProgressByType,
  pushAllCards,
  pushCardsInDeck,
  findAccountCard,
  findAccountCardCustomData,
  createAccountCardCustomData
};
