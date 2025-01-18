import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage } from './localStorage'

class HttpInvoice {
  constructor() {
    this.accessToken = getLocalStorage('v1tk_invoice')
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL_INVOICE,
      timeout: 50000,
      headers: {
        'content-type': 'application/json'
      },
      withCredentials: true
    })
    this.instance.interceptors.request.use(
      config => {
        if (this.accessToken) {
          config.headers.Authorization = 'Bearer ' + this.accessToken
        }
        if (this.accessStock) {
          config.headers.StockID = this.accessStock?.ID
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

const httpInvoice = new HttpInvoice().instance
export default httpInvoice
