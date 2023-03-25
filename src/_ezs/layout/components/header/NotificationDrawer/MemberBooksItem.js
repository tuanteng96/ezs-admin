import React from 'react'
import { Button } from 'src/_ezs/partials/button'

import moment from 'moment'
import 'moment/locale/vi'
moment.locale('vi')

const MemberBooksItem = ({ data }) => (
  <div className="p-6 mb-4 bg-white rounded shadow-sm dark:bg-dark-aside">
    <div className="flex justify-between mb-1.5">
      <div className="flex-1 pr-4 text-lg font-bold capitalize dark:text-graydark-800">
        {data.RootTitles}
      </div>
      <div className="pt-1 text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
        {moment(data.CreateDate).fromNow()}
      </div>
    </div>
    <div className="text-gray-800 dark:text-graydark-800">
      Khách hàng
      <span className="pl-1 font-medium font-inter">
        {data?.Member?.FullName}
      </span>
      <span className="px-1">-</span>
      <span className="font-medium font-inter">
        {data?.Member?.MobilePhone || 'Chưa có số điện thoại'}
      </span>
    </div>
    <div className="text-gray-800 dark:text-graydark-800">
      Ngày thực hiện
      <span className="pl-1 font-medium font-inter">
        {moment(data.BookDate).format('HH:mm DD-MM-YYYY')}
      </span>
    </div>
    <div className="flex mt-4">
      <Button
        className="relative flex items-center px-3.5 text-sm font-medium text-white transition rounded shadow-lg h-9 bg-success hover:bg-successhv focus:outline-none focus:shadow-none"
        type="button"
      >
        Xác nhận
      </Button>
      <Button
        className="relative flex items-center px-3.5 ml-2 text-sm font-medium text-white transition rounded shadow-lg h-9 bg-danger hover:bg-dangerhv focus:outline-none focus:shadow-none"
        type="button"
      >
        Hủy
      </Button>
    </div>
  </div>
)

export { MemberBooksItem }
