import supertest from 'supertest';

import { app } from '../../src/app';
import { account as accountConstants } from '../../src/configs/constants';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import AccountAction from '../../src/database/models/accountAction';
import { accountErrors, validationErrors } from '../../src/configs/errorCodes';
import {
  user, EMAIL_CONFIRMATION_URI, RESEND_EMAIL_CONFIRMATION_URI,
  REGISTER_URI, REQUEST_RESET_PASSWORD_URI, RESET_PASSWORD_URI,
  CHANGE_PASSWORD_URI, LOGIN_URI, CHANGE_ACCOUNT_SETTINGS
} from '../utils/constants';
import { checkErrors, resetDatabase } from '../utils/helpers';
import { HttpCode, JlptLevel } from '../../src/types';

const request: supertest.SuperTest<supertest.Test> = supertest(app);
let account: Account;
let confirmationCode: AccountAction;
const validPassword: string = 'This123IsValid';
const validUuid: string = 'ad60dc75-797d-48df-a9fa-be9b88ccb5d8';
const nonValidUuid: string = '088d2a92-aaaa-bbbb-bedd-2efc8f566dbb';

beforeEach(async () => {
  await resetDatabase();
  await request.post(REGISTER_URI).send(user);

  account = await models.Account.findOne({
    where: {
      email: user.email
    }
  }) as Account;

  confirmationCode = await models.AccountAction.findOne({
    where: {
      accountId: account.id
    }
  }) as AccountAction;
});

describe(`Test POST ${EMAIL_CONFIRMATION_URI} - confirm account email`, () => {

  it('should allow confirmation of (unconfirmed) email', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not allow confirmation of confirmed email', async () => {
    let res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);

    res = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_ALREADY_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should not allow confirmation if confirmationId is expired', async () => {
    confirmationCode.set({
      expireAt: new Date('2010-01-01')
    });
    await confirmationCode.save();

    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_CONFIRMATION_CODE_EXPIRED);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response with error if confirmationId is wrong type (RESET_PASSWORD)', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Get password reset code.
    await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email });

    const accountAction: AccountAction = await models.AccountAction.findOne({
      where: {
        accountId: account.id,
        type: 'RESET_PASSWORD'
      }
    }) as AccountAction;

    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: accountAction.id })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_INCORRECT_ACTION_TYPE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response validation error if confirmationId is not valid UUID', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: nonValidUuid })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if confirmationId not send in request body', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send()
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_CONFIRMATION_CODE_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test POST ${RESEND_EMAIL_CONFIRMATION_URI} - resend email confirmation code`, () => {

  it('should resend confirmation code for (unconfirmed) email', async () => {
    let rows: number = await models.AccountAction.count();
    expect(rows).toBe(1);

    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    rows = await models.AccountAction.count();
    expect(rows).toBe(2);
    expect(res.body.errors).not.toBeDefined();
    expect(res.body.data).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not resend confirmation code for confirmed email', async () => {
    let rows: number = await models.AccountAction.count();
    expect(rows).toBe(1);

    // confirm email first
    let res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    res = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    rows = await models.AccountAction.count();
    expect(rows).toBe(1);
    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_ALREADY_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response with error if email not found', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: 'nonExisting@test.com' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response validation error if email not send in request body', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send()
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_EMAIL_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if email not valid email', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: 'notvalid' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_NOT_VALID_EMAIL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if email too long', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: `abfsdfsdfsdfdfsdfsdfsdfsdfsdfsdfc@abcbbbbfjhkjsdlkfjsdjfioje
      lfjiljsljfsjfoisdjflsjdksufsdipifsdjfipjsdlkfjsdfiosdjfijsdlkfjsdkljfklsdjkl
      fjsdkljfklsdjklfjsdkljfllfjsdifjslkjfklsdjfsjdlfkjsdklfjklsdjklfjslkdfjlksdj
      flksdjfkljsdlkfjklsdjfl.com`
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_EMAIL_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test POST ${REQUEST_RESET_PASSWORD_URI} - request password reset code`, () => {

  it('should send password reset link for confirmed email', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.body.data).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not send password reset link for unconfirmed email', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should response with error if email not found', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: 'nonExisting@test.com' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response validation error if email not valid email', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: 'notvalid' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_NOT_VALID_EMAIL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if email too long', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: `abfsdfsdfsdfdfsdfsdfsdfsdfsdfsdfc@abcbbbbfjhkjsdlkfjsdjfioje
      lfjiljsljfsjfoisdjflsjdksufsdipifsdjfipjsdlkfjsdfiosdjfijsdlkfjsdkljfklsdjkl
      fjsdkljfklsdjklfjsdkljfllfjsdifjslkjfklsdjfsjdlfkjsdklfjklsdjklfjslkdfjlksdj
      flksdjfkljsdlkfjklsdjfl.com`
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_EMAIL_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test PATCH ${RESET_PASSWORD_URI} - reset (forgotten) password using reset code`, () => {

  it('should reset password succesfully for confirmed email', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Get reset code.
    await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email });

    const accountAction: AccountAction = await models.AccountAction.findOne({
      where: {
        accountId: account.id,
        type: 'RESET_PASSWORD'
      }
    }) as AccountAction;

    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: accountAction.id, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should response with error if confirmationId is not found', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_CONFIRMATION_CODE_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response with error if confirmationId is wrong type (CONFIRM_EMAIL)', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_INCORRECT_ACTION_TYPE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response validation error if confirmationId is not valid UUID', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: nonValidUuid, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if confirmationId is not send in body', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_CONFIRMATION_CODE_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if password does not match requirements', async () => {
    // No lowercase letters.
    let res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'NOLOWERCASE12345LETTERS' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_LOWERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No uppercase letters.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'nouppercase12345letters' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_UPPERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No numbers.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'JUSTlettersINthisEXAMPLE' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Not long enough password.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({
        confirmationId: validUuid,
        password: 'x'.repeat(accountConstants.PASSWORD_MIN_LENGTH - 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_TOO_SHORT);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Too long password.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({
        confirmationId: validUuid,
        password: 'x'.repeat(accountConstants.PASSWORD_MAX_LENGTH + 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if password is not send in body', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test PATCH ${CHANGE_PASSWORD_URI} - change existing account password`, () => {

  it('should change password succesfully for confirmed email', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    let cookies: Array<string> = res.headers['set-cookie'];

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ currentPassword: user.password, newPassword: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);

    // Should allow logging in with new password
    res = await request.post(LOGIN_URI)
      .send({ email: user.email, password: validPassword })
      .expect('Content-Type', /json/);

    cookies = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/^jwt/);
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);

    // Should not allow logging in with old password
    res = await request.post(LOGIN_URI)
      .send(user)
      .expect('Content-Type', /json/);

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_OR_PASSWORD_INCORRECT);
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('should response with error if account email not verified', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    const account: Account = await models.Account.findOne({
      where: {
        email: user.email
      }
    }) as Account;

    // Set email to unverified
    account.set({
      emailVerified: false
    });
    await account.save();

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ currentPassword: user.password, newPassword: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should response with error if not logged in', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    const res: supertest.Response = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({
        currentPassword: user.password,
        newPassword: validPassword
      });

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('should response with error if current password is not found in the body', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ newPassword: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if new password is not found in the body', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ currentPassword: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if current and new password are matching', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: validPassword
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_PASSWORD_CURRENT_AND_NEW_EQUAL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if current password incorrect', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: user.password
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_PASSWORD_CURRENT_INCORRECT);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should response with error if new password does not pass validation', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    // No lowercase letters.
    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: 'NOLOWERCASE12345LETTERS'
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_LOWERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No uppercase letters.
    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: 'nouppercase12345letters'
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_UPPERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No numbers.
    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: 'JUSTlettersINthisEXAMPLE'
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Not long enough password.
    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: 'x'.repeat(accountConstants.PASSWORD_MIN_LENGTH - 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_TOO_SHORT);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Too long password.
    res = await request.patch(CHANGE_PASSWORD_URI)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({
        currentPassword: validPassword,
        newPassword: 'x'.repeat(accountConstants.PASSWORD_MAX_LENGTH + 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_PASSWORD_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test PATCH ${CHANGE_ACCOUNT_SETTINGS} - change account settings`, () => {

  it('should change settings succesfully for confirmed email', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    // Check its possible to change JLPT level.
    async function loop(jlptLevel: number): Promise<void> {
      res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
        .set('Accept', 'application/json')
        .set('Cookie', cookies)
        .send({ jlptLevel })
        .expect('Content-Type', /json/);

      expect(res.body.errors).not.toBeDefined();
      expect(res.statusCode).toBe(HttpCode.Ok);
      // Check change was success
      const account: Account = await models.Account.findOne({
        where: {
          email: user.email
        }
      }) as Account;
      expect(account.selectedJlptLevel).toBe(jlptLevel);
      expect(account.languageId).toBe('EN');
    }

    for (let i: number = 1; i < 6; i++) {
      await loop(i);
    }

    // Check its possible to change language.
    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ language: 'fi' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
    // Check change was success
    const account: Account = await models.Account.findOne({
      where: {
        email: user.email
      }
    }) as Account;
    expect(account.languageId).toBe('FI');
  });

  it('should response with error if not logged in', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    const res: supertest.Response = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .send({ jlptLevel: JlptLevel.N3 });

    expect(res.body.data).not.toBeDefined();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Unauthorized);
  });

  it('should response with error if account email not verified', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    const account: Account = await models.Account.findOne({
      where: {
        email: user.email
      }
    }) as Account;

    // Set email to unverified
    account.set({
      emailVerified: false
    });
    await account.save();

    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ jlptLevel: JlptLevel.N3 })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, accountErrors.ERR_EMAIL_NOT_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should response with error if JLPT level does not pass validation', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie.
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    // Wrong type (string).
    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ jlptLevel: 'x' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Level out of range (0).
    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ jlptLevel: 0 })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INVALID_JLPT_LEVEL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Level out of range (6).
    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ jlptLevel: 6 })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_INVALID_JLPT_LEVEL);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response with error if language does not pass validation', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    // Login and take cookie.
    let res: supertest.Response = await request.post(LOGIN_URI)
      .send({ email: user.email, password: user.password });

    const cookies: Array<string> = res.headers['set-cookie'];

    // Wrong value.
    res = await request.patch(CHANGE_ACCOUNT_SETTINGS)
      .set('Accept', 'application/json')
      .set('Cookie', cookies)
      .send({ language: 'x' })
      .expect('Content-Type', /json/);

    expect(res.body.errors).toBeDefined();
    expect(res.body.data).not.toBeDefined();
    checkErrors(res.body.errors, validationErrors.ERR_LANGUAGE_ID_NOT_VALID);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});
