const { expect, describe, it } = require('@jest/globals');
const { userAgents } = require('./utils/constants');
const helpersToTest = require('../util/helper');

describe('unit tests', () => {

  describe('Helper functions', () => {

    it('User-agent parser should return correct values', async () => {
      userAgents.forEach(agent => {
        const result = helpersToTest.parseUserAgent(agent.agent);
        expect(result.browser).toBe(agent.browser);
        expect(result.os).toBe(agent.os);
        expect(result.device).toBe(agent.device);
      });
    });

  });
});
