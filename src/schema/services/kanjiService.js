/* eslint-disable no-unused-vars */
const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');

const findKanjiById = async (kanjiId, languageId) => {
  try {
    return await models.Kanji.findByPk(kanjiId, {
      where: {
        id: kanjiId
      },
      subQuery: false,
      nest: true,
      include: [
        {
          model: models.KanjiTranslation,
          where: {
            language_id: languageId
          }
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
    });
  } catch (error) {
    return internalServerError(error);
  }
};

const findAllKanji = async (languageId, accountId) => {
  try {
    return await models.Card.findAll({
      where: {
        type: 'kanji',
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
        }
      ]
    });
  } catch (error) {
    return internalServerError(error);
  }
};

const findKanjiCardById = async (cardId, languageId, accountId) => {
  try {
    return await models.Card.findOne({
      where: {
        id: cardId,
        type: 'kanji',
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
        }
      ]
    });
  } catch (error) {
    return internalServerError(error);
  }
};


module.exports = {
  findKanjiById,
  findAllKanji,
  findKanjiCardById
};
