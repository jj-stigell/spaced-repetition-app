import * as dotenv from 'dotenv';
dotenv.config();

import { NODE_ENV } from './environment';
import logger from './winston';

/**
 * This module is dedicated to defining the database environment variables
 * for configuring the PostgreSQL connection. The environment variables are
 * encapsulated in this file because Sequelize directly loads the database
 * configuration from here.
 */

const username: string | undefined = process.env.POSTGRES_USER;
const password: string | undefined = process.env.POSTGRES_PASSWORD;
const database: string | undefined = process.env.POSTGRES_DATABASE;
const host: string | undefined = process.env.POSTGRES_HOST;
const port: number = isNaN(Number(process.env.POSTGRES_PORT)) ?
  5432 : Number(process.env.POSTGRES_PORT);

if ((!username || !password || !database || !host) && NODE_ENV === 'production') {
  logger.error('PostgreSQL credential(s) missing, required in production!');
  process.exit();
}

export = {
  username,
  password,
  database,
  host,
  port,
  dialect: 'postgres',
  migrationStorageTableName: 'migrations',
  seederStorage: 'sequelize',
  seederStorageTableName: 'seeds'
};
