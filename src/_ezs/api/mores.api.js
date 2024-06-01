import http from 'src/_ezs/utils/http'

const MoresAPI = {
  getProvinces: ({ Key = '', Pi = 1, Ps = 100 }) =>
    http.post(`/api/v3/r23/more/tinh-thanh`, JSON.stringify({ Key, Pi, Ps })),
  getDistricts: pid => http.get(`/api/v3/comon23@getDistricts?pid=${pid}`)
}

export default MoresAPI
