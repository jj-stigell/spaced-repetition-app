/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { DeckCategory, FormattedDeckData, HttpCode, JlptLevel, JwtPayload, Role } from '../type';
import { findAccountById } from './utils/account';
import { idSchema } from './utils/validator';
import { findDeckById } from './utils/deck';
import CardList from '../database/models/cardList';
import Card from '../database/models/card';
import { ApiError } from '../class';

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
      .notRequired()
  });

  const { language }: { language: string | undefined } = await requestSchema.validate(
    req.query, { abortEarly: false }
  );

  const languageId: string = language ?? 'EN';
  const deckId: number = Number(req.params.deckId);
  await idSchema.validate({ id: deckId });

  // Check deck exists.
  const deck: Deck = await findDeckById(deckId);
  const account: Account = await findAccountById(230793, true);

  if (deck.memberOnly && account.role === Role.NON_MEMBER) {
    throw new ApiError('deck only for members', HttpCode.Forbidden);
  }

  const cache: string | null = await redisClient.get(`deck:${deckId}:lang${languageId}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cards: Array<any> = [];

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
        required: true
      },
      order: [['learningOrder', 'ASC']]
    });

    cards = cardList.map((card: any) => {
      return {
        id: card.cardId,
        learningOrder: card.learningOrder,
        reviewType: card.reviewType,
        cardType: card.card.type
      };
    });

    // Set to cache with 10 hour expiry time.
    await redisClient.set(`deck:${deckId}:lang${languageId}`, JSON.stringify(cards), { EX: 36000 });
  }

  // Check translation available
  // Server correct translation if available to the user
  // Format cards to match client layout

  res.status(HttpCode.Ok).json({
    data: cards
  });
}

// SELECT category, decks FROM study_category WHERE jlpt_level = 1 ORDER BY category ASC;

/*
count finished decks for the user to display progress

{
  category: 'KANJI',
  decks: 10,
  progress: 5
}

decks 10

count deck where category = KANJI and level

SELECT COUNT(*) FROM deck
JOIN account_deck_settings
ON deck.id = account_deck_settings.deck_id deck.category = KANJI AND deck.jlpt_level = 1
AND account_deck_settings.mastered = TRUE;
*/

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

    type DeckTranslationData = {
      id: number,
      deckId: number,
      languageId: string,
      title: string,
      description: string,
      active: boolean,
      createdAt: Date,
      updatedAt: Date
    }

    type DeckData = {
      id: number;
      jlptLevel: number;
      deckName: string;
      cards: number;
      category: string;
      memberOnly: boolean;
      languageId: string;
      active: boolean;
      createdAt: Date;
      updatedAt: Date;
      DeckTranslations: Array<DeckTranslationData>
    }

    const decks: Array<DeckData> = await models.Deck.findAll({
      where: {
        jlptLevel: level,
        category
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
    // TODO, use token user information
    //const user: JwtPayload = req.user as JwtPayload;
    const account: Account = await findAccountById(230795);

    if (account.role !== Role.NON_MEMBER) {
      // TODO, replace placeholder data with data from DB.
      formattedDecks = formattedDecks.map((deck: FormattedDeckData) => {
        return {
          ...deck,
          favorite: true,
          progress: {
            new: 5,
            learning: 6,
            mature: 3
          }
        };
      });
    }
  }

  res.status(HttpCode.Ok).json({
    data: formattedDecks
  });
}
