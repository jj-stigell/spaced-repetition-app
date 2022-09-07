/** Load and export all the environment variables */
import 'dotenv/config';

const POSTGRE_URL = process.env.POSTGRE_URL;
const PORT = process.env.PORT || 3001;
const DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';
const PRODUCTION: boolean = process.env.NODE_ENV === 'production';

export {
  POSTGRE_URL,
  PORT,
  DEVELOPMENT,
  PRODUCTION
};
