import http from 'src/_ezs/utils/http'

const AuthAPI = {
  login: body => http.post('/admin/login.aspx?login=1', body),
  forgot: email => http.get(`api/v3/adminreset?cmd=send&emailAdmin=${email}`),
  forgotChange: ({ emailAdmin, NewPassword, token }) =>
    http.get(
      `api/v3/adminreset?cmd=reset&emailAdmin=${emailAdmin}&NewPassword=${NewPassword}&ReNewPassword=${NewPassword}&token=${token}`
    ),
  resetPassword: body => http.post('/api/v3/user@setpwd', JSON.stringify(body)),
  tokenCheck: () => http.post('/admin/login.aspx?ajax=1&cmd=info')
}

export default AuthAPI
