const mutations = {
  registerMutation: `mutation createAccount($email: String!, $username: String!, $password: String!, $passwordConfirmation: String!, $languageId: Language!) {
    createAccount(email: $email, username: $username, password: $password, passwordConfirmation: $passwordConfirmation, languageId: $languageId) {
      id
      email
      emailVerified
      username
      languageId
      lastLogin
      createdAt
      updatedAt
    }
  }`,
  loginMutation: `mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token {
        value
      }
      account {
        id
        email
        emailVerified
        username
        languageId
        lastLogin
        createdAt
        updatedAt
      }
    }
  }`,
  changePasswordMutation: `mutation changePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      id
      email
      emailVerified
      username
      languageId
      lastLogin
      createdAt
      updatedAt
    }
  }`,
};

module.exports = mutations;
