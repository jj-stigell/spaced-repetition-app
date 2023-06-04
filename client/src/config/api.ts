export const register: string = '/api/v1/auth/register' // POST
export const login: string = '/api/v1/auth/login' // POST
export const logout: string = '/api/v1/auth/logout' // POST
export const confirmEmail: string = '/api/v1/account/confirmation' // POST
export const resendConfirmation: string = '/api/v1/account/confirmation/resend' // POST
export const resetPassword: string = '/api/v1/account/password/reset' // POST for link, PATCH for resetting
export const setPassword: string = '/api/v1/account/password' // PATCH for setting a new password
export const changeSettings: string = '/api/v1/account' // PATCH for updating
export const getCategories: string = '/api/v1/category' // GET for fetching categories
export const getDecks: string = '/api/v1/deck' // GET for fetching decks
