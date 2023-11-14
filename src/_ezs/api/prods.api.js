import http from 'src/_ezs/utils/http'
import { formatObject } from '../utils/formatObject'

const ProdsAPI = {
  getListService: ({ StockID, Key, Pi, Ps, MemberID }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${
        MemberID || ''
      }&ps=${Ps}&pi=${Pi}&key=${Key || ''}&stockid=${StockID || ''}`
    ),
  getListProdOs: () =>
    http.get(
      `/api/gl/select2?cmd=prod&service_1=1&ignore_all=1&includeSource=1&_type=query`
    ),
  getProdId: ID =>
    http.get(
      `/api/gl/select2?cmd=prod&cateids=${ID}&includeSource=1&_type=query`
    ),
  getListProdsProduct: body =>
    http.post(`/api/v4/Prod25@sanpham`, JSON.stringify(body)),
  getListCategory: () => http.get(`/api/v3/prod24@CategoryList`),
  addEditCategory: body =>
    http.post(`/api/v3/prod24@categoryEdits`, JSON.stringify(body)),
  getCategoryID: body =>
    http.post(`/api/v3/prod24@CategoryID`, JSON.stringify(body)),
  deleteEditCategory: body =>
    http.post(`/api/v3/prod24@CategoryDelete`, JSON.stringify(body)),
  deleteProdsID: body =>
    http.post(`/api/v3/prod24@delete`, JSON.stringify(body)),
  addUpdateProduct: body =>
    http.post(`/api/v4/Prod25@sanpham`, JSON.stringify(body)),
  getListInventory: body =>
    http.post(`/api/v3/whouse2?${formatObject.toQueryString(body)}`),
  getListSupplier: body =>
    http.post(`/api/v3/SupplierTable?${formatObject.toQueryString(body)}`),
  addEditSupplier: body => http.post(`/api/v3/SupplierTable?cmd=save`, body),
  deleteSupplier: body => http.post(`/api/v3/SupplierTable?cmd=delete`, body)
}

export default ProdsAPI
