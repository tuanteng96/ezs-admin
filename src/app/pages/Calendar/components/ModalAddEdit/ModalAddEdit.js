import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Select from 'react-select'
import { Button } from 'src/_ezs/partials/button'
import { InputTextareaSolid } from 'src/_ezs/partials/forms'
import { InputDatePickerSolid } from 'src/_ezs/partials/forms/input/InputDatePickerSolid'
import { SelectProdService, SelectStocks } from 'src/_ezs/partials/select'
import { SelectUserService } from 'src/_ezs/partials/select/SelectUserService'
import { useCalendar } from '../../CalendarLayout'

const ModalAddEdit = () => {
  const { addEditCalendar, hideAddEditCalendar } = useCalendar()
  return (
    <Transition show={addEditCalendar.isShowing}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <Transition.Child
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            onClick={hideAddEditCalendar}
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
          ></div>
        </Transition.Child>
        <Transition.Child
          className="absolute max-w-[480px] w-full h-full bg-white dark:bg-dark-aside right-0 top-0 z-10 flex flex-col"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative py-5 text-2xl font-bold text-center border-b border-separator dark:border-dark-separator dark:text-graydark-800">
            <div
              className="absolute flex items-center justify-center transition cursor-pointer w-11 h-11 dark:text-graydark-800 hover:text-primary top-1/2 -translate-y-2/4 left-3"
              onClick={hideAddEditCalendar}
            >
              <XMarkIcon className="w-7" />
            </div>
            Tạo mới đặt lịch
          </div>
          <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
            <div className="px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-[15px] mb-1.5 text-gray-700 font-inter font-medium dark:text-graydark-800">
                Khách hàng
              </div>
              <Select
                options={[]}
                className="select-control select-control-solid"
                classNamePrefix="select"
                placeholder="Chọn khách hàng"
              />
            </div>
            <div className="px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="mb-2">
                <div className="text-[15px] mb-1.5 text-gray-700 font-inter font-medium dark:text-graydark-800">
                  Thời gian / Cơ sở
                </div>
                <InputDatePickerSolid placeholderText="Chọn thời gian" />
              </div>
              <SelectStocks
                className="select-control select-control-solid"
                menuPosition="fixed"
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                menuPortalTarget={document.body}
              />
            </div>
            <div className="px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="mb-3.5">
                <div className="text-[15px] mb-1.5 text-gray-700 font-inter font-medium dark:text-graydark-800">
                  Dịch vụ
                </div>
                <SelectProdService className="select-control select-control-solid" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-medium text-gray-700 font-inter dark:text-graydark-800">
                  Sử dụng tại nhà
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultValue
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none shadow-lg rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
                </label>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="mb-2">
                <div className="text-[15px] mb-1.5 text-gray-700 font-inter font-medium dark:text-graydark-800">
                  Nhiên viên thực hiện
                </div>
                <SelectUserService
                  isClearable
                  className="select-control select-control-solid"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <InputTextareaSolid
                className="resize-none"
                rows={3}
                placeholder="Nhập ghi chú"
                autoComplete="off"
                type="text"
              />
            </div>
          </div>
          <div className="relative px-6 py-4 border-t border-separator dark:border-dark-separator">
            <Button className="flex items-center px-4 font-semibold text-white transition rounded shadow-sm h-11 bg-success hover:bg-successhv">
              Đặt lịch mới
            </Button>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export { ModalAddEdit }
