import http from 'src/_ezs/utils/http'
import httpInvoice from '../utils/httpInvoice'

const InvoiceAPI = {
  urlAction: body =>
    http.post(`/api/v3/UrlAction@invoke`, JSON.stringify(body)),
  login: data => httpInvoice.post(`/auth/token`, data),
  getList: body => http.post(`/api/v3/order23@GetInvoice`, JSON.stringify(body))
}

export default InvoiceAPI
