const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, passwordData, stringData } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');

describe('account integration tests', () => {
  let testServer, testUrl, authToken;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    await helpers.resetDatabaseEntries('account');
    const serverInfo = await server.listen({ port: PORT });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });

  it('Server should respond 200 ok to health check', async () => {
    const response = await request(`${testUrl}.well-known/apollo/server-health`)
      .post('/')
      .send({ query: mutations.registerMutation, variables: account });

    expect(response.body.status).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('pass');
  });

  describe('Registering an account', () => {

    it('New account created succesfully', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBe(account.email);
      expect(response.body.data.createAccount.username).toBe(account.username);
      expect(response.body.data.createAccount.languageId).toBe(account.languageId);
      expect(response.body.data.createAccount.id).toBeDefined();
      expect(response.body.data.createAccount.lastLogin).toBeDefined();
      expect(response.body.data.createAccount.createdAt).toBeDefined();
      expect(response.body.data.createAccount.updatedAt).toBeDefined();
    });

    it('Error when email already taken', async () => {
      const newAccount = { ...account, username: stringData.availableUsername };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email already taken, uppercase', async () => {
      const newAccount = { ...account, email: account.email.toUpperCase(), username: stringData.availableUsername };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.emailInUseError);
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: stringData.nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when username already taken', async () => {
      const newAccount = { ...account, email: stringData.availableEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, uppercase', async () => {
      const newAccount = { ...account, email: stringData.availableEmail, username: account.username.toUpperCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when username already taken, lowercase', async () => {
      const newAccount = { ...account, email: stringData.availableEmail, username: account.username.toLocaleLowerCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameInUseError);
    });

    it('Error when empty value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when empty value, username', async () => {
      const newAccount = { ...account, username: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when empty value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, password confirmation', async () => {
      const newAccount = { ...account, passwordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, email', async () => {
      const newAccount = { ...account, email: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, username', async () => {
      const newAccount = { ...account, username: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password', async () => {
      const newAccount = { ...account, password: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password confirmation', async () => {
      const newAccount = { ...account, passwordConfirmation: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      const newAccount = {
        ...account,
        password: 'NotMatching456',
        passwordConfirmation: 'Matching456'
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when password not long enough', async () => {
      const newAccount = {
        ...account,
        password: stringData.notLongEnoughPass,
        passwordConfirmation: stringData.notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when password too long', async () => {
      const newAccount = {
        ...account,
        password: stringData.tooLongPassword,
        passwordConfirmation: stringData.tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when password does not contain numbers', async () => {
      const newAccount = {
        ...account,
        password: stringData.noNumbersPass,
        passwordConfirmation: stringData.noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when password does not contain uppercase', async () => {
      const newAccount = {
        ...account,
        password: stringData.noUpperCasePass,
        passwordConfirmation: stringData.noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when password does not contain lowercase', async () => {
      const newAccount = {
        ...account,
        password: stringData.noLowerCasePass,
        passwordConfirmation: stringData.noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordLowercaseError);
    });

    it('Error when language id invalid', async () => {
      const newAccount = {
        ...account,
        languageId: stringData.notAvailableLanguage
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data?.createAccount.email).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Login to an account', () => {

    it('Login succesfully to an existing account', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.account.email).toBe(account.email);
      expect(response.body.data.login.account.username).toBe(account.username);
      expect(response.body.data.login.account.languageId).toBe(account.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();
    });

    it('Error when empty value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when empty value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when value with wrong type, email', async () => {
      const newAccount = { ...account, email: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, password', async () => {
      const newAccount = { ...account, password: 1 };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: stringData.nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when account not found', async () => {
      const newAccount = { ...account, email: stringData.nonExistingEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });

    it('Error when password incorrect', async () => {
      const newAccount = { ...account, password: stringData.incorrectPassword };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data?.login).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.userOrPassIncorrectError);
    });
  });

  describe('Changing password', () => {

    it('Change password and login with new password succesfully', async () => {
      //login and receive token
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });
      
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token.value).toBeDefined();
      expect(response.body.data.login.account.email).toBe(account.email);
      expect(response.body.data.login.account.username).toBe(account.username);
      expect(response.body.data.login.account.languageId).toBe(account.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();

      authToken = response.body.data.login.token.value;
      //set token as auth header and change password
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changePassword.email).toBe(account.email);
      expect(response.body.data.changePassword.username).toBe(account.username);
      expect(response.body.data.changePassword.languageId).toBe(account.languageId);
      expect(response.body.data.changePassword.id).toBeDefined();
      expect(response.body.data.changePassword.lastLogin).toBeDefined();
      expect(response.body.data.changePassword.createdAt).toBeDefined();
      expect(response.body.data.changePassword.updatedAt).toBeDefined();

      //login with new password
      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: {...account, password: passwordData.newPassword} });

      authToken = response.body.data.login.token.value;
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token.value).toBeDefined();
      expect(response.body.data.login.account.email).toBe(account.email);
      expect(response.body.data.login.account.username).toBe(account.username);
      expect(response.body.data.login.account.languageId).toBe(account.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();
    });

    it('Error when no token, not authenticated', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.data?.changePassword).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });
    
    it('Error when empty value, current password', async () => {
      const data = { ...passwordData, currentPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password', async () => {
      const data = { ...passwordData, newPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });
      
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordError);
    });

    it('Error when empty value, new password confirmation', async () => {
      const data = { ...passwordData, newPasswordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when value with wrong type, current password', async () => {
      const data = { ...passwordData, currentPassword: 1 };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password', async () => {
      const data = { ...passwordData, newPassword: 1 };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });
      
      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when value with wrong type, new password confirmation', async () => {
      const data = { ...passwordData, newPasswordConfirmation: 1 };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when password and password confirmation do not match', async () => {
      const data = { ...passwordData, newPassword: stringData.incorrectPassword };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMismatchError);
    });

    it('Error when new password is same as the old one', async () => {
      const data = {
        ...passwordData,
        newPassword: passwordData.currentPassword,
        newPasswordConfirmation: passwordData.currentPassword
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currAndNewPassEqualError);
    });

    it('Error when authorized but current password does not match with DB hash', async () => {
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.currentPasswordIncorrect);
    });

    it('Error when new password not long enough', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.notLongEnoughPass,
        newPasswordConfirmation: stringData.notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMinLengthError);
    });

    it('Error when new password is too long', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.tooLongPassword,
        newPasswordConfirmation: stringData.tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordMaxLengthError);
    });

    it('Error when new password does not contain numbers', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noNumbersPass,
        newPasswordConfirmation: stringData.noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordNumberError);
    });

    it('Error when new password does not contain uppercase', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noUpperCasePass,
        newPasswordConfirmation: stringData.noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordUppercaseError);
    });

    it('Error when new password does not contain lowercase', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noLowerCasePass,
        newPasswordConfirmation: stringData.noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data?.changePassword.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.passwordLowercaseError);
    });
  });

  describe('Email availability', () => {

    it('Should receive boolean true when email available', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.emailAvailableQuery, variables: { email: stringData.availableEmail } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when email not available', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.emailAvailableQuery, variables: { email: account.email } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.emailAvailable).toBeFalsy();
    });
    
    it('Error when email not valid', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.emailAvailableQuery, variables: { email: stringData.nonValidEmail } });

      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.notEmailError);
    });

    it('Error when email is empty value', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.emailAvailableQuery, variables: { email: '' } });

      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.requiredEmailError);
    });

    it('Error when email value is wrong type', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.emailAvailableQuery, variables: { email: 1 } });

      expect(response.body.data?.emailAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });

  describe('Username availability', () => {

    it('Should receive boolean true when username available', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: stringData.availableUsername } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeTruthy();
    });
    
    it('Should receive boolean false when username not available', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: account.username } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.usernameAvailable).toBeFalsy();
    });
    
    it('Error when username too short', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: stringData.tooShortUsername } });

      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
    });

    it('Error when username too long', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: stringData.tooLongUsername } });

      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMaxLengthError);
    });

    it('Error when username is empty value', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: '' } });

      expect(response.body.data?.usernameAvailable).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.usernameMinLengthError);
      expect(response.body.errors[0].extensions.code).toContain(errors.account.requiredUsernameError);
    });

    it('Error when username value is wrong type', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: queries.usernameAvailableQuery, variables: { username: 1 } });

      expect(response.body.data?.usernameAvailable.status).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
  });
});