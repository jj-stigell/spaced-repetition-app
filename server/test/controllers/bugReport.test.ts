import supertest from 'supertest';

import { app } from '../../src/app';
import { bugs } from '../../src/configs/constants';
import models from '../../src/database/models';
import {
  bugErrors, cardErrors, generalErrors, validationErrors
} from '../../src/configs/errorCodes';
import { BUGREPORT_URI } from '../utils/constants';
import { checkErrors, getCookies, resetDatabase } from '../utils/helpers';
import BugReport from '../../src/database/models/bugReport';
import { BugReportData, SolvedBugReportData, HttpCode } from '../../src/type';

const request: supertest.SuperTest<supertest.Test> = supertest(app);
let res: supertest.Response;
let userCookies: Array<string> = [];
let adminReadCookies: Array<string> = [];
let adminWriteCookies: Array<string> = [];
let superuserCookies: Array<string> = [];
const nonValidId: string = 'x';
const nonExistingId: number = 99999;

const validBugReport: BugReportData = {
  bugMessage: 'This is message for the bug report for integration tests',
  type: 'UI',
  cardId: 23
};

const solveBugReport: SolvedBugReportData = {
  solved: true,
  solvedMessage: 'This is the solve message for bug report'
};

async function postBug(): Promise<number> {
  res = await request.post(BUGREPORT_URI)
    .set('Cookie', userCookies)
    .set('Accept', 'application/json')
    .send(validBugReport);
  return res.body.data.id;
}

beforeEach(async () => {
  await resetDatabase();
  [userCookies, adminReadCookies, adminWriteCookies, superuserCookies] = await getCookies();
});

describe(`Test POST ${BUGREPORT_URI} - create a new bug report`, () => {

  it('Sending bug report works after authentication, all arguments according to validation rules',
    async () => {
      res = await request.post(BUGREPORT_URI)
        .set('Cookie', userCookies)
        .set('Accept', 'application/json')
        .send(validBugReport);

      expect(res.body.data.id).toBeDefined();
      expect(res.body.errors).not.toBeDefined();
      expect(res.statusCode).toBe(HttpCode.Ok);
    });

  it('Sending bug report succesfull without card id', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ bugMessage: validBugReport.bugMessage, type: validBugReport.type });

    expect(res.body.data.id).toBeDefined();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('Should return error when not logged in', async () => {
    res = await request.post(BUGREPORT_URI)
      .send(validBugReport);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('Should return error when bug type does not match any of the enum types', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, type: nonValidId });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, bugErrors.ERR_INVALID_BUG_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when bug message too short', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, bugMessage: nonValidId.repeat(bugs.BUG_MESSAGE_MIN_LENGTH - 1) });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, bugErrors.ERR_BUG_MESSAGE_TOO_SHORT);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when bug message too long', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, bugMessage: nonValidId.repeat(bugs.BUG_MESSAGE_MAX_LENGTH + 1) });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, bugErrors.ERR_BUG_MESSAGE_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when bug message not send', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, bugMessage: null });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_VALUE_MISSING);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when card id negative integer or zero', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, cardId: -1 });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, cardId: 0 });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when card id type not integer', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, cardId: nonValidId });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when card with id does not exist', async () => {
    res = await request.post(BUGREPORT_URI)
      .set('Cookie', userCookies)
      .set('Accept', 'application/json')
      .send({ ...validBugReport, cardId: nonExistingId });

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, cardErrors.ERR_CARD_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });
});

describe(`Test PATCH ${BUGREPORT_URI}/:bugId - update existing bug report`, () => {

  it('Update bug report succesfully when admin with write permission or a superuser', async () => {
    let bugId: number = await postBug();
    let bugFromDb: BugReport = await models.BugReport.findByPk(bugId) as BugReport;

    expect(bugFromDb.id).toBe(bugId);
    expect(bugFromDb.bugMessage).toBe(validBugReport.bugMessage);
    expect(bugFromDb.cardId).toBe(validBugReport.cardId);
    expect(bugFromDb.type).toBe(validBugReport.type);
    expect(bugFromDb.solved).toBeFalsy();
    expect(bugFromDb.solvedMessage).toBeNull();

    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json')
      .send(solveBugReport);

    expect(res.statusCode).toBe(HttpCode.Ok);
    expect(res.body.errors).not.toBeDefined();

    bugFromDb = await models.BugReport.findByPk(bugId) as BugReport;
    expect(bugFromDb.id).toBe(bugId);
    expect(bugFromDb.bugMessage).toBe(validBugReport.bugMessage);
    expect(bugFromDb.cardId).toBe(validBugReport.cardId);
    expect(bugFromDb.type).toBe(validBugReport.type);
    expect(bugFromDb.solved).toBe(solveBugReport.solved);
    expect(bugFromDb.solvedMessage).toBe(solveBugReport.solvedMessage);

    bugId = await postBug();
    bugFromDb = await models.BugReport.findByPk(bugId) as BugReport;

    expect(bugFromDb.id).toBe(bugId);
    expect(bugFromDb.bugMessage).toBe(validBugReport.bugMessage);
    expect(bugFromDb.cardId).toBe(validBugReport.cardId);
    expect(bugFromDb.type).toBe(validBugReport.type);
    expect(bugFromDb.solved).toBeFalsy();
    expect(bugFromDb.solvedMessage).toBeNull();

    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .set('Cookie', superuserCookies)
      .set('Accept', 'application/json')
      .send(solveBugReport);

    expect(res.statusCode).toBe(HttpCode.Ok);
    expect(res.body.errors).not.toBeDefined();

    bugFromDb = await models.BugReport.findByPk(bugId) as BugReport;
    expect(bugFromDb.id).toBe(bugId);
    expect(bugFromDb.bugMessage).toBe(validBugReport.bugMessage);
    expect(bugFromDb.cardId).toBe(validBugReport.cardId);
    expect(bugFromDb.type).toBe(validBugReport.type);
    expect(bugFromDb.solved).toBe(solveBugReport.solved);
    expect(bugFromDb.solvedMessage).toBe(solveBugReport.solvedMessage);
  });

  it('Should return error when bug report with id does not exist', async () => {
    res = await request.patch(`${BUGREPORT_URI}/${nonExistingId}`)
      .send(solveBugReport)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.NotFound);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_BY_ID_NOT_FOUND);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when trying to patch but regular user or admin with only read rights',
    async () => {
      const bugId: number = await postBug();
      res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
        .send(solveBugReport)
        .set('Cookie', userCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Forbidden);
      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();

      res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
        .send(solveBugReport)
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Forbidden);
      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();
    });

  it('Should return error when not logged in', async () => {
    const bugId: number = await postBug();
    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .send(solveBugReport);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('Should return error when write permission but bug id is zero or negative integer',
    async () => {
      res = await request.patch(`${BUGREPORT_URI}/0`)
        .send(solveBugReport)
        .set('Cookie', adminWriteCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.BadRequest);
      checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
      expect(res.body.data).not.toBeDefined();

      res = await request.patch(`${BUGREPORT_URI}/-1`)
        .send(solveBugReport)
        .set('Cookie', adminWriteCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.BadRequest);
      checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
      expect(res.body.data).not.toBeDefined();
    });

  it('Should return error when write permission but bug id type not integer', async () => {
    res = await request.patch(`${BUGREPORT_URI}/${nonValidId}`)
      .send(solveBugReport)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when solved message too short', async () => {
    const bugId: number = await postBug();
    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .send({ solvedMessage: nonValidId.repeat(bugs.SOLVED_MESSAGE_MIN_LENGTH - 1) })
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_SOLVE_MESSAGE_TOO_SHORT);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when solved message too long', async () => {
    const bugId: number = await postBug();
    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .send({ solvedMessage: nonValidId.repeat(bugs.SOLVED_MESSAGE_MAX_LENGTH + 1) })
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_SOLVE_MESSAGE_TOO_LONG);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when solved not type boolean', async () => {
    const bugId: number = await postBug();
    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .send({ solved: nonValidId })
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when cardId referenced does not exist', async () => {
    const bugId: number = await postBug();
    res = await request.patch(`${BUGREPORT_URI}/${bugId}`)
      .send({ cardId: nonExistingId })
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.NotFound);
    checkErrors(res.body.errors, cardErrors.ERR_CARD_NOT_FOUND);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when bug report with id does not exist', async () => {
    res = await request.patch(`${BUGREPORT_URI}/${nonExistingId}`)
      .send(solveBugReport)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.NotFound);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_BY_ID_NOT_FOUND);
    expect(res.body.data).not.toBeDefined();
  });
});

describe(`Test DELETE ${BUGREPORT_URI}/:bugId - delete existing bug report`, () => {

  it('Delete bug report succesfully when admin with write or superuser permission', async () => {
    let bugId: number = await postBug();
    let bugFromDb: BugReport | null = await models.BugReport.findByPk(bugId);
    expect(bugFromDb).toBeDefined();

    res = await request.delete(`${BUGREPORT_URI}/${bugId}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    bugFromDb = await models.BugReport.findByPk(bugId);
    expect(bugFromDb).toBeNull();
    expect(res.body.errors).not.toBeDefined();

    bugId = await postBug();
    bugFromDb = await models.BugReport.findByPk(bugId);
    expect(bugFromDb).toBeDefined();

    res = await request.delete(`${BUGREPORT_URI}/${bugId}`)
      .set('Cookie', superuserCookies)
      .set('Accept', 'application/json');

    bugFromDb = await models.BugReport.findByPk(bugId);
    expect(bugFromDb).toBeNull();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('Should return error when trying to delete but not not logged in', async () => {
    const bugId: number = await postBug();
    res = await request.delete(`${BUGREPORT_URI}/${bugId}`);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('Should return error when trying to delete but regular user or admin with only read rights',
    async () => {
      const bugId: number = await postBug();
      const bugFromDb: BugReport | null = await models.BugReport.findByPk(bugId);
      expect(bugFromDb).toBeDefined();

      res = await request.delete(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();
      expect(res.statusCode).toBe(HttpCode.Forbidden);

      res = await request.delete(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', userCookies)
        .set('Accept', 'application/json');

      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();
      expect(res.statusCode).toBe(HttpCode.Forbidden);
    });

  it('Should return error when delete permission but bug id negative integer or zero', async () => {
    res = await request.delete(`${BUGREPORT_URI}/${0}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    res = await request.delete(`${BUGREPORT_URI}/${-1}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when delete permission but bug id type not integer', async () => {
    res = await request.delete(`${BUGREPORT_URI}/${nonValidId}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('Should return error when delete permission but bug id not send', async () => {
    res = await request.delete(BUGREPORT_URI)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('Should return error when delete permission but bug with id not found', async () => {
    res = await request.delete(`${BUGREPORT_URI}/${nonExistingId}`)
      .set('Cookie', adminWriteCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, bugErrors.ERR_BUG_BY_ID_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });
});

describe(`Test GET ${BUGREPORT_URI} - get all bug reports`, () => {

  it('Returns all bug reports possible when admin with write or read permission or a superuser',
    async () => {
      res = await request.get(BUGREPORT_URI)
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);
      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data[0].id).toBeDefined();
      expect(res.body.data[0].accountId).toBeDefined();
      expect(res.body.data[0].cardId).toBeDefined();
      expect(res.body.data[0].type).toBeDefined();
      expect(res.body.data[0].bugMessage).toBeDefined();
      expect(res.body.data[0].solvedMessage).toBeDefined();
      expect(res.body.data[0].createdAt).toBeDefined();
      expect(res.body.data[0].updatedAt).toBeDefined();
    });

  it('Returns bug reports filtered by optional query param type "TRANSLATION"', async () => {
    res = await request.get(BUGREPORT_URI + '?type=translation')
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.Ok);
    expect(res.body.errors).not.toBeDefined();
    expect(res.body.data).toBeDefined();
    res.body.data.forEach((rep: BugReport) => expect(rep.type).toBe('TRANSLATION'));
  });

  it('Returns pagination of bug reports when optional query params page and limit included',
    async () => {
    // Pages size correct.
      res = await request.get(BUGREPORT_URI + '?page=1&limit=4')
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);
      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data.length).toBe(4);

      // Pages size correct.
      res = await request.get(BUGREPORT_URI + '?page=1&limit=2')
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);
      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data.length).toBe(2);
    });

  it('Should return error when page query param is zero or negative integer', async () => {
    res = await request.get(BUGREPORT_URI + '?page=0&limit=2')
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();

    res = await request.get(BUGREPORT_URI + '?page=-1&limit=2')
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when page query param is non integer type', async () => {
    res = await request.get(BUGREPORT_URI + `?page=${nonValidId}&limit=2`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when limit query param is zero or negative integer', async () => {
    res = await request.get(BUGREPORT_URI + '?page=1&limit=0')
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();

    res = await request.get(BUGREPORT_URI + '?page=1&limit=-1')
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when limit query param is non integer type', async () => {
    res = await request.get(BUGREPORT_URI + `?page=1&limit=${nonValidId}`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when limit query param is over maximum value', async () => {
    res = await request.get(BUGREPORT_URI + `?page=1&limit=${bugs.BUG_REPORTS_PER_PAGE_MAX + 1}`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_PAGELIMIT_EXCEEDED);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when filter type non-existing', async () => {
    res = await request.get(BUGREPORT_URI + `?type=${nonValidId}`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, bugErrors.ERR_INVALID_BUG_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when not logged in', async () => {
    res = await request.get(BUGREPORT_URI);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('Should return error when trying to get bugs but logged in as regular user (non-admin)',
    async () => {
      res = await request.get(BUGREPORT_URI)
        .set('Cookie', userCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Forbidden);
      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();
    });
});

describe(`Test GET ${BUGREPORT_URI}:bugId - get bug report by id`, () => {

  it('Return a bug report based on id when admin with write or read permission or a superuser',
    async () => {
      const bugId: number = await postBug();
      res = await request.get(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', adminReadCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);
      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(bugId);
      expect(res.body.data.accountId).toBeDefined();
      expect(res.body.data.cardId).toBeDefined();
      expect(res.body.data.type).toBeDefined();
      expect(res.body.data.bugMessage).toBeDefined();
      expect(res.body.data.solvedMessage).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();

      res = await request.get(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', adminWriteCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);

      res = await request.get(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', superuserCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Ok);
    });

  it('Should return error when trying to get bug report but logged in as regular user (non-admin)',
    async () => {
      const bugId: number = await postBug();
      res = await request.get(`${BUGREPORT_URI}/${bugId}`)
        .set('Cookie', userCookies)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(HttpCode.Forbidden);
      checkErrors(res.body.errors, generalErrors.FORBIDDEN);
      expect(res.body.data).not.toBeDefined();
    });

  it('Should return error when not logged in', async () => {
    const bugId: number = await postBug();
    res = await request.get(`${BUGREPORT_URI}/${bugId}`);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('Should return error when access permission but bug id negative integer or zero', async () => {
    res = await request.get(`${BUGREPORT_URI}/-1`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();

    res = await request.get(`${BUGREPORT_URI}/0`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when access permission but bug id type not integer', async () => {
    res = await request.get(`${BUGREPORT_URI}/nonValidId`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.BadRequest);
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.body.data).not.toBeDefined();
  });

  it('Should return error when access permission but bug with id not found', async () => {
    res = await request.get(`${BUGREPORT_URI}/${nonExistingId}`)
      .set('Cookie', adminReadCookies)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(HttpCode.NotFound);
    checkErrors(res.body.errors, bugErrors.ERR_BUG_BY_ID_NOT_FOUND);
    expect(res.body.data).not.toBeDefined();
  });
});
