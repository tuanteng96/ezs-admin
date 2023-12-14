import http from 'src/_ezs/utils/http'

const NotificationsAPI = {
  list: ({ pi = 1, ps = 20 }) =>
    http.get(`/api/v3/noticalendar?cmd=get&Pi=${pi}&Ps=${ps}`),
  delete: body => http.post('/api/v3/noticalendar?cmd=delete', body),
  send: body =>
    http.post('/api/v3/noticalendar?cmd=savejson', JSON.stringify(body)),
  getId: body => http.post(`/api/v3/noticalendar?cmd=getids`, body)
}

export default NotificationsAPI
