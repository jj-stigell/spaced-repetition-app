import axios from 'axios'
import { API_SERVER } from '../config/environment'

export default axios.create({
  baseURL: API_SERVER,
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-type': 'application/json'
  }
})
