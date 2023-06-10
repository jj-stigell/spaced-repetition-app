import axios from 'axios'
import { REACT_APP_BACKEND } from '../config/environment'

// TODO: setup proper cache control, no-cache for now.
export default axios.create({
  baseURL: REACT_APP_BACKEND,
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-type': 'application/json',
    'Cache-Control': 'no-cache'
  }
})
