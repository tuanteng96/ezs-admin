import { XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import OrdersAPI from 'src/_ezs/api/orders'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import moment from 'moment'
import 'moment/locale/vi'
import { formatString } from 'src/_ezs/utils/formatString'
import clsx from 'clsx'

moment.locale('vi')

const getStatusOrder = (item, type = false) => {
  if (
    item?.Status === 'finish' &&
    item?.AdminAction === 'TANG_DH_KET_THUC_NO'
  ) {
    return type ? 'Hoàn thành - Đơn tặng' : 'success'
  }
  if (
    item?.Status === 'finish' &&
    item?.AdminAction === 'KHOA_NO_KET_THUC_NO'
  ) {
    return type ? 'Hoàn thành - Khóa nợ' : 'success'
  }
  if (item?.Status === 'finish') {
    return type ? 'Hoàn thành' : 'success'
  }
  if (item?.Status === 'cancel' && item?.IsReturn) {
    return type ? 'Trả hàng' : 'danger'
  }
  if (item?.Status === 'cancel' && !item?.IsReturn) {
    return type ? 'Đơn hủy' : 'danger'
  }
}

function ViewOrderDetail(props) {
  const { orderId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const resultOrder = useQuery({
    queryKey: ['MemberListPay', { ID: orderId }],
    queryFn: async () => {
      const { data } = await OrdersAPI.orderDetail({ ID: orderId })
      return data
    }
  })

  console.log(resultOrder)

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(-1)}
          ></div>
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 z-10 flex w-full h-full bg-white max-w-7xl dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="w-[220px] flex flex-col border-r border-separator dark:border-dark-separator">
            <div className="flex items-center justify-center bg-white border-b py-7 border-separator dark:border-dark-separator">
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() => navigate(-1)}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
              {resultOrder.isLoading && (
                <>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    <div className="w-8/12 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    <div className="w-9/12 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    <div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    <div className="w-9/12 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                  </div>
                </>
              )}
              {!resultOrder.isLoading && (
                <>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Hoàn thành
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Thưởng doanh số
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Thưởng doanh số
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Thanh toán
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Trả hàng
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Thay đổi khách hàng
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Tặng
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Khóa nợ
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    COD
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Hủy
                  </div>
                  <div className="p-3.5 text-[15px] font-semibold border-b border-dashed cursor-pointer border-separator dark:border-dark-separator hover:text-primary last:border-0">
                    Xóa đơn hàng
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative flex-1 bg-white dark:bg-dark-app">
            <div className="h-full overflow-auto">
              <div className="max-w-4xl pb-10 m-auto">
                <div className="grow">
                  <div className="flex items-center justify-between pt-12 pb-10 text-gray-800 border-b border-separator dark:border-dark-separator">
                    <div className="flex items-end">
                      <div className="text-3xl font-bold uppercase font-inter">
                        HÓA ĐƠN
                      </div>
                      <div
                        className={clsx(
                          'px-2 py-px mb-1.5 ml-2 text-xs text-white rounded',
                          'bg-' + getStatusOrder(resultOrder?.data?.Order)
                        )}
                      >
                        {getStatusOrder(resultOrder?.data?.Order, 'type')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="mb-2 font-bold uppercase font-inter">
                        CSER Beauty
                      </div>
                      <div className="text-[15px] max-w-[250px] text-right">
                        22/42 Vũ Ngọc Phan, Trung Hòa, Cầu Giấy, Hà Nội
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 text-gray-800 font-inter">
                    <div>
                      <div className="mb-1.5 text-sm font-semibold uppercase font-inter">
                        Đơn hàng
                      </div>
                      <div className="text-sm">
                        {resultOrder?.data?.Order?.ID}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 text-sm font-semibold uppercase font-inter">
                        Thời gian.
                      </div>
                      <div className="text-sm">
                        {moment(resultOrder?.data?.Order?.CreateDate).format(
                          'HH:mm DD/MM/YYYY'
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 text-sm font-semibold uppercase font-inter">
                        Cơ sở.
                      </div>
                      <div className="text-sm">
                        {resultOrder?.data?.Order?.Stock?.Title}
                      </div>
                    </div>
                  </div>
                  <div className="pt-16 mb-5">
                    <div className="flex py-3 mb-4 text-sm font-medium text-gray-400 uppercase border-b font-inter border-separator">
                      <div className="flex-1 pr-5">Mặt hàng</div>
                      <div className="pr-3 w-[100px] text-right">Số lượng</div>
                      <div className="pr-3 w-[150px] text-right">Đơn giá</div>
                      <div className="w-[150px] text-right">Thành tiền</div>
                    </div>
                    <div>
                      {resultOrder?.data?.Items &&
                        resultOrder?.data?.Items.map((item, index) => (
                          <div
                            className="flex pb-4 font-bold last:pb-0 text-[15px] text-gray-800"
                            key={index}
                          >
                            <div className="flex-1 pr-5">{item.ProdTitle}</div>
                            <div className="pr-3 w-[100px] text-right">
                              {item.Qty}
                            </div>
                            <div className="pr-3 w-[150px] text-right">
                              {formatString.formatVND(item.Price)}
                            </div>
                            <div className="w-[150px] text-right">
                              {formatString.formatVND(item.ToPay)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="pt-5 border-t border-separator dark:border-dark-separator text-[15px] text-gray-800 font-semibold">
                    Đây là ghi chú
                  </div>
                  <div className="flex pt-5 text-[15px] text-gray-800 font-semibold">
                    <div className="w-2/4 pr-6 border-r border-separator dark:border-dark-separator">
                      <div className="flex justify-between pb-2">
                        <div>Tên khách hàng</div>
                        <div className="w-2/4 text-right">Hà Trung Thái</div>
                      </div>
                      <div className="flex justify-between pb-2">
                        <div>Số điện thoại</div>
                        <div className="w-2/4 text-right">0971021196</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Địa chỉ</div>
                        <div className="w-2/4 text-right">
                          22/42 Vũ ngọc phan, Trung Hòa, Cầu Giấy, Hà Nội
                        </div>
                      </div>
                    </div>
                    <div className="w-2/4 pl-6">
                      <div className="flex justify-between pb-2">
                        <div>Tổng tiền</div>
                        <div className="w-2/4 text-right">
                          {formatString.formatVND(
                            resultOrder?.data?.Order?.TotalValue
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between pb-2">
                        <div>Mã giảm giá</div>
                        <div className="w-2/4 text-right">Không có</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Thanh toán</div>
                        <div className="w-2/4 text-right">
                          {formatString.formatVND(
                            resultOrder?.data?.Order?.ToPay
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#F3F6F9] py-10">
                <div className="max-w-4xl m-auto">
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-400 uppercase font-inter">
                    <div>TM-CK-QT</div>
                    <div>T.T Ví - Thẻ tiền</div>
                    <div>Hoàn ví</div>
                    <div>Hoàn tiền</div>
                    <div>Còn nợ</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 pt-4 mt-4 font-bold text-gray-800 uppercase border-t font-inter border-light">
                    <div>0</div>
                    <div>0</div>
                    <div>0</div>
                    <div>0</div>
                    <div className="text-danger">1.150.000</div>
                  </div>
                </div>
              </div>
              <div className="py-8">
                <div className="flex justify-between max-w-4xl m-auto">
                  <button className="relative flex items-center h-12 px-4 font-medium transition rounded shadow-lg text-danger bg-dangerlight hover:bg-dangerhv hover:text-white focus:outline-none focus:shadow-none">
                    Xóa đơn hàng
                  </button>
                  <button className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none">
                    In đơn hàng
                  </button>
                </div>
              </div>
            </div>
            <LoadingComponentFull loading={resultOrder.isLoading} />
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

export default ViewOrderDetail
