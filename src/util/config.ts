/** Load and export all the environment variables */
import 'dotenv/config';

let POSTGRE_URL: unknown;

switch (process.env.NODE_ENV) {
  case 'production': {
    POSTGRE_URL = process.env.POSTGRE_URL;
    break;
  }
  case 'test': {
    POSTGRE_URL = process.env.TEST_POSTGRE_URL;
    break;
  }
  default: {
    POSTGRE_URL = process.env.DEV_POSTGRE_URL;
  }
}

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV;

const ENVIRONMENT = {
  DEVELOPMENT: NODE_ENV === 'development',
  TEST: NODE_ENV === 'test',
  STAGING: NODE_ENV === 'staging',
  PRODUCTION: NODE_ENV === 'production',
};

export {
  POSTGRE_URL,
  PORT,
  NODE_ENV,
  ENVIRONMENT
};
