const { expect, describe, beforeAll, afterAll, beforeEach, it } = require('@jest/globals');
const { createAccount, passwordData, stringData, expiredToken, account } = require('./utils/constants'); 
const { sessionEvaluator } = require('./utils/expectHelper');
const { connectToDatabase } = require('../database');
const errors = require('../util/errors/errors');
const mutations = require('./utils/mutations');
const sendRequest = require('./utils/request');
const { PORT } = require('../util/config');
const queries = require('./utils/queries');
const helpers = require('./utils/helper');
const server = require('../util/server');

describe('Account integration tests', () => {
  // eslint-disable-next-line no-unused-vars
  let testServer, testUrl, secondToken, loggedOutSession, token, memberAuthToken, memberAcc;

  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    const serverInfo = await server.listen({ port: PORT });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });

  beforeEach(async () => {
    await helpers.resetDatabaseEntries();
    [ memberAuthToken, memberAcc ] = await helpers.getToken(testUrl, account);
  });

  describe('JWT test', () => {

    it('Server should respond 200 ok to health check', async () => {
      helpers.healthCheck(testUrl);
    });
  
    it('Expired JWT should return error', async () => {
      const response = await sendRequest(testUrl, expiredToken, mutations.changePassword, passwordData);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.session.jwtExpiredError);
    });
  });

  describe('createAccounting an account', () => {

    it('New account created succesfully', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBe(createAccount.email);
      expect(response.body.data.createAccount.username).toBe(createAccount.username);
      expect(response.body.data.createAccount.languageId).toBe(createAccount.languageId);
      expect(response.body.data.createAccount.id).toBeDefined();
      expect(response.body.data.createAccount.lastLogin).toBeDefined();
      expect(response.body.data.createAccount.createdAt).toBeDefined();
      expect(response.body.data.createAccount.updatedAt).toBeDefined();
    });

    it('Error when email already taken', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: account.email });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email already taken, uppercase', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: account.email.toUpperCase() });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email not valid', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: stringData.nonValidEmail });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validation.notValidEmailError);
    });

    it('Error when username already taken', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: account.username });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, uppercase', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: account.username.toUpperCase() });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, lowercase', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: account.username.toLowerCase() });
      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when value not sent, email', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: null });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, username', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: null });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, password', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: null });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, password confirmation', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, passwordConfirmation: null });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when empty value, email', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: '' });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when empty value, username', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: '' });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when empty value, password', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: '' });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, password confirmation', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, passwordConfirmation: '' });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, email', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, email: 1 });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, username', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, username: 1 });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: 1 });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password confirmation', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, passwordConfirmation: 1 });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: 'NotMatching456', passwordConfirmation: 'Matching456' });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when password not long enough', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: stringData.notLongEnoughPass, passwordConfirmation: stringData.notLongEnoughPass });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when password too long', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: stringData.tooLongPassword, passwordConfirmation: stringData.tooLongPassword });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when password does not contain numbers', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: stringData.noNumbersPass, passwordConfirmation: stringData.noNumbersPass });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when password does not contain uppercase', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: stringData.noUpperCasePass, passwordConfirmation: stringData.noUpperCasePass });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when password does not contain lowercase', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, password: stringData.noLowerCasePass, passwordConfirmation: stringData.noLowerCasePass });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordLowercaseError);
    });

    it('Error when language id invalid', async () => {
      const response = await sendRequest(testUrl, null, mutations.createAccount, { ...createAccount, languageId: stringData.notAvailableLanguage });
      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Login to an account', () => {

    it('Login succesfully to an existing account', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.session).toBeDefined();
      expect(response.body.data.login.account.email).toBe(createAccount.email);
      expect(response.body.data.login.account.username).toBe(createAccount.username);
      expect(response.body.data.login.account.languageId).toBe(createAccount.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();
    });

    it('Error when email not verified', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailNotVerifiedError);
      expect(response.body.data?.login).toBeUndefined();
    });

    it('Error when empty value, email', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: '' });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when empty value, password', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, password: '' });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when email not send', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: null });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password not send', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, password: null });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, email', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: 1 });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, password: 1 });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when email not valid', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: stringData.nonValidEmail });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validation.notValidEmailError);
    });

    it('Error when account not found', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: stringData.nonExistingEmail });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });

    it('Error when password incorrect', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, password: stringData.incorrectPassword });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });
  });

  describe('Changing password', () => {

    it('Change password and login with new password succesfully', async () => {
      // create a new account
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      // login and receive token
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.session).toBeDefined();
      expect(response.body.data.login.account.email).toBe(createAccount.email);
      expect(response.body.data.login.account.username).toBe(createAccount.username);
      expect(response.body.data.login.account.languageId).toBe(createAccount.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();

      token = response.body.data.login.token;
      //set token as auth header and change password
      response = await sendRequest(testUrl, token, mutations.changePassword, passwordData);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changePassword.email).toBe(createAccount.email);
      expect(response.body.data.changePassword.username).toBe(createAccount.username);
      expect(response.body.data.changePassword.languageId).toBe(createAccount.languageId);
      expect(response.body.data.changePassword.id).toBeDefined();
      expect(response.body.data.changePassword.lastLogin).toBeDefined();
      expect(response.body.data.changePassword.createdAt).toBeDefined();
      expect(response.body.data.changePassword.updatedAt).toBeDefined();

      //login with new password
      response = await sendRequest(testUrl, null, mutations.login, {...createAccount, password: passwordData.newPassword});
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.session).toBeDefined();
      expect(response.body.data.login.account.email).toBe(createAccount.email);
      expect(response.body.data.login.account.username).toBe(createAccount.username);
      expect(response.body.data.login.account.languageId).toBe(createAccount.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();
    });

    it('Error when no token, not authenticated', async () => {
      const response = await sendRequest(testUrl, null, mutations.changePassword, passwordData);
      expect(response.body.data?.changePassword).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });
    
    it('Error when empty value, current password', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, currentPassword: '' });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, newPassword: '' });   
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password confirmation', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, newPasswordConfirmation: '' });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, current password (integer)', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, currentPassword: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password (integer)', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, newPassword: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password confirmation (integer)', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, newPasswordConfirmation: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, newPassword: stringData.incorrectPassword });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when new password is same as the old one', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: passwordData.currentPassword,
        newPasswordConfirmation: passwordData.currentPassword
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currAndNewPassEqualError);
    });

    it('Error when authorized but current password does not match with DB hash', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, { ...passwordData, currentPassword: '12345678' });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currentPasswordIncorrect);
    });

    it('Error when new password not long enough', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: stringData.notLongEnoughPass,
        newPasswordConfirmation: stringData.notLongEnoughPass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when new password is too long', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: stringData.tooLongPassword,
        newPasswordConfirmation: stringData.tooLongPassword
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when new password does not contain numbers', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: stringData.noNumbersPass,
        newPasswordConfirmation: stringData.noNumbersPass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when new password does not contain uppercase', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: stringData.noUpperCasePass,
        newPasswordConfirmation: stringData.noUpperCasePass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when new password does not contain lowercase', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, mutations.changePassword, {
        ...passwordData,
        newPassword: stringData.noLowerCasePass,
        newPasswordConfirmation: stringData.noLowerCasePass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordLowercaseError);
    });
  });

  describe('Email availability', () => {
    it('Should receive boolean true when email available', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: createAccount.email });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when email not available', async () => {
      await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: createAccount.email });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeFalsy();
    });
    
    it('Error when email not valid', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: stringData.nonValidEmail });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validation.notValidEmailError);
    });

    it('Error when email is empty value', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: '' });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when email value is wrong type', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: 1 });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when email value not send', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailable, { email: null });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Username availability', () => {
    it('Should receive boolean true when username available', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: createAccount.username });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when username not available', async () => {
      await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: createAccount.username });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeFalsy();
    });
    
    it('Error when username too short', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: stringData.tooShortUsername });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
    });

    it('Error when username too long', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: stringData.tooLongUsername });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMaxLengthError);
    });

    it('Error when username is empty value', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: '' });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when username value is wrong type', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: 1 });
      expect(response.body.data?.usernameAvailable.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when username value not send', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailable, { username: null });
      expect(response.body.data?.usernameAvailable.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Fetching sessions', () => {
    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.sessions, null);
      expect(response.body.data?.sessions).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Succesfully fetch sessions (3) logged in', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      response = await sendRequest(testUrl, token, queries.sessions, null);
      response.body.data.sessions.forEach(session => sessionEvaluator(session));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sessions.length).toBe(3);
    });

    it('After logging out, session is removed from results', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      secondToken = response.body.data.login.token;
      response = await sendRequest(testUrl, null, mutations.login, createAccount);

      loggedOutSession = await sendRequest(testUrl, token, mutations.logout, null);
      response = await sendRequest(testUrl, secondToken, queries.sessions, null);
      response.body.data.sessions.forEach(session => sessionEvaluator(session));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sessions.length).toBe(2);
      expect(response.body.data.sessions[0].id).not.toBe(loggedOutSession.body.data.logout);
      expect(response.body.data.sessions[1].id).not.toBe(loggedOutSession.body.data.logout);
    });

    it('Session expired error after accessing sessions with logged out token', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;

      loggedOutSession = await sendRequest(testUrl, token, mutations.logout, null);
      response = await sendRequest(testUrl, token, queries.sessions, null);
      expect(response.body.data?.sessions).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.session.sessionExpiredError);
    });
  });

  describe('Logging out', () => {
    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.logout, null);
      expect(response.body.data?.logout).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Succesfully logout when session exists', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;
      let session = response.body.data.login.session;

      response = await sendRequest(testUrl, token, mutations.logout, null);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.logout).toBe(session);
    });

    it('Session expired error after accessing with logged out token', async () => {
      let response = await sendRequest(testUrl, null, mutations.createAccount, createAccount);
      await helpers.verifyEmail(response.body.data.createAccount.id);
      response = await sendRequest(testUrl, null, mutations.login, createAccount);
      token = response.body.data.login.token;
      await sendRequest(testUrl, token, mutations.logout, null);

      response = await sendRequest(testUrl, token, mutations.logout, null);
      expect(response.body.data?.logout).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.session.sessionExpiredError);
    });
  });
});
