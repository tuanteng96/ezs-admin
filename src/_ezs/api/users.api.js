import http from 'src/_ezs/utils/http'

const UsersAPI = {
  updateProfile: body => http.post('/api/v3/user@edit', JSON.stringify(body)),
  listSelect: () =>
    http.get(
      `/api/gl/select2?cmd=user&rightSegs=pos_mng|ReadApp|pos_mng&_type=query`
    ),
  listFull: ({ StockID = '' }) =>
    http.get(`/api/gl/select2?cmd=user&crstockid=${StockID}`),
  listService: ({ Key = '', StockID = '' }) =>
    http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID || 0}&q=${
        Key || ''
      }&all=1&includeSource=1`
    ),
  listUsersBooking: ({ StockID = 0, Key = '', All = '' }) =>
    http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID}&q=${Key}&All=${All}`
    ),
  listUserNotification: ({ key = '' }) =>
    http.get(
      `/api/gl/select2?cmd=group_and_user&&term=${key}&_type=query&q=${key}`
    ),
  listMembersNotification: ({ key = '' }) =>
    http.get(`/api/gl/select2?cmd=group_and_member&q=${key}`),
  listUsersRoles: body => http.post('/api/v3/User24@Get', JSON.stringify(body)),
  suggestUsername: body => http.post('/admin/smart.aspx?user_sugg=1', body),
  addEditUser: body => http.post('/admin/smart.aspx?user_add=1', body),
  addEditUser2: body =>
    http.post('/api/v3/User24@Updates', JSON.stringify(body)),
  getRolesUserId: body =>
    http.post('/api/v3/user24@info', JSON.stringify(body)),
  deleteUsersRoles: body => http.post('/admin/smart.aspx?user_group=1', body),
  updateRatingUser: body => http.post('/api/v3/userrate@save', body)
}

export default UsersAPI
