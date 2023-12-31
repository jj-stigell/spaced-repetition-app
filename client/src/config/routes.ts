/**
 * Routes for the application react router. These are used in the
 * application to navigate to different pages. The routes are
 * defined here so that they can be easily changed in one place.
 */
const routes = {
  dashboard: '/',
  category: '/study',
  statistics: '/statistics',
  admin: '/admin',
  about: '/about',
  privacy: '/privacy',
  tos: '/tos',
  contact: '/contact',
  adminBugReports: '/admin/reports',
  adminDeckInfo: '/admin/deck/:id',
  settings: '/settings',
  decks: '/study/decks/:category',
  studyDeck: '/study/deck/:id',
  study: '/study',
  exam: '/exam',
  login: '/auth/login',
  register: '/auth/register',
  emailConfirm: '/auth/confirm-email/:confirmationId',
  requestEmailConfirm: '/auth/confirm-email',
  resetPassword: '/auth/forgot-password/reset/:confirmationId',
  requestResetPassword: '/auth/forgot-password'
}

export default routes
