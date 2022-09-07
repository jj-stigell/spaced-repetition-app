/** Load and export all the environment variables */
import 'dotenv/config';

let POSTGRE_URL;

switch(process.env.NODE_ENV) {
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

const ENVIRONMENT = {
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  TEST: process.env.NODE_ENV === 'test',
  STAGING: process.env.NODE_ENV === 'staging',
  PRODUCTION: process.env.NODE_ENV === 'production',
};

export {
  POSTGRE_URL,
  PORT,
  ENVIRONMENT
};
