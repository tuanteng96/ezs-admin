import http from 'src/_ezs/utils/http'
import httpInvoice from '../utils/httpInvoice'
import httpInvoicePA from '../utils/httpInvoicePA'

const InvoiceAPI = {
  urlAction: body =>
    httpInvoice.post(`/api/v3/UrlAction@invoke`, JSON.stringify(body)),
  urlActionPA: body =>
    httpInvoicePA.post(`/api/v3/UrlAction@invoke`, JSON.stringify(body)),
  getList: body =>
    http.post(`/api/v3/order23@GetInvoice`, JSON.stringify(body)),
  updateInvoiceIDs: body =>
    http.post(`/api/v3/order23@SetInvoice`, JSON.stringify(body)),
  createRefId: body =>
    http.post(`/api/v3/order23@CreateInvoice`, JSON.stringify(body)),
  getENV: () => http.get('/api/v3/BrandGlobal@ENVGET'),
  saveENV: body => http.post('/api/v3/BrandGlobal@ENVSAVE', body) // {ENV: {value}}
}

export default InvoiceAPI
