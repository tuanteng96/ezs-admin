import React from 'react'
import { Button } from 'src/_ezs/partials/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import TasksAPI from 'src/_ezs/api/tasks.api'
import { toast } from 'react-toastify'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const MemberNoteItem = ({ data }) => {
  const queryClient = useQueryClient()

  const doNotiMutation = useMutation({
    mutationFn: body => TasksAPI.doTasksNoti(body)
  })

  const doTasksNoti = () => {
    var bodyFormData = new FormData()
    bodyFormData.append('noti_id', data.ID)
    doNotiMutation.mutate(bodyFormData, {
      onSuccess: data => {
        queryClient
          .invalidateQueries({ queryKey: ['Notifications'] })
          .then(() => {
            toast.success('Thực hiện thành công.')
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
          Khách hàng <span className="capitalize">{data.Member?.FullName}</span>
        </div>
        <div className="pt-1 text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
          {moment(data.CreateDate).fromNow()}
        </div>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Số điện thoại
        <span className="pl-1 font-medium font-inter">
          {data?.Member?.MobilePhone || 'Chưa có số điện thoại'}
        </span>
      </div>
      <div
        className="text-gray-800 dark:text-graydark-800"
        dangerouslySetInnerHTML={{ __html: data.Content }}
      />
      <div className="flex justify-between mt-4 item-center">
        <Button
          className="relative flex items-center px-3.5 text-sm font-medium text-white transition rounded shadow-lg h-10 bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-60"
          type="button"
          onClick={doTasksNoti}
          loading={doNotiMutation.isLoading}
          disabled={doNotiMutation.isLoading}
        >
          Thực hiện
        </Button>
      </div>
    </div>
  )
}

export { MemberNoteItem }
