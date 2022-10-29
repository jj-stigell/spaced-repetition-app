const { rollbackMigration } = require('.');
const { ENVIRONMENT, NODE_ENV } = require('../util/config');

if (ENVIRONMENT.PRODUCTION) {
  console.log('Be careful when rolling back, this is production version');
  return;
} else {
  console.log('Rolling back on:', NODE_ENV);
  rollbackMigration();
}
