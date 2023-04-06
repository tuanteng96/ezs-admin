import React, { useState } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion'
import { Controller, useForm } from 'react-hook-form'
import { InputTextarea } from 'src/_ezs/partials/forms'
import { InputDatePicker } from 'src/_ezs/partials/forms/input/InputDatePicker'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import TasksAPI from 'src/_ezs/api/tasks.api'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const MemberBooksEdit = ({ isOpen, isCancel, onHide, data }) => {
  const queryClient = useQueryClient()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      memberBookID: data?.ID,
      content: isCancel ? 'Xác nhận Hủy lịch' : 'Xác nhận đặt lịch',
      mid: data?.Member?.ID,
      title: isCancel ? 'Từ chối đặt lịch' : 'Xác nhận đặt lịch',
      confirm: '1',
      bookinfo: '',
      bookdate: data?.BookDate
        ? moment(data?.BookDate, 'YYYY-MM-DD HH:mm').toDate()
        : '',
      desc: ''
    }
  })

  const confirmBookMutation = useMutation({
    mutationFn: body => TasksAPI.confirmBook(body)
  })

  const onSubmit = values => {
    const bookinfo = {
      Date: data?.BookDate,
      Other: [],
      OrderServiceIDs: data?.RootIds?.split(','),
      Desc: '',
      Title: '',
      StockID: data?.StockID,
      MemberID: data?.Member?.ID
    }
    var bodyFormData = new FormData()
    bodyFormData.append('memberBookID', values.memberBookID)
    bodyFormData.append('content', values.content)
    bodyFormData.append('mid', values.mid)
    bodyFormData.append('title', values.title)
    bodyFormData.append('confirm', values.confirm)
    bodyFormData.append('bookinfo', JSON.stringify(bookinfo))
    bodyFormData.append(
      'bookdate',
      moment(values.bookdate).format('DD/MM/YYYY HH:mm')
    )
    bodyFormData.append('desc', values.desc)

    confirmBookMutation.mutate(bodyFormData, {
      onSuccess: data => {
        queryClient
          .invalidateQueries({ queryKey: ['Notifications'] })
          .then(() => {
            toast.success(
              isCancel
                ? 'Từ chối đặt lịch thành công'
                : 'Xác nhận đặt lịch thành công'
            )
            onHide()
          })
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <AnimatePresence>
      <LayoutGroup key={isOpen}>
        <Dialog open={isOpen} onClose={onHide}>
          <motion.div
            className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1003]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed inset-0 flex items-center justify-center z-[1003]"
            autoComplete="off"
          >
            <motion.div
              className="absolute flex flex-col justify-center h-full py-8"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <Dialog.Panel className="bg-white dark:bg-dark-aside max-w-full w-[500px] max-h-full rounded shadow-lg flex flex-col">
                <Dialog.Title className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">
                    {isCancel ? 'Xác nhận hủy lịch' : 'Xác nhận đặt lịch'}
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </Dialog.Title>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-3.5">
                    <div className="font-semibold">Nội dung</div>
                    <div className="mt-1">
                      <Controller
                        name="content"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            placeholder="Nhập nội dung"
                            value={field.value}
                            onChange={field.onChange}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <div className="font-semibold">Thời gian</div>
                    <div className="mt-1">
                      <Controller
                        name="bookdate"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputDatePicker
                            placeholderText="Chọn ngày sinh"
                            autoComplete="off"
                            onChange={field.onChange}
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            {...field}
                            dateFormat="HH:mm dd/MM/yyyy"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Ghi chú</div>
                    <div className="mt-1">
                      <Controller
                        name="desc"
                        control={control}
                        render={({ field: { ref, ...field }, fieldState }) => (
                          <InputTextarea
                            placeholder="Nhập ghi chú"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={confirmBookMutation.isLoading}
                    disabled={confirmBookMutation.isLoading}
                    type="submit"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    Thực hiện
                  </Button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </form>
        </Dialog>
      </LayoutGroup>
    </AnimatePresence>
  )
}

const MemberBooksItem = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCancel, setIsCancel] = useState(false)
  const onOpen = isType => {
    setIsOpen(true)
    setIsCancel(isType)
  }
  const onHide = () => {
    setIsOpen(false)
  }
  return (
    <>
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
            onClick={() => onOpen(false)}
          >
            Xác nhận
          </Button>
          <Button
            className="relative flex items-center px-3.5 ml-2 text-sm font-medium text-white transition rounded shadow-lg h-9 bg-danger hover:bg-dangerhv focus:outline-none focus:shadow-none"
            type="button"
            onClick={() => onOpen(true)}
          >
            Hủy
          </Button>
        </div>
      </div>
      <MemberBooksEdit
        isOpen={isOpen}
        isCancel={isCancel}
        onHide={onHide}
        data={data}
      />
    </>
  )
}

export { MemberBooksItem }
