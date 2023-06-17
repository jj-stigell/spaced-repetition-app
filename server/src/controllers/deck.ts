import { Request, Response } from 'express';
import { Op } from 'sequelize';
import * as yup from 'yup';

import { validationErrors } from '../configs/errorCodes';
import { redisClient } from '../configs/redis';
import logger from '../configs/winston';
import models from '../database/models';
import Account from '../database/models/account';
import Deck from '../database/models/deck';
import DeckTranslation from '../database/models/deckTranslation';
import {
  DeckCategory, DeckData, DeckTranslationData,
  FormattedDeckData, HttpCode, JlptLevel, JwtPayload, Role, StudyCard
} from '../type';
import { findAccountById } from './utils/account';
import { idSchema } from './utils/validator';
import { findDeckById } from './utils/deck';
import Card from '../database/models/card';
import AnswerOption from '../database/models/answerOption';
import { ApiError } from '../class';
import Kanji from '../database/models/kanji';
import Vocabulary from '../database/models/vocabulary';
import Kana from '../database/models/kana';
import { CardData, cardFormatter } from './utils/card';

/**
 * Get all cards belonging to a deck.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function cardsFromDeck(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    language: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired(),
    dueonly: yup.boolean()
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired(),
  });

  const { language, dueonly }: {
    language: string | undefined,
    dueonly: boolean | undefined
  } = await requestSchema.validate(
    req.query, { abortEarly: false }
  );

  let languageId: string = language ?? 'EN';
  const deckId: number = Number(req.params.deckId);
  await idSchema.validate({ id: deckId });

  // Check deck exists and is active.
  const deck: Deck = await findDeckById(deckId);
  // const userData: JwtPayload = req.user as JwtPayload;
  const account: Account = await findAccountById(230792, true);

  if (deck.memberOnly && account.role === Role.NON_MEMBER) {
    // TODO: add proper error code
    throw new ApiError('deck only for members', HttpCode.Forbidden);
  }

  if (dueonly && account.role === Role.NON_MEMBER) {
    // TODO: add proper error code
    throw new ApiError('due only cards is a member feature', HttpCode.Forbidden);
  }

  let cards: Array<StudyCard> = [];

  const deckTranslation: DeckTranslation | null = await DeckTranslation.findOne({
    where: {
      deckId: deck.id,
      languageId
    }
  });

  if (!deckTranslation || !deckTranslation.active) {
    languageId = 'EN';
  }

  if (dueonly) {
    // TODO, do only requires SRS functionality.
    cards = [];
  } else {
    const cache: string | null = await redisClient.get(`deck:${deckId}:lang${languageId}`);

    if (cache) {
      logger.info(`Cache hit on cards in redis, language ${languageId}`);
      cards = JSON.parse(cache);
    } else {
      logger.info('No cache hit on cards, querying db');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardList: Array<any> = await models.CardList.findAll({
        where: {
          deckId
        },
        include: {
          model: Card,
          required: true,
          include: [
            { model: AnswerOption,
              where: {
                languageId
              }
            },
            { model: Kanji },
            { model: Vocabulary },
            { model: Kana }
          ]
        },
        order: [['learningOrder', 'ASC']]
      });

      cards = cardFormatter(cardList as unknown as Array<CardData>);

      // Set to cache with 10 hour expiry time.
      await redisClient.set(
        `deck:${deckId}:lang${languageId}`, JSON.stringify(cards), { EX: 36000 }
      );
    }
  }

  res.status(HttpCode.Ok).json({
    data: cards
  });
}

/**
 * Get all decks based on category and JLPT level.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function decks(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    level: yup.number()
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .oneOf(
        [JlptLevel.N1, JlptLevel.N2, JlptLevel.N3, JlptLevel.N4, JlptLevel.N5],
        validationErrors.ERR_INVALID_JLPT_LEVEL)
      .required(validationErrors.ERR_JLPT_LEVEL_REQUIRED),
    category: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .oneOf(
        Object.values(DeckCategory),
        validationErrors.ERR_INVALID_CATEGORY)
      .required(validationErrors.ERR_CATEGORY_REQUIRED),
    language: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired()
  });

  const { level, category, language }:
  { level: number, category: string, language: string | undefined }  =
  await requestSchema.validate(req.query, { abortEarly: false });

  const languageId: string = language ?? 'EN';
  const cache: string | null = await redisClient.get(
    `decks:n${level}:lang${languageId}:cat${category}`
  );
  let formattedDecks: Array<FormattedDeckData> = [];

  if (cache) {
    logger.info(`Cache hit on decks in redis, language ${languageId}`);
    formattedDecks = JSON.parse(cache);
  } else {
    logger.info('No cache hit on decks, querying db');

    const decks: Array<DeckData> = await models.Deck.findAll({
      where: {
        jlptLevel: level,
        category,
        active: true
      },
      include: {
        model: DeckTranslation,
        required: false,
        where: {
          active: true,
          languageId: {
            [Op.or]: [languageId, 'EN']
          }
        }
      }
    }) as unknown as Array<DeckData>;

    formattedDecks = decks.map((deck: DeckData): FormattedDeckData => {
      // Check if language specific translation exists.
      const translation: DeckTranslationData | undefined = deck.DeckTranslations.find(
        (translation: DeckTranslationData) => translation.languageId === languageId
      );

      // English translation always exists.
      const defaultTranslation: DeckTranslationData = deck.DeckTranslations.find(
        (translation: DeckTranslationData) => translation.languageId === 'EN'
      ) as DeckTranslationData;

      return {
        id: deck.id,
        memberOnly: deck.memberOnly,
        translationAvailable: translation ? true : false,
        title: translation?.title ?? defaultTranslation.title,
        description: translation?.description ?? defaultTranslation.description,
        cards: deck.cards,
      };
    });

    // Set to cache with 10 hour expiry time.
    await redisClient.set(
      `decks:n${level}:lang${languageId}:cat${category}`,
      JSON.stringify(formattedDecks), { EX: 36000 }
    );
  }

  if (decks.length !== 0) {
    const user: JwtPayload = req.user as JwtPayload;
    const account: Account = await findAccountById(user.id);

    if (account.role !== Role.NON_MEMBER) {
      // TODO, replace placeholder data with data from DB.
      formattedDecks = formattedDecks.map((deck: FormattedDeckData) => {
        return {
          ...deck,
          favorite: true,
          progress: {
            new: 6,
            learning: 4,
            mature: 2
          }
        };
      });
    }
  }

  res.status(HttpCode.Ok).json({
    data: formattedDecks
  });
}
