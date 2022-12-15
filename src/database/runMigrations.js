const { runMigrations } = require('.');
const { NODE_ENV } = require('../util/config');

try {
  console.log('Running migrations on:', NODE_ENV);
  runMigrations();
} catch (error) {
  console.log(error);
}
