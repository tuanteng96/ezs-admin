import http from 'src/_ezs/utils/http'

const ProdsAPI = {
  getListService: ({ StockID, Key, Pi, Ps, MemberID }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${
        MemberID || ''
      }&ps=${Ps}&pi=${Pi}&key=${Key || ''}&stockid=${StockID || ''}`
    ),
  getListProdOs: () =>
    http.get(
      `/api/gl/select2?cmd=prod&service_1=1&ignore_all=1&includeSource=1&_type=query`
    ),
  getProdId: ID =>
    http.get(
      `/api/gl/select2?cmd=prod&cateids=${ID}&includeSource=1&_type=query`
    ),
  getListProds: body => http.post(`/api/v3/prod24@get`, JSON.stringify(body)),
  getListCategory: () => http.get(`/api/v3/prod24@CategoryList`)
}

export default ProdsAPI
