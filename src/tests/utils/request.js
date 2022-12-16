const request = require('supertest');

/**
 * Send a query request with payload to the test server
 * @param {string} testUrl - url for the server running the backend
 * @param {string} token - authorization token for accessing the server
 * @param {string} query - graphql query
 * @param {object} data - object containing the data for the query
 * @returns reponse to the request
 */
const sendRequest = async (testUrl, token, query, payload) => {
  if (token) {
    return await request(testUrl)
      .post('/')
      .set('Authorization', `bearer ${token}`)
      .send({ query: query, variables: payload });
  }
  return await request(testUrl)
    .post('/')
    .send({ query: query, variables: payload });
};

module.exports = sendRequest;
