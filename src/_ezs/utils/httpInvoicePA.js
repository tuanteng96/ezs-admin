import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage, storeLocalStorage } from './localStorage'

class HttpInvoicePA {
  constructor() {
    this.accessToken = window?.top?.token || getLocalStorage('access_token')
    this.accessTokenInvoice = getLocalStorage('v1tk_invoicePA') || ''
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
        if (data?.error) {
          const originalRequest = config
          let newData = originalRequest.data
            ? JSON.parse(originalRequest.data)
            : {}

          let rs = await axios.post(
            (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
              ? process.env.REACT_APP_API_URL
              : '') + '/api/v3/UrlAction@invoke',
            {
              url: window.ApiInvoice + '/oauth/token',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              param: {},
              method: 'POST',
              include: 'ENV',
              body: {
                client_id: '{INVOICE_APPID_HDPAVN}',
                client_secret: '{INVOICE_SECRET_HDPAVN}',
                grant_type: 'client_credentials',
                scope: 'create-invoice invoice-lookup'
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
            'Bearer ' + rs?.data?.result?.access_token

          this.accessTokenInvoice = rs?.data?.result?.access_token
          storeLocalStorage(rs?.data?.result?.access_token, 'v1tk_invoicePA')

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

const httpInvoicePA = new HttpInvoicePA().instance
export default httpInvoicePA
