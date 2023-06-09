import React, { useEffect, useState } from 'react'
import { formatString } from 'src/_ezs/utils/formatString'
import ViewOrderDetail from 'src/app/pages/Clients/pages/ViewOrderDetail'
import { useLocation } from 'react-router'
import { FloatingPortal } from '@floating-ui/react'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const MemberOrderItemBtn = ({ OrderID }) => {
  let [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    isOpen && setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <button
        type="button"
        className="relative flex items-center px-3.5 text-sm font-medium text-white transition rounded shadow-lg h-10 bg-success hover:bg-successhv focus:outline-none focus:shadow-none"
        onClick={() => setIsOpen(true)}
      >
        Xem đơn hàng
      </button>
      {isOpen && (
        <FloatingPortal>
          <ViewOrderDetail OrderID={OrderID} onHide={() => setIsOpen(false)} />
        </FloatingPortal>
      )}
    </>
  )
}

const MemberOrderItem = ({ data }) => {
  return (
    <div className="p-6 mb-4 bg-white rounded shadow-sm dark:bg-dark-aside">
      <div className="flex justify-between mb-1.5">
        <div className="flex-1 pr-4 text-lg font-bold dark:text-graydark-800">
          Khách hàng
          <span className="pl-1 capitalize">
            {data.Member.FullName || 'Chưa xác định'}
          </span>
        </div>
        <div className="pt-1 text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
          {moment(data.CreateDate).fromNow()}
        </div>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Số điện thoại
        <span className="pl-1 font-medium font-inter">
          {data?.Member.MobilePhone || 'Chưa xác định'}
        </span>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        <span className="font-medium font-inter">#{data.ID}</span>
        <span className="px-1">-</span>
        <span className="font-medium text-danger font-inter">
          {formatString.formatVND(data.ToPay)}
        </span>
      </div>
      <div className="flex justify-between mt-4 item-center">
        <MemberOrderItemBtn OrderID={data.ID} />
      </div>
    </div>
  )
}

export { MemberOrderItem }
