import http from 'src/_ezs/utils/http'

const SettingsAPI = {
  getSalesKPI: body => http.post(`/api/v3/kpi2@get`, JSON.stringify(body)),
  updateSalesKPI: body =>
    http.post('/api/v3/kpi2@updateList', JSON.stringify(body)),
  groupListMembers: ({ StockID }) =>
    http.get(`/api/v3/membergroup?cmd=get&(filter)StockID=${StockID}&sort=[Point] desc
  &Pi=1&Ps=100`)
}

export default SettingsAPI
