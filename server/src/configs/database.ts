import * as dotenv from 'dotenv';
dotenv.config();

const username: string = String(process.env.POSTGRES_USER);
const password: string = String(process.env.POSTGRES_PASSWORD);
const database: string = String(process.env.POSTGRES_DATABASE);
const host: string = String(process.env.POSTGRES_HOST);
const port: number = isNaN(Number(process.env.POSTGRES_PORT)) ?
  5432 : Number(process.env.POSTGRES_PORT);

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
