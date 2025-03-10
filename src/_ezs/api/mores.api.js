import http from 'src/_ezs/utils/http'

const MoresAPI = {
  getProvinces: ({ Key = '', Pi = 1, Ps = 100 }) =>
    http.post(`/api/v3/r23/more/tinh-thanh`, JSON.stringify({ Key, Pi, Ps })),
  getDistricts: ({ ProvinceID, Key = '' }) =>
    http.get(`/api/v3/comon23@getDistricts?pid=${ProvinceID}&key=${Key}`),
  getGroupRoles: () => http.get(`/api/v3/User24@GetGroups`),
  actionUrl: body => http.post('/api/v3/UrlAction@invoke', JSON.stringify(body))
}

export default MoresAPI
