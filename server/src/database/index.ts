// Modules
import { Sequelize } from 'sequelize';

// Project imports
import credentials from '../configs/database';
import { NODE_ENV } from '../configs/environment';
import logger from '../configs/winston';

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

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('database connected');
  } catch (error) {
    logger.info('database connection failed', error);
  }
};
