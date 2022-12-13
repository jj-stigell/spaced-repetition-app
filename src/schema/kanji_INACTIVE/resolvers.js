/* eslint-disable no-unused-vars */
const models = require('../../models');
const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');

const resolvers = {
  Query: {
    fetchKanji: async (_, { kanjiId, languageId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateFetchKanji(kanjiId, false, languageId);
      const selectedLanguage = languageId ? languageId : 'en';
      const kanji = await services.kanjiService.findKanjiById(kanjiId, selectedLanguage);

      if (kanji.length === null) return graphQlErrors.defaultError(errors.noCardsFound);
      return kanji;
    },
    fetchAllKanji: async (_, { languageId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateFetchKanji(1, true, languageId);
      const selectedLanguage = languageId ? languageId : 'en';
      const allKanji = await services.kanjiService.findAllKanji(selectedLanguage, currentUser.id);

      if (allKanji.length === 0) return graphQlErrors.defaultError(errors.noCardsFound);

      console.log(allKanji);

      return allKanji;
    },
    fetchKanjiCard: async (_, { cardId, languageId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      //await validator.validateFetchKanji(1, true, languageId);
      const selectedLanguage = languageId ? languageId : 'en';
      const kanjiCard = await services.kanjiService.findKanjiCardById(cardId, selectedLanguage, currentUser.id);

      if (kanjiCard === null) return graphQlErrors.defaultError(errors.noCardsFound);

      console.log(kanjiCard);

      return kanjiCard;
    },
  },
  Mutation: {
  }
};

module.exports = resolvers;
