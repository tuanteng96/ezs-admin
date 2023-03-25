import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage } from './localStorage'

class Http {
  constructor() {
    this.pathLogin = ['/admin/login.aspx?login=1', '/api/v3/user@setpwd']
    this.accessToken = getLocalStorage('access_token')
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      headers: {
        'content-type': 'text/plain'
      }
    })

    this.instance.interceptors.request.use(
      config => {
        if (this.accessToken) {
          config.headers.Authorization = 'Bearer ' + this.accessToken
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // Add response interceptor
    this.instance.interceptors.response.use(
      ({ data, ...response }) => {
        if (this.pathLogin.includes(response.config.url) && data?.token) {
          this.accessToken = data?.token
        }
        return {
          data
        }
      },
      error => {
        toast.error(error.message)
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
