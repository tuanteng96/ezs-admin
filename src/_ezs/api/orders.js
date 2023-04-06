import http from '../utils/http'

const OrdersAPI = {
  orderSearch: ({ Pi, Ps, Key = '' }) =>
    http.get(
      `/services/preview.aspx?cmd=search_order&key=${Key}&typeSearch=sell&ps=${Ps}&pi=${Pi}&searchId=4&IsOnlineNewOrder=0&From=&To=&StaffID=0&StockID=0&zero=0`
    ),
  orderDetail: ({ ID }) => http.get(`/api/v3/order23@get?orderid=${ID}`),
  orderDonate: ({ OrderID }) =>
    http.get(`/api/v3/orderAdmin?cmd=Order_gift23&OrderID=${OrderID}`),
  orderEndPay: ({ OrderID }) =>
    http.get(`/api/v3/orderAdmin?cmd=Order_endpay&OrderID=${OrderID}`),
  orderGetCOD: body =>
    http.post(`/api/v3/shipcode@getorder`, JSON.stringify(body)),
  orderUpdateCOD: body => http.post(`/api/v3/shipcode@update`, body),
  orderChangeMember: body => http.post(`/api/v3/OrderAdmin@changeMember`, body),
  orderFinish: body => http.post(`/api/v3/Order23@finish`, JSON.stringify(body))
}

export default OrdersAPI
