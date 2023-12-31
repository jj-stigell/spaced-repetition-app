/**
 * Base URL of the backend server.
 * This variable holds the URL of the backend server that the React application will communicate with.
 * Defaults to 'http://localhost:3001' if the REACT_APP_BACKEND environment variable is not set.
 * For configuring different backend URLs for development, testing, and production environments.
 */
export const REACT_APP_BACKEND: string = process.env.REACT_APP_BACKEND ?? 'http://localhost:3001'

/**
 * Current Node environment.
 * This variable indicates the environment in which the Node application is running.
 * Possible values: 'development', 'production', and 'test'.
 * Defaults to 'development' if the NODE_ENV environment variable is not set.
 */
export const NODE_ENV: string = process.env.NODE_ENV ?? 'development'
