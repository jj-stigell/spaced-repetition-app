const mutations = {
  registerMutation: `mutation createAccount($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
    createAccount(username: $username, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      ... on Error {
        errorCode
      }
      ... on Account {
        email
      }
    }
  }`,
  loginMutation: `mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on Error {
        errorCode
      }
      ... on AccountToken {
        token {
          value
        }
        user {
          id,
          email,
          username
        }
      }
    }
  }`,
  changePasswordMutation: `mutation changePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      ... on Error {
        errorCode
      }
      ... on Success {
        status
      }
    }
  }`,
};

module.exports = mutations;
