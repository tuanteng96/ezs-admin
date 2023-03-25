import React from 'react'
import { Button } from 'src/_ezs/partials/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import TasksAPI from 'src/_ezs/api/tasks.api'
import { toast } from 'react-toastify'

import moment from 'moment'
import 'moment/locale/vi'
import { formatString } from 'src/_ezs/utils/formatString'

moment.locale('vi')

const MemberSmsPayed = ({ data }) => {
  const queryClient = useQueryClient()

  const paymentMutation = useMutation({
    mutationFn: body => TasksAPI.doSmsPayed(body)
  })

  const onPayment = () => {
    var bodyFormData = new FormData()
    bodyFormData.append('orderid', data.id)
    bodyFormData.append('value', data.smsPayed)
    paymentMutation.mutate(bodyFormData, {
      onSuccess: data => {
        queryClient
          .invalidateQueries({ queryKey: ['Notifications'] })
          .then(() => {
            toast.success('Duyệt thanh toán thành công.')
          })
      },
      onError: error => {
        console.log(error)
      }
    })
  }
  return (
    <div className="p-6 mb-4 bg-white rounded shadow-sm dark:bg-dark-aside">
      <div className="flex justify-between mb-1.5">
        <div className="flex-1 pr-4 text-lg font-bold dark:text-graydark-800">
          Khách hàng <span className="capitalize">{data.name}</span>
        </div>
        <div className="text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
          {moment(data.CreateDate).fromNow()}
        </div>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        <span className="pl-1 font-medium font-inter">
          {data?.phone || 'Chưa có số điện thoại'}
        </span>
        <span className="px-1">-</span>
        Đơn hàng
        <span className="pl-1 font-medium font-inter">#{data?.id}</span>
        <span className="px-1">-</span>
        <span className="font-medium font-inter">
          {formatString.formatVND(data.topay)}
        </span>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Thanh toán chờ duyệt:
        <span className="pl-1 font-medium font-inter text-danger">
          {formatString.formatVND(data.smsPayed)}
        </span>
      </div>
      <div className="flex justify-between mt-4 item-center">
        <Button
          className="relative flex items-center px-3.5 text-sm font-medium text-white transition rounded shadow-lg h-10 bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-60"
          type="button"
          onClick={onPayment}
          loading={paymentMutation.isLoading}
          disabled={paymentMutation.isLoading}
        >
          Duyệt thanh toán
        </Button>
      </div>
    </div>
  )
}

export { MemberSmsPayed }
