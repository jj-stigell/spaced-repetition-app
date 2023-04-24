/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cookie, CookieAccessInfo } from 'cookiejar';
import supertest, { SuperAgentTest } from 'supertest';

import { app } from '../../src/app';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import { accountErrors } from '../../src/configs/errorCodes';
import { HttpCode } from '../../src/type/httpCode';
import {
  newAccount, LOGIN_URI, LOGOUT_URI, REGISTER_URI, user
} from '../utils/constants';
import { checkErrors, resetDatabase } from '../utils/helpers';

const request: supertest.SuperTest<supertest.Test> = supertest(app);
let account: Account;

beforeEach(async () => {
  await resetDatabase();
  await request.post(REGISTER_URI).send(user);
  account = await models.Account.findOne({
    where: {
      email: user.email
    }
  }) as Account;
  account.set({ emailVerified: true });
  await account.save();
});

describe(`Test POST ${REGISTER_URI} - create a new account`, () => {

  it('should allow creation of a new account', async () => {
    const res: supertest.Response = await request.post(REGISTER_URI)
      .set('Accept', 'application/json')
      .send(newAccount)
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
});

describe(`Test POST ${LOGIN_URI} - login to account`, () => {

  it('should allow logging in with the correct credentials and return jwt in cookie', async () => {
    const res: supertest.Response = await request.post(LOGIN_URI)
      .send(user)
      .expect('Content-Type', /json/);

    const cookies: Array<string> = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/^jwt/);
    expect(res.body.errors).not.toBeDefined();
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
      .send({ email: user.email, password: user.password })
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
});

/*
describe('Test POST /v1/auth/login and expiry', () => {
  it('should expire the session after a set time', async () => {
    // Use the agent for cookie persistence
    const agent: SuperAgentTest = supertest.agent(app);
    const realDate: Date = new Date();
    await agent.post('/v1/auth/login')
      .withCredentials(true)
      .send({ email: 'sysadmin@aalto.fi', password: 'grades' })
      .expect('Content-Type', /json/)
      .expect(HttpCode.Ok);
    await agent.get('/v1/auth/self-info').withCredentials(true).expect(HttpCode.Ok);
    const jwt: Cookie | undefined = agent.jar.getCookie('jwt', CookieAccessInfo.All);
    if (!jwt) {
      throw new Error('jwt not available');
    }
    // Simulate situtation where the browser does not properly expire the cookie
    mockdate.set(realDate.setMilliseconds(realDate.getMilliseconds() + JWT_COOKIE_EXPIRY_MS + 1));
    jwt.expiration_date = realDate.setSeconds(realDate.getSeconds() + JWT_EXPIRY_SECONDS * 2);
    agent.jar.setCookie(jwt);
    await agent.get('/v1/auth/self-info').withCredentials(true).expect(HttpCode.Ok);
    mockdate.set(realDate.setSeconds(realDate.getSeconds() + JWT_EXPIRY_SECONDS + 1));
    await agent.get('/v1/auth/self-info').withCredentials(true).expect(HttpCode.Unauthorized);
  });
});
*/
