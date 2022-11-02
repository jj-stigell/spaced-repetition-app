/* eslint-disable no-unused-vars */
const validator = require('validator');
const { Op } = require('sequelize');
const {
  Deck,
  DeckTranslation,
  AccountDeckSettings,
  Kanji,
  Radical,
  RadicalTranslation,
  Card,
  CardList,
  KanjiTranslation,
  AccountCard,
  AccountReview,
  Word,
  WordTranslation
} = require('../../models');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const { validateFetchKanji } = require('../../util/validation/schema');
const formatYupError = require('../../util/errors/errorFormatter');

const typeDefs = `
  scalar Date

  type Error {
    errorCodes: [String!]
  }

  type AccountCard {
    id: Int
    reviewCount: Int
    easyFactor: Float
    accountStory: String
    accountHint: String
    dueAt: Date
  }

  type KanjiTranslation {
    keyword: String
    story: String
    hint: String
    otherMeanings: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type RadicalTranslation {
    translation: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type Radical {
    radical: String
    reading: String
    readingRomaji: String
    strokeCount: Int
    createdAt: Date
    updatedAt: Date
    radical_translations: [RadicalTranslation]
  }

  type Kanji {
    id: Int
    kanji: String
    jlptLevel: Int
    onyomi: String
    onyomiRomaji: String
    kunyomi: String
    kunyomiRomaji: String
    strokeCount: Int
    createdAt: Date
    updatedAt: Date
    kanji_translations: [KanjiTranslation]
    radicals: [Radical]
  }

  type Kanjiset {
    KanjiList: [Kanji]
  }

  union KanjiCardPayload = Kanjiset | Kanji | Error

  type Query {
    fetchKanji(
      kanjiId: Int
      includeAccountCard: Boolean
    ): KanjiCardPayload!
  }
`;

const resolvers = {
  Query: {
    fetchKanji: async (_, { kanjiId, includeAccountCard }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateFetchKanji.validate({ kanjiId, includeAccountCard }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }


      if (kanjiId) {
        //fecth only one kanji by id, include accountcard if includeAccountCard TRUE
      }


      let kanjiList;
      try {
        kanjiList = await Kanji.findAll({
          //where: { 'type': 'kanji' },
          subQuery: false,
          nest: true,
          raw: true,
          //include: { model: Kanji },
          order: [['id', 'ASC']],
        });
      } catch(error) {
        console.log(error);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      //console.log('found cards:', kanjiList);

      // No deck found with an id
      if (kanjiList.length === 0) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.noCardsFound]
        };
      }

      return {
        __typename: 'Kanjiset',
        KanjiList: kanjiList
      };
    },
  },
  Mutation: {
  }
};

module.exports = {
  typeDefs,
  resolvers
};
