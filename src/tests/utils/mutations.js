const mutations = {
  registerMutation: `mutation createAccount($email: String!, $password: String!, $passwordConfirmation: String!, $languageId: String) {
    createAccount(email: $email, password: $password, passwordConfirmation: $passwordConfirmation, languageId: $languageId) {
      id
      email
    }
  }`,
  loginMutation: `mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token {
        value
      }
      user {
        id,
        email
      }
    }
  }`,
  changePasswordMutation: `mutation changePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      status
    }
  }`,
};

module.exports = mutations;
