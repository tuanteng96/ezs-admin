import http from 'src/_ezs/utils/http'
import httpInvoice from '../utils/httpInvoice'

const InvoiceAPI = {
  urlAction: body =>
    httpInvoice.post(`/api/v3/UrlAction@invoke`, JSON.stringify(body)),
  getList: body =>
    http.post(`/api/v3/order23@GetInvoice`, JSON.stringify(body)),
  updateInvoiceIDs: body =>
    http.post(`/api/v3/order23@SetInvoice`, JSON.stringify(body))
}

export default InvoiceAPI
