const { rollbackMigration } = require('./database');
const { ENVIRONMENT, NODE_ENV } = require('./config');

if (ENVIRONMENT.PRODUCTION) {
  console.log('Be careful when rolling back, this is production version');
  return;
} else {
  console.log('Rolling back on:', NODE_ENV);
  rollbackMigration();
}
