import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import { Button } from 'src/_ezs/partials/button'
import { useClientView } from '../../ClientViewContext'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const CheckInOut = props => {
  const { MemberView } = useClientView()
  return (
    <div className="py-5 pr-5">
      {!MemberView?.CheckIn && (
        <Button className="relative flex items-center justify-center w-full h-12 pl-5 pr-10 text-sm font-bold text-white uppercase transition rounded shadow-lg font-inter bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70">
          Khách hàng Check IN
          <ArrowLeftOnRectangleIcon className="absolute w-6 right-3 top-2/4 -translate-y-2/4" />
        </Button>
      )}
      {MemberView?.CheckIn && (
        <Button className="relative flex items-center justify-center w-full h-12 pl-5 pr-10 text-sm font-bold text-white uppercase transition bg-gray-700 rounded shadow-lg font-inter hover:bg-gray-800 focus:outline-none focus:shadow-none disabled:opacity-70">
          Khách hàng Check Out (
          {moment(MemberView?.CheckIn?.CreateDate).format('HH:mm')})
          <ArrowRightOnRectangleIcon className="absolute w-6 right-3 top-2/4 -translate-y-2/4" />
        </Button>
      )}
    </div>
  )
}

export { CheckInOut }
