import fs from 'fs';
import path from 'path';
import { QueryInterface } from 'sequelize';
import supertest from 'supertest';

import { app } from '../../src/app';
import logger from '../../src/configs/winston';
import { sequelize } from '../../src/database';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import { Role, ApiErrorContent } from '../../src/types';
import {
  adminRead, adminWrite, LOGIN_URI, REGISTER_URI, superuser, user, nonMember
} from './constants';

const account: string = fs.readFileSync(
  path.resolve(__dirname, '../../dbBaseData/account.sql'), 'utf8'
);

const bugReport: string = fs.readFileSync(
  path.resolve(__dirname, '../../dbBaseData/bug_report.sql'), 'utf8'
);

const queryInterface: QueryInterface = sequelize.getQueryInterface();
const request: supertest.SuperTest<supertest.Test> = supertest(app);
let res: supertest.Response;

export async function resetDatabase(): Promise<void> {
  try {
    // Truncate all data that might have been affected by the tests and reload them from file.
    await queryInterface.sequelize.query(
      'TRUNCATE bug_report, session, account, account_action;'
    );
    await queryInterface.sequelize.query('ALTER SEQUENCE account_id_seq RESTART WITH 230792;');
    await queryInterface.sequelize.query('ALTER SEQUENCE bug_report_id_seq RESTART;');

    // Load data to db.
    await queryInterface.sequelize.query(account);
    await queryInterface.sequelize.query(bugReport);
  } catch (err) {
    logger.error(err);
  }
}

export async function getCookies():
Promise<[Array<string>, Array<string>, Array<string>, Array<string>, Array<string>]> {
  await request.post(REGISTER_URI).send(nonMember);
  await request.post(REGISTER_URI).send(user);
  await request.post(REGISTER_URI).send(adminRead);
  await request.post(REGISTER_URI).send(adminWrite);
  await request.post(REGISTER_URI).send(superuser);

  const nonMemberUser: Account = await models.Account.findOne({
    where: {
      email: nonMember.email
    }
  }) as Account;
  nonMemberUser.set({ emailVerified: true, role: Role.NON_MEMBER });
  await nonMemberUser.save();

  const memberUser: Account = await models.Account.findOne({
    where: {
      email: user.email
    }
  }) as Account;
  memberUser.set({ emailVerified: true, role: Role.MEMBER });
  await memberUser.save();

  const adminReadAccount: Account = await models.Account.findOne({
    where: {
      email: adminRead.email
    }
  }) as Account;
  adminReadAccount.set({ emailVerified: true, role: Role.READ_RIGHT });
  await adminReadAccount.save();

  const adminWriteAccount: Account = await models.Account.findOne({
    where: {
      email: adminWrite.email
    }
  }) as Account;
  adminWriteAccount.set({ emailVerified: true, role: Role.WRITE_RIGHT });
  await adminWriteAccount.save();

  const superUserAccount: Account = await models.Account.findOne({
    where: {
      email: superuser.email
    }
  }) as Account;
  superUserAccount.set({ emailVerified: true, role: Role.SUPERUSER });
  await superUserAccount.save();

  res = await request.post(LOGIN_URI).send(nonMember);
  const nonMemberUserCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(user);
  const memberUserCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(adminRead);
  const adminReadCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(adminWrite);
  const adminWriteCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(superuser);
  const superuserCookies: Array<string> = res.headers['set-cookie'];

  return [
    memberUserCookies, adminReadCookies,
    adminWriteCookies, superuserCookies,
    nonMemberUserCookies
  ];
}

export function checkErrors(errors: Array<ApiErrorContent>, code: string): void {
  expect(errors.map((e: ApiErrorContent) => e.code)).toContain(code);
}
