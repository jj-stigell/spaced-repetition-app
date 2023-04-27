import axios from 'axios'
import { REACT_APP_BACKEND } from '../config/environment'

export default axios.create({
  baseURL: REACT_APP_BACKEND,
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-type': 'application/json'
  }
})
