import http from 'src/_ezs/utils/http'

const StocksAPI = {
  change: body => http.post('/services/preview.aspx?cmd=SwStock', body)
}

export default StocksAPI
