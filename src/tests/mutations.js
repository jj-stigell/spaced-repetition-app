const mutations = {
  registerMutation: `mutation createAccount($email: String!, $password: String!, $passwordConfirmation: String!, $languageId: String) {
    createAccount(email: $email, password: $password, passwordConfirmation: $passwordConfirmation, languageId: $languageId) {
      ... on Error {
        errorCodes
      }
      ... on Account {
        id
        email
      }
    }
  }`,
  loginMutation: `mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on Error {
        errorCodes
      }
      ... on AccountToken {
        token {
          value
        }
        user {
          id,
          email
        }
      }
    }
  }`,
  changePasswordMutation: `mutation changePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      ... on Error {
        errorCodes
      }
      ... on Success {
        status
      }
    }
  }`,
};

module.exports = mutations;
