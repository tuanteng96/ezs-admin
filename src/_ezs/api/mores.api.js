import http from 'src/_ezs/utils/http'

const MoresAPI = {
  getDistricts: pid => http.get(`/api/v3/comon23@getDistricts?pid=${pid}`)
}

export default MoresAPI
