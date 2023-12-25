/**
 * Endpoint for user registration.
 * Method: POST
 * Use this endpoint to register new users by providing necessary user details such as username, email, and password.
 */
export const register: string = '/api/v1/auth/register'

/**
 * Endpoint for user login.
 * Method: POST
 * This endpoint authenticates users by checking their credentials. Upon successful authentication, it returns a session token or user details.
 */
export const login: string = '/api/v1/auth/login'

/**
 * Endpoint for user logout.
 * Method: POST
 * This endpoint ends the user's session, effectively logging them out of the application. It may require the current session token or user ID.
 */
export const logout: string = '/api/v1/auth/logout'

/**
 * Endpoint for email confirmation.
 * Method: POST
 * Use this endpoint to confirm the user's email address. This is typically used as part of the registration process, where the user receives a confirmation link via email.
 */
export const confirmEmail: string = '/api/v1/account/confirmation'

/**
 * Endpoint for resending the email confirmation.
 * Method: POST
 * This endpoint allows resending the email confirmation in case the user didn't receive the initial email. It generally requires the user's email address.
 */
export const resendConfirmation: string = '/api/v1/account/confirmation/resend'

/**
 * Endpoint for password reset functionality.
 * Methods: POST (for sending a password reset link), PATCH (for resetting the password using the provided link)
 * The POST method sends a password reset link to the user's email. The PATCH method allows the user to set a new password using the token received in the link.
 */
export const resetPassword: string = '/api/v1/account/password/reset'

/**
 * Endpoint for setting a new password.
 * Method: PATCH
 * This endpoint is used for changing the user's current password. It usually requires the user's old password for security purposes, along with the new password.
 */
export const setPassword: string = '/api/v1/account/password'

/**
 * Endpoint for managing user account details.
 * Methods: PATCH (for updating account details), DELETE (for deleting the account)
 * The PATCH method is used for updating user profile information. The DELETE method allows users to delete their account from the system.
 */
export const account: string = '/api/v1/account'

/**
 * Endpoint for fetching categories.
 * Method: GET
 * This endpoint retrieves a list of all available categories. It can be used to display categories in the user interface for browsing or filtering purposes.
 */
export const getCategories: string = '/api/v1/category'

/**
 * Endpoint for fetching decks.
 * Method: GET
 * This endpoint provides a list of decks. Decks might refer to collections or sets of items, depending on the application context.
 */
export const getDecks: string = '/api/v1/deck'

/**
 * Endpoint for bug reporting and retrieval.
 * Methods: POST (to send a new bug report), GET (to fetch all bug reports)
 * The POST method allows users to report new bugs or issues. The GET method is used to retrieve a list of all reported bugs, possibly for administrative or debugging purposes.
 */
export const bugReport: string = '/api/v1/bug'
