import { bugErrors } from '../../configs/errorCodes';
import BugReport from '../../database/models/bugReport';
import { ApiError } from '../../class';
import { HttpCode } from '../../type';

/**
 * Finds a bug report by its ID.
 * @param {number} id - The ID of the bug report to be found.
 * @returns {Promise<BugReport>} - A promise that resolves with the found bug report model object.
 * @throws {ApiError} - If the bug report is not found, it throws an error with a message
 * indicating the missing bug report with the specific ID.
 */
export async function findBugReportById(id: number): Promise<BugReport> {
  const bugReport: BugReport | null = await BugReport.findByPk(id);
  if (!bugReport) {
    throw new ApiError(bugErrors.ERR_BUG_BY_ID_NOT_FOUND, HttpCode.NotFound);
  }
  return bugReport;
}
