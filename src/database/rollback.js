const { rollbackMigration } = require('.');
const { NODE_ENV } = require('../util/config');

if (NODE_ENV === 'production') {
  console.log('Be careful when rolling back, this is production version');
  return;
} else {
  console.log('Rolling back on:', NODE_ENV);
  rollbackMigration();
}
