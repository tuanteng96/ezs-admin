import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage } from './localStorage'

class Http {
  constructor() {
    this.pathLogin = ['/admin/login.aspx?login=1', '/api/v3/user@setpwd']
    this.accessToken = window?.top?.token || getLocalStorage('access_token')
    this.accessStock = window?.top?.Info
      ? window?.top?.Info?.Stocks.filter(
          x => x.ID === window?.top?.Info?.CrStockID
        )[0]
      : getLocalStorage('access_stock')
    this.instance = axios.create({
      baseURL:
        !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
          ? process.env.REACT_APP_API_URL
          : window.location.origin,
      timeout: 50000,
      headers: {
        'content-type': 'text/plain'
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
        if (this.pathLogin.includes(response.config.url) && data?.token) {
          this.accessToken = data?.token
        }
        if (response.config.url === '/admin/login.aspx?login=1') {
          if (data?.Info?.Stocks && data?.Info?.Stocks.length > 0) {
            this.accessStock = data?.Info?.Stocks.filter(
              x => x.ID === data?.Info?.CrStockID
            )[0]
          }
        }
        if (
          response.config.url === '/admin/login.aspx?ajax=1&cmd=info' &&
          !this.accessStock
        ) {
          if (data?.Stocks && data?.Stocks.length > 0) {
            this.accessStock = data.Stocks.filter(x => x.ID === data?.CrStockID)
          }
        }
        if (response.config.url === '/services/preview.aspx?cmd=SwStock') {
          this.accessStock = {
            ...data?.data,
            ID: data?.data?.StockID
          }
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
