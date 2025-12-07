import axios from 'axios'
import { toast } from 'react-toastify'
import { getLocalStorage, storeLocalStorage } from './localStorage'

class HttpInvoiceSAAS {
  constructor() {
    this.accessToken = window?.top?.token || getLocalStorage('access_token')
    this.accessTokenInvoice = getLocalStorage('v1tk_invoiceSAAS') || ''

    this.reloadCount = 1
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
          newData['headers']['Authorization'] = this.accessTokenInvoice

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
        if (data?.error && this.reloadCount < 3) {
          this.reloadCount = this.reloadCount + 1
          const originalRequest = config
          let newData = originalRequest.data
            ? JSON.parse(originalRequest.data)
            : {}

          let rs = await axios.post(
            (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
              ? process.env.REACT_APP_API_URL
              : '') + '/api/v3/UrlAction@invoke',
            {
              url: window.ApiInvoice + '/admin-api/api/v1/saas/auth',
              headers: {},
              param: {},
              method: 'POST',
              include: 'ENV',
              body: {
                username: '{INVOICE_USER_HDVNPTSAAS}',
                password: '{INVOICE_PASSWORD_HDVNPTSAAS}'
              },
              resultType: 'json'
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.accessToken
              }
            }
          )
          if (rs?.data?.result?.data?.access_token) {
            newData['headers']['Authorization'] =
              rs?.data?.result?.data?.access_token

            this.accessTokenInvoice = rs?.data?.result?.data?.access_token

            storeLocalStorage(
              rs?.data?.result?.data?.access_token,
              'v1tk_invoiceSAAS'
            )
          }

          let response = await this.instance({
            ...originalRequest,
            data: JSON.stringify(newData)
          })
          return response
        } else {
          this.reloadCount = 1
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

const httpInvoiceSAAS = new HttpInvoiceSAAS().instance
export default httpInvoiceSAAS
