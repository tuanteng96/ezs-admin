import http from 'src/_ezs/utils/http'

const SettingsAPI = {
  getSalesKPI: body => http.post(`/api/v3/kpi2@get`, JSON.stringify(body)),
  updateSalesKPI: body =>
    http.post('/api/v3/kpi2@updateList', JSON.stringify(body)),
  groupListMembers: ({ StockID }) =>
    http.get(`/api/v3/membergroup?cmd=get&(filter)StockID=${StockID}&sort=[Point] desc
  &Pi=1&Ps=100`),
  getRoster: body => http.post(`/api/v4/roster@get`, JSON.stringify(body)),
  addEditRoster: body => http.post(`/api/v4/roster@edit`, JSON.stringify(body)),
  deleteRoster: body => http.post(`/api/v4/roster@delete`, JSON.stringify(body)),
}

export default SettingsAPI
