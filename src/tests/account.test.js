const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { createAccount, passwordData, stringData, expiredToken } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');
const sendRequest = require('./utils/request');

describe('accountintegration tests', () => {
  let testServer, testUrl, firstToken, secondToken, thirdToken, loggedOutSession;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    await helpers.resetDatabaseEntries();
    const serverInfo = await server.listen({ port: PORT });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });

  it('Server should respond 200 ok to health check', async () => {
    helpers.healthCheck(testUrl);
  });

  it('Expired JWT should return error', async () => {
    const response = await sendRequest(testUrl, expiredToken, mutations.sendBugReportMutation, null);
    expect(response.body.data).toBeUndefined();
    expect(response.body.errors[0].extensions.code).toContain(errors.session.jwtExpiredError);
  });

  describe('Registering an account', () => {

    it('New account created succesfully', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: createAccount });

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
      const newAccount = { ...createAccount, username: stringData.availableUsername };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email already taken, uppercase', async () => {
      const newAccount = { ...createAccount, email: createAccount.email.toUpperCase(), username: stringData.availableUsername };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...createAccount, email: stringData.nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when username already taken', async () => {
      const newAccount = { ...createAccount, email: stringData.availableEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, uppercase', async () => {
      const newAccount = { ...createAccount, email: stringData.availableEmail, username: createAccount.username.toUpperCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, lowercase', async () => {
      const newAccount = { ...createAccount, email: stringData.availableEmail, username: createAccount.username.toLocaleLowerCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when value not sent, email', async () => {
      const newAccount = { ...createAccount, email: undefined };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, username', async () => {
      const newAccount = { ...createAccount, username: undefined };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, password', async () => {
      const newAccount = { ...createAccount, password: undefined };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when value not sent, password confirmation', async () => {
      const newAccount = { ...createAccount, passwordConfirmation: undefined };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toBe(errors.graphQlErrors.badUserInput);
    });

    it('Error when empty value, email', async () => {
      const newAccount = { ...createAccount, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when empty value, username', async () => {
      const newAccount = { ...createAccount, username: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when empty value, password', async () => {
      const newAccount = { ...createAccount, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, password confirmation', async () => {
      const newAccount = { ...createAccount, passwordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, email', async () => {
      const newAccount = { ...createAccount, email: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, username', async () => {
      const newAccount = { ...createAccount, username: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password', async () => {
      const newAccount = { ...createAccount, password: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password confirmation', async () => {
      const newAccount = { ...createAccount, passwordConfirmation: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      const newAccount = {
        ...createAccount,
        password: 'NotMatching456',
        passwordConfirmation: 'Matching456'
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when password not long enough', async () => {
      const newAccount = {
        ...createAccount,
        password: stringData.notLongEnoughPass,
        passwordConfirmation: stringData.notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when password too long', async () => {
      const newAccount = {
        ...createAccount,
        password: stringData.tooLongPassword,
        passwordConfirmation: stringData.tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when password does not contain numbers', async () => {
      const newAccount = {
        ...createAccount,
        password: stringData.noNumbersPass,
        passwordConfirmation: stringData.noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when password does not contain uppercase', async () => {
      const newAccount = {
        ...createAccount,
        password: stringData.noUpperCasePass,
        passwordConfirmation: stringData.noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when password does not contain lowercase', async () => {
      const newAccount = {
        ...createAccount,
        password: stringData.noLowerCasePass,
        passwordConfirmation: stringData.noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordLowercaseError);
    });

    it('Error when language id invalid', async () => {
      const newAccount = {
        ...createAccount,
        languageId: stringData.notAvailableLanguage
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.register, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Login to an account', () => {

    it('Login succesfully to an existing account', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, createAccount);
      firstToken = response.body.data.login.token;
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
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when account not found', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, email: stringData.nonExistingEmail });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });

    it('Error when password incorrect', async () => {
      const response = await sendRequest(testUrl, null, mutations.login, { ...createAccount, password: stringData.incorrectPassword });
      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });
  });

  describe('Changing password', () => {

    it('Change password and login with new password succesfully', async () => {
      //login and receive token
      let response = await sendRequest(testUrl, null, mutations.login, createAccount);
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

      secondToken = response.body.data.login.token;
      //set token as auth header and change password
      response = await sendRequest(testUrl, secondToken, mutations.changePasswordMutation, passwordData);
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
      thirdToken = response.body.data.login.token;
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
      const response = await sendRequest(testUrl, null, mutations.changePasswordMutation, passwordData);
      expect(response.body.data?.changePassword).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });
    
    it('Error when empty value, current password', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, currentPassword: '' });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, newPassword: '' });   
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password confirmation', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, newPasswordConfirmation: '' });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, current password (integer)', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, currentPassword: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password (integer)', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, newPassword: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password confirmation (integer)', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, newPasswordConfirmation: 1 });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, { ...passwordData, newPassword: stringData.incorrectPassword });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when new password is same as the old one', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
        ...passwordData,
        newPassword: passwordData.currentPassword,
        newPasswordConfirmation: passwordData.currentPassword
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currAndNewPassEqualError);
    });

    it('Error when authorized but current password does not match with DB hash', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, passwordData);
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currentPasswordIncorrect);
    });

    it('Error when new password not long enough', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
        ...passwordData,
        newPassword: stringData.notLongEnoughPass,
        newPasswordConfirmation: stringData.notLongEnoughPass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when new password is too long', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
        ...passwordData,
        newPassword: stringData.tooLongPassword,
        newPasswordConfirmation: stringData.tooLongPassword
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when new password does not contain numbers', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
        ...passwordData,
        newPassword: stringData.noNumbersPass,
        newPasswordConfirmation: stringData.noNumbersPass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when new password does not contain uppercase', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
        ...passwordData,
        newPassword: stringData.noUpperCasePass,
        newPasswordConfirmation: stringData.noUpperCasePass
      });
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when new password does not contain lowercase', async () => {
      const response = await sendRequest(testUrl, thirdToken, mutations.changePasswordMutation, {
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
      const response = await sendRequest(testUrl, null, queries.emailAvailableQuery, { email: stringData.availableEmail });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when email not available', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailableQuery, { email: createAccount.email });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeFalsy();
    });
    
    it('Error when email not valid', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailableQuery, { email: stringData.nonValidEmail });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when email is empty value', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailableQuery, { email: '' });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when email value is wrong type', async () => {
      const response = await sendRequest(testUrl, null, queries.emailAvailableQuery, { email: 1 });
      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Username availability', () => {
    it('Should receive boolean true when username available', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: stringData.availableUsername });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when username not available', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: createAccount.username });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeFalsy();
    });
    
    it('Error when username too short', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: stringData.tooShortUsername });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
    });

    it('Error when username too long', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: stringData.tooLongUsername });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMaxLengthError);
    });

    it('Error when username is empty value', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: '' });
      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when username value is wrong type', async () => {
      const response = await sendRequest(testUrl, null, queries.usernameAvailableQuery, { username: 1 });
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
      const response = await sendRequest(testUrl, firstToken, queries.sessions, null);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sessions.length).toBe(3);
      expect(response.body.data.sessions[0].id).toBeDefined();
      expect(response.body.data.sessions[0].browser).toBeDefined();
      expect(response.body.data.sessions[0].os).toBeDefined();
      expect(response.body.data.sessions[0].device).toBeDefined();
      expect(response.body.data.sessions[0].createdAt).toBeDefined();
      expect(response.body.data.sessions[0].expireAt).toBeDefined();
    });

    it('After logging out, session is removed from results', async () => {
      loggedOutSession = await sendRequest(testUrl, firstToken, mutations.logout, null);
      const response = await sendRequest(testUrl, secondToken, queries.sessions, null);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sessions.length).toBe(2);
      expect(response.body.data.sessions[0].id).toBeDefined();
      expect(response.body.data.sessions[0].browser).toBeDefined();
      expect(response.body.data.sessions[0].os).toBeDefined();
      expect(response.body.data.sessions[0].device).toBeDefined();
      expect(response.body.data.sessions[0].createdAt).toBeDefined();
      expect(response.body.data.sessions[0].expireAt).toBeDefined();
      expect(response.body.data.sessions[0].id).not.toBe(loggedOutSession.body.data.logout);
      expect(response.body.data.sessions[1].id).not.toBe(loggedOutSession.body.data.logout);
    });

    it('Session expired error after accessing sessions with logged out token', async () => {
      const response = await sendRequest(testUrl, firstToken, queries.sessions, null);
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
      const response = await sendRequest(testUrl, secondToken, mutations.logout, null);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.logout).toBeDefined();
    });

    it('Session expired error after accessing with logged out token', async () => {
      const response = await sendRequest(testUrl, secondToken, mutations.logout, null);
      expect(response.body.data?.logout).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.session.sessionExpiredError);
    });
  });
});
