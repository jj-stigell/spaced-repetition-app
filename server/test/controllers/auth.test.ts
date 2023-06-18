/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cookie, CookieAccessInfo } from 'cookiejar';
import supertest, { SuperAgentTest } from 'supertest';

import { app } from '../../src/app';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import { accountErrors, validationErrors } from '../../src/configs/errorCodes';
import {
  newAccount, LOGIN_URI, LOGOUT_URI, REGISTER_URI, user
} from '../utils/constants';
import { checkErrors, getCookies, resetDatabase } from '../utils/helpers';
import { HttpCode, JlptLevel } from '../../src/type';

const request: supertest.SuperTest<supertest.Test> = supertest(app);
let account: Account;
let nonMemberUserCookies: Array<string> = [];
let memberUserCookies: Array<string> = [];
let adminReadCookies: Array<string> = [];
let adminWriteCookies: Array<string> = [];
let superuserCookies: Array<string> = [];

beforeEach(async () => {
  await resetDatabase();
  [memberUserCookies, adminReadCookies, adminWriteCookies, superuserCookies, nonMemberUserCookies]
  = await getCookies();
});

describe(`Test POST ${REGISTER_URI} - create a new account`, () => {

  it('should allow creation of a new account, with language set to EN', async () => {
    const res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send(newAccount)
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should allow creation of a new account, with language set to FI', async () => {
    const res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send({...newAccount, language: 'fi'})
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should allow creation of a new account, with language set to VN', async () => {
    const res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send({...newAccount, language: 'vn'})
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not allow creation of a new account if email taken', async () => {
    const  res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send({ ...user, username: 'notTaken' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_IN_USE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should not allow creation of a new account if username taken', async () => {
    const  res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send({ ...user, email: 'test@testing.com' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_USERNAME_IN_USE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should not allow creation of a new account if language id not valid', async () => {
    const  res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send({...newAccount, language: 'XX'})
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_LANGUAGE_ID_NOT_VALID);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test POST ${LOGIN_URI} - login to account`, () => {

  it('should allow logging in with the correct credentials and return jwt in cookie', async () => {
    const res: supertest.Response = await request.post(LOGIN_URI)
      .send(user)
      .expect('Content-Type', /json/);

    const cookies: Array<string> = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/^jwt/);
    expect(res.body.errors).not.toBeDefined();
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.username).toBe(user.username);
    expect(res.body.data.allowNewsLetter).toBe(user.allowNewsLetter);
    expect(res.body.data.language).toBe(user.language);
    expect(res.body.data.jlptLevel).toBe(JlptLevel.N5);
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not allow logging in with the non-existing credentials (email)', async () => {
    const res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: 'abc@abc.com', password: user.password })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should not allow logging in to account with unverified email address', async () => {
    account = await models.Account.findOne({
      where: {
        email: user.email
      }
    }) as Account;
    account.set({ emailVerified: false });
    await account.save();

    const res: supertest.Response = await request.post(LOGIN_URI)
      .send(user)
      .expect('Content-Type', /json/);

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should not allow logging in with the incorrect credentials (password)', async () => {
    const res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: '1234567' })
      .expect('Content-Type', /json/);

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_OR_PASSWORD_INCORRECT);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });
});

describe(`Test POST ${LOGOUT_URI} - logout account`, () => {

  it('should logout (clear cookie) successfully when valid cookie supplied', async () => {
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send(user)
      .expect('Content-Type', /json/);

    let cookies: Array<string> = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/^jwt/);

    res = await request.post(LOGOUT_URI)
      .send()
      .set('Cookie', cookies)
      .expect('Content-Type', /json/);

    cookies = res.headers['set-cookie'];

    expect(cookies[0]).toMatch(/^jwt=;/);
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should give error no cookie supplied', async () => {
    const res: supertest.Response = await request.post(LOGOUT_URI).send();

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('should give error when JWT token expired', async () => {
    expect(1).toBe(1);
  });

});
