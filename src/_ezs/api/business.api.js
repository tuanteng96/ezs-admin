import http from 'src/_ezs/utils/http'

const BusinessAPI = {
  get: () => http.get('/admin/smart.aspx?stocks=1'),
  addEdit: body => http.post('/admin/smart.aspx?stock_save=1', body),
  getMore: name => http.get(`/app/index.aspx?cmd=adv&pos=${name}`),
  delete: body => http.post(`admin/smart.aspx?stock_delete=1`, body)
}

export default BusinessAPI
