import React from 'react'
// import PropTypes from 'prop-types'
import {
  AdjustmentsVerticalIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { Popover } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useCalendar } from '../../CalendarLayout'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const CalendarHeader = props => {
  const { openAddEditCalendar } = useCalendar()
  const { pathname } = useLocation()

  return (
    <div className="relative flex justify-between bg-white shadow-lg border-t border-separator px-4 py-4 dark:bg-dark-aside dark:border-t dark:border-[#393945] dark:border-dashed">
      <div>
        <button className="flex items-center px-4 font-semibold text-gray-700 transition bg-white border rounded border-light h-11 dark:bg-transparent dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary">
          Bộ lọc <AdjustmentsVerticalIcon className="w-6 ml-2" />
        </button>
      </div>
      <div className="flex">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="px-3 font-medium text-gray-700 transition bg-white border rounded-l dark:bg-transparent border-light h-11 dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
          >
            <ChevronLeftIcon className="w-5" />
          </button>
          <button
            type="button"
            className="px-4 font-semibold transition border-t border-b bg-light border-light h-11 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
          >
            Hôm nay
          </button>
          <button
            type="button"
            className="px-4 font-semibold transition bg-white border-t border-b border-l border-light h-11 dark:bg-transparent dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
          >
            {moment().format('dd, D MMMM, YYYY')}
          </button>
          <button
            type="button"
            className="px-3 font-medium text-gray-700 transition bg-white border border-light h-11 rounded-r-md dark:bg-transparent dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
          >
            <ChevronRightIcon className="w-5" />
          </button>
        </div>
      </div>
      <div className="flex">
        <Popover className="relative">
          <Popover.Button className="flex items-center px-4 font-semibold text-white transition rounded shadow-sm h-11 bg-success hover:bg-successhv">
            Thêm mới <ChevronDownIcon className="w-4 ml-2" />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 shadow-lg rounded border-0 w-[180px] bg-white dark:bg-site-aside dark:shadow-dark-shadow left-0">
            <div className="flex flex-col py-2.5">
              <Link
                to="/clients/add"
                state={{ previousPath: pathname }}
                className="flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray text-site-color"
              >
                Khách hàng mới
              </Link>
              <button
                type="button"
                onClick={openAddEditCalendar}
                className="flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray text-site-color"
              >
                Đặt lịch mới
              </button>
            </div>
          </Popover.Panel>
        </Popover>
        <div className="ml-2">
          <button className="flex items-center justify-center font-semibold text-gray-700 bg-white border rounded border-light h-11 w-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary">
            <Cog6ToothIcon className="w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

// CalendarHeader.propTypes = {}

export { CalendarHeader }
