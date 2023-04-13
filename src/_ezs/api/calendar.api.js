import http from 'src/_ezs/utils/http'

const CalendarAPI = {
  memberBookings: ({
    From,
    To,
    status,
    UserIDs,
    atHome,
    typeUser,
    MemberIDs,
    typeMember,
    StockID
  }) =>
    http.get(
      `api/v3/mbookadmin?cmd=getbooks&memberid=${
        MemberIDs || ''
      }&from=${From}&to=${To}&stockid=${StockID || 0}&status=${
        status || ''
      }&UserServiceIDs=${UserIDs || ''}&StatusMember=${
        typeMember || ''
      }&StatusBook=${typeUser || ''}&StatusAtHome=${atHome || ''}`
    ),
  addBooking: body =>
    http.post(`/api/v3/mbookadmin?cmd=AdminBooking`, JSON.stringify(body)),
  editBookingOS: body =>
    http.post(`/api/vcloud/pos@EditOrderServiceID`, JSON.stringify(body)),
  getBookingID: ({ BookIDs, osIDs }) =>
    http.post(
      `/api/v3/mbookadmin?cmd=getbooks&bookIDs=${BookIDs || ''}&osIDs=${
        osIDs || ''
      }`
    ),
  getBookingOsID: body =>
    http.post(`/api/vcloud/pos@GetOrderServiceID`, JSON.stringify(body)),
  deleteBookingOS: body =>
    http.post(`/services/preview.aspx?cmd=cancel_service`, body),
  resetBookingOS: body => http.post(`/api/v3/orderservice?cmd=reset_book`, body)
}

export default CalendarAPI
