import http from 'src/_ezs/utils/http'

const ProdsAPI = {
  getListService: ({ StockID, Key, Pi, Ps, MemberID }) =>
    http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${
        MemberID || ''
      }&ps=${Ps}&pi=${Pi}&key=${Key || ''}&stockid=${StockID || ''}`
    )
}

export default ProdsAPI
