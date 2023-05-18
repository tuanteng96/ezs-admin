import http from 'src/_ezs/utils/http'

const UsersAPI = {
  updateProfile: body => http.post('/api/v3/user@edit', JSON.stringify(body)),
  listSelect: () =>
    http.get(
      `/api/gl/select2?cmd=user&rightSegs=pos_mng|ReadApp|pos_mng&_type=query`
    ),
  listFull: () => http.get(`/api/gl/select2?cmd=user&byStockID=1`),
  listService: ({ Key, StockID }) =>
    http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID || 0}&q=${
        Key || ''
      }&all=1`
    ),
  listUsersBooking: ({ StockID = 0, Key = '', All = '' }) =>
    http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID}&q=${Key}&All=${All}`
    )
}

export default UsersAPI
