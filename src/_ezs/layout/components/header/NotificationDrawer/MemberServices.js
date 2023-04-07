import React from 'react'
import { Link } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')
const MemberServices = ({ data }) => {
  console.log(data)
  return (
    <div className="p-6 mb-4 bg-white rounded shadow-sm dark:bg-dark-aside">
      <div className="flex justify-between mb-1.5">
        <div className="flex-1 pr-4 text-lg font-bold capitalize dark:text-graydark-800">
          {data.os?.Title}
        </div>
        <div className="pt-1 text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
          {moment(data?.os?.BookDate).fromNow()}
        </div>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Khách hàng
        <span className="pl-1 font-medium font-inter">
          {data?.member?.FullName}
        </span>
        <span className="px-1">-</span>
        <span className="font-medium font-inter">
          {data?.member?.MobilePhone || 'Chưa có số điện thoại'}
        </span>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Ngày thực hiện
        <span className="pl-1 font-medium font-inter">
          {moment(data?.os?.BookDate).format('HH:mm DD-MM-YYYY')}
        </span>
      </div>
      <div className="flex mt-4">
        <Link
          to={`/appointments/os/${data?.os?.ID}`}
          className="relative flex items-center px-3.5 text-sm font-medium text-white transition rounded shadow-lg h-10 bg-success hover:bg-successhv focus:outline-none focus:shadow-none"
          type="button"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}

export { MemberServices }
