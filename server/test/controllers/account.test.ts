import supertest from 'supertest';

import { app } from '../../src/app';
import { account as accountConstants } from '../../src/configs/constants';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import AccountAction from '../../src/database/models/accountAction';
import { accountErrors, validationErrors } from '../../src/configs/errorCodes';
import { HttpCode } from '../../src/types/httpCode';
import {
  EMAIL_CONFIRMATION_URI, RESEND_EMAIL_CONFIRMATION_URI, REGISTER_URI, user,
  REQUEST_RESET_PASSWORD_URI, RESET_PASSWORD_URI
} from '../utils/constants';
import { resetDatabase } from '../utils/helpers';

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

describe(`Test POST ${EMAIL_CONFIRMATION_URI}`, () => {

  it('should allow confirmation of (unconfirmed) email', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeTruthy();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not allow confirmation of confirmed email', async () => {
    let res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeTruthy();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);

    res = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_ALREADY_CONFIRMED);
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

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_CONFIRMATION_CODE_EXPIRED);
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

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_INCORRECT_ACTION_TYPE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response validation error if confirmationId is not valid UUID', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: nonValidUuid })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if confirmationId not send in request body', async () => {
    const res: supertest.Response = await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send()
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_CONFIRMATION_CODE_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test POST ${RESEND_EMAIL_CONFIRMATION_URI}`, () => {

  it('should resend confirmation code for (unconfirmed) email', async () => {
    let rows: number = await models.AccountAction.count();
    expect(rows).toBe(1);

    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    rows = await models.AccountAction.count();
    expect(rows).toBe(2);
    expect(res.body.success).toBeTruthy();
    expect(res.body.errors).not.toBeDefined();
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
    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_ALREADY_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response with error if email not found', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: 'nonExisting@test.com' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_EMAIL_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response validation error if email not send in request body', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send()
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_EMAIL_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if email not valid email', async () => {
    const res: supertest.Response = await request.post(RESEND_EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ email: 'notvalid' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_NOT_VALID_EMAIL);
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

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_EMAIL_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test POST ${REQUEST_RESET_PASSWORD_URI}`, () => {

  it('should send password reset link for confirmed email', async () => {
    // First confirm the account email.
    await request.post(EMAIL_CONFIRMATION_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id });

    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeTruthy();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should not send password reset link for unconfirmed email', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: account.email })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_EMAIL_NOT_CONFIRMED);
    expect(res.statusCode).toBe(HttpCode.Forbidden);
  });

  it('should response with error if email not found', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: 'nonExisting@test.com' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_EMAIL_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response validation error if email not valid email', async () => {
    const res: supertest.Response = await request.post(REQUEST_RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ email: 'notvalid' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_NOT_VALID_EMAIL);
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

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_EMAIL_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});

describe(`Test PATCH ${RESET_PASSWORD_URI}`, () => {

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

    expect(res.body.success).toBeTruthy();
    expect(res.body.errors).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });

  it('should response with error if confirmationId is not found', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_CONFIRMATION_CODE_NOT_FOUND);
    expect(res.statusCode).toBe(HttpCode.NotFound);
  });

  it('should response with error if confirmationId is wrong type (CONFIRM_EMAIL)', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: confirmationCode.id, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(accountErrors.ERR_INCORRECT_ACTION_TYPE);
    expect(res.statusCode).toBe(HttpCode.Conflict);
  });

  it('should response validation error if confirmationId is not valid UUID', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: nonValidUuid, password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_INPUT_TYPE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if confirmationId is not send in body', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ password: validPassword })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_CONFIRMATION_CODE_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if password does not match requirements', async () => {
    // No lowercase letters.
    let res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'NOLOWERCASE12345LETTERS' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_LOWERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No uppercase letters.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'nouppercase12345letters' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_UPPERCASE);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // No numbers.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid, password: 'JUSTlettersINthisEXAMPLE' })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_NUMBER);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Not long enough password.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({
        confirmationId: validUuid,
        password: 'x'.repeat(accountConstants.PASSWORD_MIN_LENGTH - 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_TOO_SHORT);
    expect(res.statusCode).toBe(HttpCode.BadRequest);

    // Too long password.
    res = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({
        confirmationId: validUuid,
        password: 'x'.repeat(accountConstants.PASSWORD_MAX_LENGTH + 1)
      })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_TOO_LONG);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });

  it('should response validation error if password is not send in body', async () => {
    const res: supertest.Response = await request.patch(RESET_PASSWORD_URI)
      .set('Accept', 'application/json')
      .send({ confirmationId: validUuid })
      .expect('Content-Type', /json/);

    expect(res.body.success).toBeFalsy();
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContain(validationErrors.ERR_PASSWORD_REQUIRED);
    expect(res.statusCode).toBe(HttpCode.BadRequest);
  });
});