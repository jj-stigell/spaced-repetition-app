import { Request, Response } from 'express';
import * as yup from 'yup';

import { bugs } from '../configs/constants';
import { bugErrors, validationErrors } from '../configs/errorCodes';
import { HttpCode } from '../type/httpCode';
import BugReport from '../database/models/bugReport';
import models from '../database/models';
import {
  BugReportData, BugReportOptions, BugReportQueryParams, JwtPayload, SolvedBugReportData
} from '../type/general';
import { findBugReportById } from './utils/bugReport';
import { findCardById } from './utils/card';
import { idSchema } from './utils/validator';

/**
 * Get all bugs, filtering by type and pagination optional.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If optional param validation fails.
 */
export async function getBugReports(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    type: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(bugs.BUG_TYPES, bugErrors.ERR_INVALID_BUG_TYPE)
      .notRequired(),
    page: yup.number()
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .min(1, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER)
      .notRequired(),
    limit: yup.number()
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .min(1, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER)
      .max(bugs.BUG_REPORTS_PER_PAGE_MAX, bugErrors.ERR_BUG_PAGELIMIT_EXCEEDED)
      .notRequired()
  });

  const { type, page, limit }: BugReportQueryParams = await requestSchema.validate(
    req.query, { abortEarly: false }
  );

  const options: BugReportOptions = {
    where: {},
    limit: bugs.BUG_REPORTS_PER_PAGE_MAX,
    offset: 0
  };

  if (type) {
    options.where = { type };
  }

  if (page && limit) {
    options.limit = limit;
    options.offset = (page - 1) * limit;
  }

  const bugReports: Array<BugReport> = await BugReport.findAll(options);

  res.status(HttpCode.Ok).json({
    data: bugReports
  });
}

/**
 * Get one bug by its primary key id.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If bug not found.
 */
export async function getBugReportById(req: Request, res: Response): Promise<void> {
  const bugId: number = Number(req.params.bugId);
  await idSchema.validate({ id: bugId });
  const bugReport: BugReport = await findBugReportById(bugId);

  res.status(HttpCode.Ok).json({
    data: bugReport
  });
}

/**
 * Create a new bug report.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If body validation fails.
 */
export async function createBugReport(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    type: yup.string()
      .oneOf(bugs.BUG_TYPES, bugErrors.ERR_INVALID_BUG_TYPE)
      .required(validationErrors.ERR_INPUT_VALUE_MISSING),
    bugMessage: yup.string()
      .min(bugs.BUG_MESSAGE_MIN_LENGTH, bugErrors.ERR_BUG_MESSAGE_TOO_SHORT)
      .max(bugs.BUG_MESSAGE_MAX_LENGTH, bugErrors.ERR_BUG_MESSAGE_TOO_LONG)
      .required(validationErrors.ERR_INPUT_VALUE_MISSING),
    cardId: yup.number()
      .min(1, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER)
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired()
  });

  const { type, bugMessage, cardId }: BugReportData = await requestSchema.validate(
    req.body, { abortEarly: false }
  );
  const user: JwtPayload = req.user as JwtPayload;

  if (cardId) {
    await findCardById(cardId);
  }

  const newBugReport: BugReport =  await models.BugReport.create({
    accountId: user.id,
    cardId,
    type,
    bugMessage
  });

  res.status(HttpCode.Ok).json({
    data: {
      id: newBugReport.id
    }
  });
}

/**
 * Delete existing bug report.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If body validation fails.
 * @throws {ApiError} - If bug with an id not found.
 */
export async function deleteBugReport(req: Request, res: Response): Promise<void> {
  const bugId: number = Number(req.params.bugId);
  await idSchema.validate({ id: bugId });
  const bugReport: BugReport = await findBugReportById(bugId);
  await bugReport.destroy();

  res.status(HttpCode.Ok).json();
}

/**
 * Update existing bug report.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If body validation fails.
 * @throws {ApiError} - If bug with an id not found.
 */
export async function updateBugReport(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    type: yup.string()
      .oneOf(bugs.BUG_TYPES, bugErrors.ERR_INVALID_BUG_TYPE)
      .notRequired(),
    bugMessage: yup.string()
      .min(bugs.BUG_MESSAGE_MIN_LENGTH, bugErrors.ERR_BUG_MESSAGE_TOO_SHORT)
      .max(bugs.BUG_MESSAGE_MAX_LENGTH, bugErrors.ERR_BUG_MESSAGE_TOO_LONG)
      .notRequired(),
    solvedMessage: yup.string()
      .min(bugs.SOLVED_MESSAGE_MIN_LENGTH, bugErrors.ERR_BUG_SOLVE_MESSAGE_TOO_SHORT)
      .max(bugs.SOLVED_MESSAGE_MAX_LENGTH, bugErrors.ERR_BUG_SOLVE_MESSAGE_TOO_LONG)
      .notRequired(),
    solved: yup.boolean()
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired(),
    cardId: yup.number()
      .min(1, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER)
      .integer(validationErrors.ERR_INPUT_TYPE)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired()
  });

  const bugId: number = Number(req.params.bugId);
  await idSchema.validate({ id: bugId });

  const { type, bugMessage, cardId, solvedMessage, solved }: BugReportData & SolvedBugReportData =
  await requestSchema.validate(req.body, { abortEarly: false });

  if (cardId) {
    await findCardById(cardId);
  }

  const bugReport: BugReport = await findBugReportById(bugId);

  await bugReport.update({
    type: type ?? bugReport.type,
    bugMessage: bugMessage ?? bugReport.bugMessage,
    cardId: cardId ?? bugReport.cardId,
    solvedMessage: solvedMessage ?? bugReport.solvedMessage,
    solved: solved ?? bugReport.solved
  });
  await bugReport.save();

  res.status(HttpCode.Ok).json();
}
