import http from 'src/_ezs/utils/http'

const CalendarAPI = {
  addBooking: body =>
    http.post(`/api/v3/mbookadmin?cmd=AdminBooking`, JSON.stringify(body))
}

export default CalendarAPI
