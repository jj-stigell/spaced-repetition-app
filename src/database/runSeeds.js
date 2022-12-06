const { runSeeds } = require('.');
const { NODE_ENV } = require('../util/config');

try {
  console.log('Running seeds on:', NODE_ENV);
  runSeeds();
} catch (error) {
  console.log(error);
}
