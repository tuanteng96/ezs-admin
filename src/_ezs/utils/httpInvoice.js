import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage, storeLocalStorage } from './localStorage'

class HttpInvoice {
  constructor() {
    this.accessToken = window?.top?.token || getLocalStorage('access_token')
    this.accessTokenInvoice = getLocalStorage('v1tk_invoice') || ''
    this.instance = axios.create({
      baseURL:
        !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
          ? process.env.REACT_APP_API_URL
          : '',
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
        if (this.accessTokenInvoice) {
          let newData = config.data ? JSON.parse(config.data) : {}
          newData['headers']['Authorization'] =
            'Bearer ' + this.accessTokenInvoice
          config.data = newData
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // Add response interceptor
    this.instance.interceptors.response.use(
      async ({ data, config, ...response }) => {
        if (
          data?.result?.errorCode === 'ValidationTokenCode' ||
          data?.result?.errorCode === 'UnAuthorize'
        ) {
          const originalRequest = config
          let newData = originalRequest.data
            ? JSON.parse(originalRequest.data)
            : {}

          let rs = await axios.post(
            (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
              ? process.env.REACT_APP_API_URL
              : '') + '/api/v3/UrlAction@invoke',
            {
              url: window.ApiInvoice + '/auth/token',
              headers: {
                'Content-Type': 'application/json'
              },
              param: {},
              method: 'POST',
              include: 'ENV',
              body: {
                appid: '{INVOICE_APPID}',
                taxcode: '{INVOICE_TAXCODE}',
                username: '{INVOICE_USERNAME}',
                password: '{INVOICE_PASSWORD}'
              },
              resultType: 'json'
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.accessToken
              }
            }
          )
          newData['headers']['Authorization'] =
            'Bearer ' + rs?.data?.result?.data

          this.accessTokenInvoice = rs?.data?.result?.data
          storeLocalStorage(rs?.data?.result?.data, 'v1tk_invoice')

          let response = await this.instance({
            ...originalRequest,
            data: JSON.stringify(newData)
          })
          return response
        } else {
          return {
            data
          }
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
