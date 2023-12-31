/* eslint-disable @typescript-eslint/no-unused-vars */
import supertest from 'supertest';

import { app } from '../../src/app';
import { CATEGORIES_URI } from '../utils/constants';
import { checkErrors, getCookies, resetDatabase } from '../utils/helpers';
import { HttpCode } from '../../src/types';
import { redisClient } from '../../src/configs/redis';
import { validationErrors } from '../../src/configs/errorCodes';

const request: supertest.SuperTest<supertest.Test> = supertest(app);
let res: supertest.Response;

let nonMemberUserCookies: Array<string> = [];
let memberUserCookies: Array<string> = [];
let adminReadCookies: Array<string> = [];
let adminWriteCookies: Array<string> = [];
let superuserCookies: Array<string> = [];

beforeAll(async () => {
  await redisClient.connect();
});

beforeEach(async () => {
  await resetDatabase();
  [memberUserCookies, adminReadCookies, adminWriteCookies, superuserCookies, nonMemberUserCookies]
  = await getCookies();
});

afterAll(async () => {
  redisClient.quit();
});

describe(`Test GET ${CATEGORIES_URI} - get available categories`, () => {

  it('should receive categories, amount of decks and optional data in the response',
    async () => {
      res = await request.get(CATEGORIES_URI + '?level=5')
        .set('Cookie', nonMemberUserCookies)
        .set('Accept', 'application/json');

      // Progress not defined on non-member accounts.
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].category).toBeDefined();
      expect(res.body.data[0].decks).toBeDefined();
      expect(res.body.data[0].progress).not.toBeDefined();
      expect(res.body.errors).not.toBeDefined();
      expect(res.statusCode).toBe(HttpCode.Ok);

      async function testEndpoint(cookies: Array<string>, level: number): Promise<void> {
        res = await request.get(CATEGORIES_URI + `?level=${level}`)
          .set('Cookie', cookies)
          .set('Accept', 'application/json');

        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data[0].category).toBeDefined();
        expect(res.body.data[0].decks).toBeDefined();
        expect(res.body.data[0].progress).toBeDefined();
        expect(res.body.data[0].progress.new).toBeGreaterThanOrEqual(0);
        expect(res.body.data[0].progress.learning).toBeGreaterThanOrEqual(0);
        expect(res.body.data[0].progress.mature).toBeGreaterThanOrEqual(0);
        expect(res.body.errors).not.toBeDefined();
        expect(res.statusCode).toBe(HttpCode.Ok);
      }
      // Only category N5 since not enough material produced for testing N4 to N1
      await testEndpoint(memberUserCookies, 5);
    });

  it('should response with error if not logged in', async () => {
    res = await request.get(CATEGORIES_URI + '?level=1')
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('should response with error JLPT level out of range', async () => {
    res = await request.get(CATEGORIES_URI + '?level=0')
      .set('Cookie', nonMemberUserCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INVALID_JLPT_LEVEL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    res = await request.get(CATEGORIES_URI + '?level=6')
      .set('Cookie', nonMemberUserCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INVALID_JLPT_LEVEL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if JLPT level not integer', async () => {
    res = await request.get(CATEGORIES_URI + '?level=a')
      .set('Cookie', nonMemberUserCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if JLPT level not provided in the query params', async () => {
    res = await request.get(CATEGORIES_URI)
      .set('Cookie', nonMemberUserCookies)
      .set('Accept', 'application/json');

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_JLPT_LEVEL_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});
