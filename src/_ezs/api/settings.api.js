import http from 'src/_ezs/utils/http'

const SettingsAPI = {
  updateSalesKPI: body =>
    http.post('/api/v3/kpi2@updateList', JSON.stringify(body))
}

export default SettingsAPI
