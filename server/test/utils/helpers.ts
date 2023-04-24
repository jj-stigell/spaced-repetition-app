import fs from 'fs';
import path from 'path';
import { QueryInterface, Transaction } from 'sequelize';
import supertest from 'supertest';

import { app } from '../../src/app';
import logger from '../../src/configs/winston';
import { sequelize } from '../../src/database';
import models from '../../src/database/models';
import Account from '../../src/database/models/account';
import { ApiErrorContent } from '../../src/type/error';
import { Role } from '../../src/type/general';
import { adminRead, adminWrite, LOGIN_URI, REGISTER_URI, superuser, user } from './constants';

const account: string = fs.readFileSync(
  path.resolve(__dirname, '../../mockData/account.sql'), 'utf8'
);

const bugReport: string = fs.readFileSync(
  path.resolve(__dirname, '../../mockData/bug_report.sql'), 'utf8'
);

const card: string = fs.readFileSync(
  path.resolve(__dirname, '../../mockData/card.sql'), 'utf8'
);

const queryInterface: QueryInterface = sequelize.getQueryInterface();
const request: supertest.SuperTest<supertest.Test> = supertest(app);
let res: supertest.Response;

export async function resetDatabase(): Promise<void> {
  // Truncate all data that might have been affected by the tests and reload them from file.
  const firstTransaction: Transaction = await queryInterface.sequelize.transaction();
  const secondTransaction: Transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.sequelize.query(
      'TRUNCATE bug_report, card, session, account, account_action;',
      { transaction: firstTransaction }
    );

    await queryInterface.sequelize.query(
      'ALTER SEQUENCE account_id_seq RESTART WITH 230792;', { transaction: firstTransaction }
    );

    await queryInterface.sequelize.query(
      'ALTER SEQUENCE bug_report_id_seq RESTART;', { transaction: firstTransaction }
    );

    await queryInterface.sequelize.query(
      'ALTER SEQUENCE card_id_seq RESTART;', { transaction: firstTransaction }
    );
    await firstTransaction.commit();
  } catch (err) {
    await firstTransaction.rollback();
    logger.error(err);
  }

  try {
    await queryInterface.sequelize.query(account, { transaction: secondTransaction });
    await queryInterface.sequelize.query(card, { transaction: secondTransaction });
    await queryInterface.sequelize.query(bugReport, { transaction: secondTransaction });
    await secondTransaction.commit();
  } catch (err) {
    await secondTransaction.rollback();
    logger.error(err);
  }
}

export async function getCookies():
Promise<[Array<string>, Array<string>, Array<string>, Array<string>]> {
  await request.post(REGISTER_URI).send(user);
  await request.post(REGISTER_URI).send(adminRead);
  await request.post(REGISTER_URI).send(adminWrite);
  await request.post(REGISTER_URI).send(superuser);

  const normalUser: Account = await models.Account.findOne({
    where: {
      email: user.email
    }
  }) as Account;
  normalUser.set({ emailVerified: true, role: Role.User });
  await normalUser.save();

  const adminReadAccount: Account = await models.Account.findOne({
    where: {
      email: adminRead.email
    }
  }) as Account;
  adminReadAccount.set({ emailVerified: true, role: Role.Read });
  await adminReadAccount.save();

  const adminWriteAccount: Account = await models.Account.findOne({
    where: {
      email: adminWrite.email
    }
  }) as Account;
  adminWriteAccount.set({ emailVerified: true, role: Role.Write });
  await adminWriteAccount.save();

  const superUserAccount: Account = await models.Account.findOne({
    where: {
      email: superuser.email
    }
  }) as Account;
  superUserAccount.set({ emailVerified: true, role: Role.Super });
  await superUserAccount.save();

  res = await request.post(LOGIN_URI).send(user);
  const userCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(adminRead);
  const adminReadCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(adminWrite);
  const adminWriteCookies: Array<string> = res.headers['set-cookie'];

  res = await request.post(LOGIN_URI).send(superuser);
  const superuserCookies: Array<string> = res.headers['set-cookie'];

  return [userCookies, adminReadCookies, adminWriteCookies, superuserCookies];
}

export function checkErrors(errors: Array<ApiErrorContent>, code: string): void {
  expect(errors.map((e: ApiErrorContent) => e.code)).toContain(code);
}
