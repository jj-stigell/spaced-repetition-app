const { NODE_ENV } = require('../config');

const errorLogger = (...params) => {
  if(NODE_ENV !== 'test') console.error(...params);
};

module.exports = errorLogger;
