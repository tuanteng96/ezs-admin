import http from '../utils/http'

const OrdersAPI = {
  orderSearch: ({ Pi, Ps, Key = '' }) =>
    http.get(
      `/services/preview.aspx?cmd=search_order&key=${Key}&typeSearch=sell&ps=${Ps}&pi=${Pi}&searchId=4&IsOnlineNewOrder=0&From=&To=&StaffID=0&StockID=0&zero=0`
    )
}

export default OrdersAPI
