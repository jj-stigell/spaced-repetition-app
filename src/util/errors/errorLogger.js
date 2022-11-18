const { NODE_ENV } = require('../config');

/**
 * Log errors from functions
 * @param  {...any} params object, string, array of errors
 */
const errorLogger = (...params) => {
  if(NODE_ENV !== 'test') console.error(...params);
};

module.exports = errorLogger;
