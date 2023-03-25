import http from 'src/_ezs/utils/http'

const UsersAPI = {
  updateProfile: body => http.post('/api/v3/user@edit', JSON.stringify(body))
}

export default UsersAPI
