import http from 'src/_ezs/utils/http'

const SettingsAPI = {
  getSalesKPI: body => http.post(`/api/v3/kpi2@get`, JSON.stringify(body)),
  updateSalesKPI: body =>
    http.post('/api/v3/kpi2@updateList', JSON.stringify(body))
}

export default SettingsAPI
