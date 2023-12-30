import { Sequelize } from 'sequelize';

import credentials from '../configs/database';
import { NODE_ENV } from '../configs/environment';
import logger from '../configs/winston';

/**
 * Sequelize Database Connection:
 * Configures and initializes the Sequelize connection to the PostgreSQL database.
 * The connection utilizes credentials and settings defined in '../configs/database'.
 *
 * Features:
 * - Different options based on the environment (e.g., SSL configuration in production).
 * - Includes settings for model definition like timestamp usage, underscored column names, and
 *   freezing table names to prevent automatic pluralization.
 * - Configures logging to use Winston logger in development and disables it in other environments.
 *
 * The `sequelize` instance is exported and used throughout the application for database operations.
 *
 * @returns {Sequelize} - An instance of Sequelize configured for the PostgreSQL database.
 */
export const sequelize: Sequelize = new Sequelize(
  credentials.database as string,
  credentials.username as string,
  credentials.password,
  {
    host: credentials.host,
    port: credentials.port,
    dialect: 'postgres',
    dialectOptions: NODE_ENV === 'production' ? {
      ssl: {
        require: true
      }
    } : undefined,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    logging: (msg: string) => NODE_ENV === 'development' ? logger.info(msg) : false
  }
);

/**
 * Asynchronous Function to Connect to the Database:
 * Attempts to authenticate the Sequelize connection to the database.
 * Logs the status of the connection attempt.
 *
 * Usage:
 * This function should be called during application initialization to establish
 * a connection to the database.
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('postgresql database connected');
  } catch (error) {
    logger.error('postgresql database connection failed', error);
  }
};
