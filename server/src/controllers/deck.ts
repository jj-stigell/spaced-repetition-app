import { Request, Response } from 'express';
import * as yup from 'yup';
import { HttpCode } from '../type/httpCode';

import { idSchema } from './utils/validator';

/**
 * Get all cards belonging to a deck.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function cardsFromDeck(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    languageid: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired()
  });

  const languageid: string | undefined = await requestSchema.validate(
    req.query.languageid, { abortEarly: false }
  );

  const deckId: number = Number(req.params.bugId);
  await idSchema.validate({ id: deckId });

  // Check user is allowed to access deck

  // Check redis cache for cached cards, deckId+langId

  // Check deck exists

  // Check translation available

  // Server correct translation if available to the user

  // Format cards to match client layout

  res.status(HttpCode.Ok).json({
    data: {}
  });
}

/**
 * Get all cards belonging to a deck.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function decks(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    languageid: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired()
  });

  const languageid: string | undefined = await requestSchema.validate(
    req.query.languageid, { abortEarly: false }
  );

  const deckId: number = Number(req.params.bugId);
  await idSchema.validate({ id: deckId });

  // Check user is allowed to access deck

  // Check redis cache for cached cards, deckId+langId

  // Check deck exists

  // Check translation available

  // Server correct translation if available to the user

  // Format cards to match client layout

  res.status(HttpCode.Ok).json({
    data: {}
  });
}