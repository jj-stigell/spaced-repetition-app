export const register: string = '/api/v1/auth/register' // POST
export const login: string = '/api/v1/auth/login' // POST
export const logout: string = '/api/v1/auth/logout' // POST
export const confirmEmail: string = '/api/v1/account/confirmation' // POST
export const resendConfirmation: string = '/api/v1/account/confirmation/resend' // POST
export const resetPassword: string = '/api/v1/account/password/reset' // POST for link, PATCH for resetting
export const setPassword: string = '/api/v1/account/password' // PATCH for setting a new password
export const changeJlptLevel: string = '/api/v1/account/jlpt-level' // PATCH for updating
