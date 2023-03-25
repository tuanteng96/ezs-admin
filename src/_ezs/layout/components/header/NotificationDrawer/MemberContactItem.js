import React from 'react'
import { Button } from 'src/_ezs/partials/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import TasksAPI from 'src/_ezs/api/tasks.api'
import { toast } from 'react-toastify'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const MemberContactItem = ({ data }) => {
  const queryClient = useQueryClient()

  const doContactMutation = useMutation({
    mutationFn: body => TasksAPI.confirmContact(body)
  })

  const onConfirmContact = () => {
    var bodyFormData = new FormData()
    bodyFormData.append('contact_id', data.ID)
    doContactMutation.mutate(bodyFormData, {
      onSuccess: data => {
        queryClient
          .invalidateQueries({ queryKey: ['Notifications'] })
          .then(() => {
            toast.success('Xác nhận thành công.')
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
          Khách hàng
          <span className="pl-1 capitalize">
            {data.Fullname || 'Chưa xác định'}
          </span>
        </div>
        <div className="pt-1 text-sm text-right text-gray-600 dark:text-graydark-600 w-28">
          {moment(data.CreateDate).fromNow()}
        </div>
      </div>
      <div className="text-gray-800 dark:text-graydark-800">
        Số điện thoại
        <span className="pl-1 font-medium font-inter">
          {data?.Phone1 || data?.Phone2 || 'Chưa xác định'}
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
          loading={doContactMutation.isLoading}
          disabled={doContactMutation.isDisabled}
          onClick={onConfirmContact}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  )
}

export { MemberContactItem }
