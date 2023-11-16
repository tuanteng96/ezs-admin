import http from 'src/_ezs/utils/http'
import { formatObject } from '../utils/formatObject'

const WarehouseAPI = {
  getListInventory: body =>
    http.post(`/api/v3/whouse2?${formatObject.toQueryString(body)}`),
  getListSupplier: body =>
    http.post(`/api/v3/SupplierTable?${formatObject.toQueryString(body)}`),
  getSelectSupplier: key =>
    http.get(`/api/gl/select2?cmd=supplier&_type=query&q=${key}`),
  addEditSupplier: body => http.post(`/api/v3/SupplierTable?cmd=save`, body),
  deleteSupplier: body => http.post(`/api/v3/SupplierTable?cmd=delete`, body),
  getListProdCode: body =>
    http.get(`/api/gl/select2?${formatObject.toQueryString(body)}`)
}

export default WarehouseAPI
