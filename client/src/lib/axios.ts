import axios, { AxiosError } from 'axios'
import { REACT_APP_BACKEND } from 'src/config/environment'
import { constants } from 'src/config/constants'
import { setNotification } from 'src/features/notificationSlice'
import i18n from 'src/i18n'

// TODO: setup proper cache control, no-cache for now.
const axiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND,
  timeout: constants.timeout,
  withCredentials: true,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-type': 'application/json',
    'Cache-Control': 'no-cache'
  }
})

let store: any

/**
 * For using redux store in axios interceptor.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
export const injectStore = (_store: any): void => {
  store = _store
}

/**
 * Axios interceptor to handle errors. This interceptor will be called
 * when a response error occurs. It will dispatch a notification
 * to the notificationSlice with correct translation or error message in case
 * of an axios error.
 */
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    let errorCode: string | null = null

    if (Array.isArray(error?.response?.data?.errors)) {
      errorCode = error?.response?.data?.errors[0].code
    }

    if (errorCode != null) {
      await store.dispatch(setNotification({ message: i18n.t(`errors.${errorCode}`), severity: 'error' }))
    } else if (error instanceof AxiosError) {
      await store.dispatch(setNotification({ message: error.message, severity: 'error' }))
    } else {
      await store.dispatch(setNotification({ message: i18n.t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
    }

    // Return a rejection to propagate the error.
    return await Promise.reject(error)
  }
)

export default axiosInstance
