import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/_ezs/partials/button'
import { InputDatePickerSolid } from 'src/_ezs/partials/forms/input/InputDatePickerSolid'

const NotificationDrawerFilter = ({
  isShowing,
  onHide,
  onSubmit,
  filters,
  loading
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: filters
  })
  return (
    <Transition show={isShowing}>
      <Transition.Child
        className="absolute max-w-[calc(640px-150px)] w-full h-full bg-white dark:bg-dark-aside right-0 top-0 z-10 flex flex-col border-l border-separator dark:border-dark-separator shadow-lg"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="flex items-center justify-between w-full px-6 border-b py-7 border-separator dark:border-dark-separator">
          <div className="text-2xl font-bold dark:text-graydark-800">
            Bộ lọc
          </div>
          <div className="flex items-center justify-center w-12 h-12">
            <div
              className="flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer dark:bg-dark-light w-11 h-11"
              onClick={onHide}
            >
              <XMarkIcon className="w-6" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="From"
              control={control}
              render={({ field }) => (
                <div className="mb-5">
                  <div className="mb-1.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                    Ngày bắt đầu
                  </div>
                  <InputDatePickerSolid
                    placeholderText="Chọn ngày"
                    selected={field.value}
                    dateFormat="dd/MM/yyyy"
                    onChange={val => field.onChange(val)}
                  />
                </div>
              )}
            />
            <Controller
              name="To"
              control={control}
              render={({ field }) => (
                <div className="mb-5">
                  <div className="mb-1.5 text-base text-gray-800 dark:text-graydark-800 font-inter">
                    Ngày kết thúc
                  </div>
                  <InputDatePickerSolid
                    placeholderText="Chọn ngày"
                    selected={field.value}
                    dateFormat="dd/MM/yyyy"
                    onChange={val => field.onChange(val)}
                  />
                </div>
              )}
            />
            <div>
              <Button
                loading={loading}
                type="submit"
                className="relative flex items-center h-12 px-4 font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-60"
                disabled={loading}
              >
                Thực hiện
              </Button>
            </div>
          </form>
        </div>
      </Transition.Child>
    </Transition>
  )
}

export { NotificationDrawerFilter }
