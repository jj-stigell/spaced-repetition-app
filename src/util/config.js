/** Load and export all the environment variables */
require('dotenv').config();

let DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;

switch (NODE_ENV) {
case 'production': {
  DATABASE_URL = process.env.PROD_POSTGRE_URL;
  break;
}
case 'test': {
  DATABASE_URL = process.env.TEST_POSTGRE_URL;
  break;
}
default: {
  DATABASE_URL = process.env.DEV_POSTGRE_URL;
}
}

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const ENVIRONMENT = {
  DEVELOPMENT: NODE_ENV === 'development',
  TEST: NODE_ENV === 'test',
  STAGING: NODE_ENV === 'staging',
  PRODUCTION: NODE_ENV === 'production',
};

module.exports = {
  DATABASE_URL,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  ENVIRONMENT
};
