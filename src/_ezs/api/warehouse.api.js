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
  updateImportExport: body =>
    http.post(`/api/v3/whouse2?cmd=save_ie`, JSON.stringify(body)),
  deleteImportExport: body =>
    http.get(`/api/v3/whouse2?${formatObject.toQueryString(body)}`),
  deleteSupplier: body => http.post(`/api/v3/SupplierTable?cmd=delete`, body),
  getListProdCode: body =>
    http.get(`/api/gl/select2?${formatObject.toQueryString(body)}&order=renew`),
  whouseConvert: body => http.post(`/api/v3/whouseConvert?cmd=doconvert`, body),
  getToPayId: body => http.post(`/api/v3/Whouse3@GetId`, JSON.stringify(body)),
  whousePay: body => http.post(`/api/v3/Whouse3@payed`, JSON.stringify(body)),
  getReceiveStock: body =>
    http.post(`/api/v3/WHouse24@targetList`, JSON.stringify(body)),
  getConvert: body =>
    http.post(`/api/v3/whouse2@getconvert`, JSON.stringify(body)),
  importExcelFile: body =>
    http.post(`/api/v3/WHouse24@importExcel`, JSON.stringify(body)),
  changeDate: body =>
    http.post(`/api/v3/SysAdminTools@Importexport`, JSON.stringify(body))
}

export default WarehouseAPI
