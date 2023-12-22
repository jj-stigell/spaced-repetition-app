export const register: string = '/api/v1/auth/register' // POST for registering
export const login: string = '/api/v1/auth/login' // POST for logging in
export const logout: string = '/api/v1/auth/logout' // POST for logging out

export const confirmEmail: string = '/api/v1/account/confirmation' // POST for comfirming email
export const resendConfirmation: string = '/api/v1/account/confirmation/resend' // POST for ordering resend of confirmation email
export const resetPassword: string = '/api/v1/account/password/reset' // POST for link, PATCH for resetting
export const setPassword: string = '/api/v1/account/password' // PATCH for setting a new password
export const account: string = '/api/v1/account' // PATCH for updating, DELETE for setting account for deletion

export const getCategories: string = '/api/v1/category' // GET for fetching categories
export const getDecks: string = '/api/v1/deck' // GET for fetching decks
export const bugReport: string = '/api/v1/bug' // POST to send new bug report, GET to fetch all bug reports
