const parser = require('ua-parser-js');
const { internalServerError } = require('./errors/graphQlErrors');

const parseUserAgent = (userAgent) => {
  try {
    const parsedUserAgent = userAgent ? parser(userAgent) : null;
    const payload = {
      browser: parsedUserAgent?.browser.name ? parsedUserAgent.browser.name : '-',
      os: parsedUserAgent?.os.name ? parsedUserAgent?.os.name : '-',
      device: parsedUserAgent?.device.type ? parsedUserAgent.device.type : '-'
    };
    return payload;
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create anew date by summing days to the curent date
 * @param {integer} days Amount of full days
 * @returns new date n days from today
 */
const calculateDate = (days) => {
  const newDate = new Date();
  return newDate.setDate(newDate.getDate() + days);
};

module.exports = {
  parseUserAgent,
  calculateDate
};
