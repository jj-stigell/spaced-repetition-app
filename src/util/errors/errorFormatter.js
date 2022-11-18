/**
 * Format Yup validation errors.
 * @param {array} errors, yup errors
 * @returns {Array<string>} string array, each error from errors list
 */
const formatYupError = (errors) => {
  const errorArray = [];
  errors.inner.forEach(error => {
    errorArray.push(error.message);
  });
  return errorArray;
};

module.exports = formatYupError;
