import http from 'src/_ezs/utils/http'

const MembersAPI = {
  memberCheckin: ({ StockID, Key, Type }) =>
    http.get(
      `/services/preview.aspx?cmd=search_member&key=${
        Key || ''
      }&typeSearch=sell&ps=100&pi=1&searchId=4&__MemberCheckin=${
        StockID || 0
      }&__MemberMoney=0&__MyNoti=0&__AllNoti=0&__Birth=0&__MBirth=0&__Cate=false&__HasOrderService=0&__MemberGroups=false&__StaffID=0&__StockID=0&__Source=&__Tags=&__HasCheckInOrder=${
        Type || 0
      }`
    ),
  memberList: ({ StockID, Key, Type }) =>
    http.get(
      `/services/preview.aspx?cmd=search_member&key=${
        Key || ''
      }&typeSearch=sell&ps=100&pi=1&searchId=4&__MemberCheckin=${StockID}&__MemberMoney=0&__MyNoti=0&__AllNoti=0&__Birth=0&__MBirth=0&__Cate=false&__HasOrderService=0&__MemberGroups=false&__StaffID=0&__StockID=0&__Source=&__Tags=&__HasCheckInOrder=${Type}`
    ),
  memberDataAdd: () => {
    return http.get('/api/v3/member23?cmd=dataForAdd')
  },
  memberSearch: ({ Pi, Ps, Key }) =>
    http.get(
      `/services/preview.aspx?cmd=search_member&key=${encodeURIComponent(
        Key
      )}&typeSearch=sell&pi=${Pi}&ps=${Ps}`
    ),
  addUpdate: body =>
    http.post('api/v3/member23@AddMember', JSON.stringify(body)),
  resetPassword: body =>
    http.post('/services/preview.aspx?cmd=setpwd_member', body),
  memberSelect: ({ Key, StockID }) =>
    http.get(
      `/api/gl/select2?cmd=member&q=${Key || ''}&CurrentStockID=${StockID || 0}`
    ),
  memberBought: ({ MemberID, Pi, Ps }) =>
    http.get(
      `api/v3/member23?cmd=da_mua&memberid=${MemberID}&ps=${Ps}&pi=${Pi}`
    ),
  memberBookings: ({ From, To }) =>
    http.get(
      `api/v3/mbookadmin?cmd=getbooks&memberid=&from=${From}&to=${To}&stockid=0&status=XAC_NHAN,XAC_NHAN_TU_DONG,CHUA_XAC_NHAN,DANG_THUC_HIEN,THUC_HIEN_XONG,KHACH_KHONG_DEN,KHACH_DEN&UserServiceIDs=&StatusMember=&StatusBook=&StatusAtHome=`
    )
}

export default MembersAPI
