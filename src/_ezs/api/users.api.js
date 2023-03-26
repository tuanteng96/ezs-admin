import http from 'src/_ezs/utils/http'

const UsersAPI = {
  updateProfile: body => http.post('/api/v3/user@edit', JSON.stringify(body)),
  listSelect: () =>
    http.get(
      `/api/gl/select2?cmd=user&rightSegs=pos_mng|ReadApp|pos_mng&_type=query`
    ),
  listService: ({ Key, StockID }) =>
    http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID || 0}&q=${
        Key || ''
      }&all=1`
    )
}

export default UsersAPI
