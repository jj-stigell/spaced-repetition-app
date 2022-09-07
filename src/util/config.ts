/** Load and export all the environment variables */
import dotenv from 'dotenv';
dotenv.config();

export default {
  POSTGRE_URL: process.env.POSTGRE_URL,
  PORT: process.env.PORT || 3001
};
