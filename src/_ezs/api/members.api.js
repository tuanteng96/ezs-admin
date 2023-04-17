import http from 'src/_ezs/utils/http'

const MembersAPI = {
  memberChangePhone: body =>
    http.post(`/services/preview.aspx?cmd=chang_phone`, body),
  memberChangeEmail: body =>
    http.post(`/services/preview.aspx?cmd=chang_email`, body),
  memberOnCheckin: body => http.post(`services/preview.aspx?cmd=checkin`, body),
  memberCheckin: ({ StockID, Key, Type = '' }) =>
    http.get(
      `/services/preview.aspx?cmd=search_member&key=${
        Key || ''
      }&typeSearch=sell&ps=100&pi=1&searchId=4&__MemberCheckin=${
        StockID || 0
      }&__MemberMoney=0&__MyNoti=0&__AllNoti=0&__Birth=0&__MBirth=0&__Cate=false&__HasOrderService=0&__MemberGroups=false&__StaffID=0&__StockID=0&__Source=&__Tags=&__HasCheckInOrder=${Type}`
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
  memberSearch: ({ Pi, Ps, Key = '' }) =>
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
    ),
  memberListsWallet: body =>
    http.post('/services/preview.aspx?cmd=list_money', body),
  memberWalletAddDesc: body =>
    http.post('/services/preview.aspx?cmd=member_money_desc', body),
  memberWalletAddMoney: body =>
    http.post('/services/preview.aspx?cmd=add_money', body),
  memberListMoneyCard: ({ MemberID }) =>
    http.get(`/api/v3/moneycard?cmd=get&memberid=${MemberID}`),
  memberListPay: ({ MemberID, ...body }) =>
    http.post(
      `/api/v3/r23/cong-no/danh-sach/@memberid=${MemberID}`,
      JSON.stringify(body)
    ),
  memberLockMoneyCard: ({ CardID }) =>
    http.get(`/api/v3/moneycard?cmd=lock&id=${CardID}`),
  memberSearchOrder: ({
    Key = '',
    Pi = 1,
    Ps = 20,
    searchId = 1,
    searchForMember = ''
  }) =>
    http.get(
      `/services/preview.aspx?cmd=search_order&key=${encodeURIComponent(
        Key
      )}&pi=${Pi}&ps=${Ps}&searchId=${searchId}&searchForMember=${searchForMember}`
    ),
  memberAddFast: body =>
    http.post(`/api/v3/member23?cmd=add`, JSON.stringify(body)),
  memberListCare: ({ MemberID }) =>
    http.get(`api/v3/membercare?cmd=get&mid=${MemberID}`)
}

export default MembersAPI
