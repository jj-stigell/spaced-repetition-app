import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import * as yup from 'yup';

import { validationErrors } from '../configs/errorCodes';
import { redisClient } from '../configs/redis';
import logger from '../configs/winston';
import { sequelize } from '../database';
import Account from '../database/models/account';
import { Category, HttpCode, JlptLevel, JwtPayload, Role } from '../type';
import { findAccountById } from './utils/account';

/**
 * Get all available categories based on JLPT level.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If categories not found.
 */
export async function categories(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    level: yup.number()
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .oneOf(
        [JlptLevel.N1, JlptLevel.N2, JlptLevel.N3, JlptLevel.N4, JlptLevel.N5,],
        validationErrors.ERR_INVALID_JLPT_LEVEL)
      .required(validationErrors.ERR_JLPT_LEVEL_REQUIRED)
  });

  const { level }: { level: number }  =
  await requestSchema.validate(req.query, { abortEarly: false });

  const cache: string | null = await redisClient.get(`categoryN${level}`);
  let categories: Array<Category> = [];

  if (!cache) {
    logger.info('No cache hit on categories, querying db');

    categories = await sequelize.query(
      `SELECT
        category,
        decks::INTEGER
      FROM
        study_category
      WHERE
        jlpt_level = :level
      ORDER BY
        category ASC;`,
      {
        replacements: { level },
        type: QueryTypes.SELECT
      }
    );

    const data: string = JSON.stringify(categories);
    // Set to cache with 10 hour expiry time.
    await redisClient.set(`categoryN${level}`, data, { EX: 10 * 60 * 60 });
  } else {
    logger.info('Cache hit on categories in redis');
    categories = JSON.parse(cache);
  }

  if (categories.length !== 0) {
    const user: JwtPayload = req.user as JwtPayload;
    const account: Account = await findAccountById(user.id);

    if (account.role !== Role.NON_MEMBER) {
      categories = categories.map((category: Category): Category => {
        return {
          ...category,
          progress: {
            // TODO implement progress search for member users.
            // Temporary place holders.
            new: 3,
            learning: 4,
            mature: 6
          }
        };
      });
    }
  }

  res.status(HttpCode.Ok).json({
    data: categories
  });
}
