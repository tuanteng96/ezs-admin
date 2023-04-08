import React, { Fragment, useState } from 'react'
// import PropTypes from 'prop-types'
import {
  AdjustmentsVerticalIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Listbox, Popover, Transition } from '@headlessui/react'
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { InputDatePickerInline } from 'src/_ezs/partials/forms'
import clsx from 'clsx'
import { CalendarFilters } from '../CalendarFilters/CalendarFilters'
import { isEmpty, omitBy } from 'lodash'
import useEscape from 'src/_ezs/hooks/useEscape'
import { CalendarLock } from '../CalendarLock/CalendarLock'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const ListView = [
  {
    value: 'dayGridMonth',
    label: 'Theo Tháng'
  },
  {
    value: 'timeGridWeek',
    label: 'Theo Tuần'
  },
  {
    value: 'timeGridDay',
    label: 'Theo Ngày'
  },
  {
    value: 'listWeek',
    label: 'Danh sách'
  },
  {
    value: 'resourceTimeGridDay',
    label: 'Nhân viên'
  }
]

const CalendarHeader = ({ queryConfig }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [isFilters, setIsFilters] = useState(false)

  const onHideFilters = () => {
    setIsFilters(false)
  }

  useEscape(() => onHideFilters())

  const views = ListView.filter(x => x.value === queryConfig.view)[0]
  return (
    <div className="relative flex justify-between bg-white shadow-lg dark:border-l border-t border-separator px-4 py-4 dark:bg-dark-aside dark:border-t dark:border-[#393945] dark:border-dashed dark:border-l-solid">
      <div className="flex">
        <Listbox
          value={views}
          onChange={val =>
            navigate({
              pathname: '/calendar',
              search: createSearchParams(
                omitBy(
                  {
                    ...queryConfig,
                    view: val.value
                  },
                  isEmpty
                )
              ).toString()
            })
          }
        >
          <div className="relative h-full">
            <div className="flex items-center justify-center h-full">
              <Listbox.Button
                type="button"
                className="flex items-center justify-center px-4 font-semibold text-gray-900 bg-white border rounded border-light h-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
              >
                <span className="block w-[100px] text-[15px] text-left truncate">
                  {views?.label}
                </span>
                <ChevronDownIcon className="w-3.5 ml-2" />
              </Listbox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 max-w-[200px] w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute">
                {ListView.map((item, index) => (
                  <Listbox.Option key={index} value={item}>
                    {({ selected }) => (
                      <div
                        className={clsx(
                          'flex items-center px-5 py-3 text-sm hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray',
                          selected
                            ? 'bg-[#F4F6FA] text-primary dark:text-primary dark:bg-dark-light'
                            : 'text-site-color'
                        )}
                        key={index}
                      >
                        <div className="flex-1 truncate">{item?.label}</div>
                        {selected && (
                          <div className="flex justify-end w-8">
                            <CheckIcon className="w-4 text-current" />
                          </div>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        {/* <button
          className="flex items-center justify-center mx-2 font-semibold text-gray-900 bg-white border rounded border-light h-11 w-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
          onClick={() =>
            navigate({
              pathname: '/calendar',
              search: createSearchParams(
                omitBy(
                  {
                    ...queryConfig,
                    day: moment(queryConfig.day, 'YYYY-MM-DD')
                      .add(-1, 'days')
                      .format('YYYY-MM-DD')
                  },
                  isEmpty
                )
              ).toString()
            })
          }
        >
          <ChevronLeftIcon className="w-4" />
        </button>
        <button
          className="flex items-center justify-center font-semibold text-gray-900 bg-white border rounded border-light h-11 w-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
          onClick={() =>
            navigate({
              pathname: '/calendar',
              search: createSearchParams(
                omitBy(
                  {
                    ...queryConfig,
                    day: moment(queryConfig.day, 'YYYY-MM-DD')
                      .add(1, 'days')
                      .format('YYYY-MM-DD')
                  },
                  isEmpty
                )
              ).toString()
            })
          }
        >
          <ChevronRightIcon className="w-4" />
        </button> */}
        <button
          disabled={moment(queryConfig.day, 'YYYY-MM-DD').isSame(
            moment().format('YYYY-MM-DD'),
            'day'
          )}
          className="flex items-center justify-center px-3 ml-2 font-semibold text-gray-900 bg-white border rounded border-light h-11 dark:bg-dark-light dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary disabled:bg-light disabled:text-gray-400 disabled:hover:text-gray-400 dark:disabled:opacity-40"
          onClick={() =>
            navigate({
              pathname: '/calendar',
              search: createSearchParams(
                omitBy(
                  {
                    ...queryConfig,
                    day: moment().format('YYYY-MM-DD')
                  },
                  isEmpty
                )
              ).toString()
            })
          }
        >
          Hôm nay
        </button>
      </div>
      <div className="flex">
        <InputDatePickerInline
          className="flex items-center text-xl font-bold font-inter dark:text-white h-ful"
          iconClassName="w-4 transition ml-2"
          // value={field.value}
          valueText={moment(queryConfig.day, 'YYYY-MM-DD').format(
            'dd, DD MMMM, YYYY'
          )}
          selected={moment(queryConfig.day, 'YYYY-MM-DD').toDate()}
          onChange={(e, close) => {
            navigate({
              pathname: '/calendar',
              search: createSearchParams(
                omitBy(
                  {
                    ...queryConfig,
                    day: moment(e).format('YYYY-MM-DD')
                  },
                  isEmpty
                )
              ).toString()
            })
            close()
          }}
          wrapClasName="flex items-center"
        />
      </div>
      <div className="flex">
        <button
          className="flex items-center px-4 font-semibold text-gray-900 transition bg-white border rounded border-light h-11 dark:bg-transparent dark:border-dark-separator dark:text-graydark-800 hover:text-primary dark:hover:text-primary"
          onClick={() => setIsFilters(true)}
        >
          Bộ lọc <AdjustmentsVerticalIcon className="w-6 ml-2" />
        </button>
        <CalendarFilters
          isFilters={isFilters}
          onHideFilters={onHideFilters}
          queryConfig={queryConfig}
        />
        <div className="mx-2">
          <CalendarLock />
        </div>
        <Popover className="relative">
          <Popover.Button className="flex items-center px-4 font-semibold text-white transition rounded shadow-sm h-11 bg-success hover:bg-successhv">
            Thêm mới <ChevronDownIcon className="w-4 ml-2" />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 shadow-lg rounded border-0 w-[180px] bg-white dark:bg-site-aside dark:shadow-dark-shadow right-0">
            <div className="flex flex-col py-2.5">
              <Link
                to="/clients/add"
                state={{ previousPath: pathname, previousFinishPath: true }}
                className="flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray text-site-color"
              >
                Khách hàng mới
              </Link>
              <Link
                state={{ previousPath: pathname }}
                to="/appointments/new"
                className="flex items-center px-5 py-3 text-[15px] hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray text-site-color"
              >
                Đặt lịch mới
              </Link>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  )
}

// CalendarHeader.propTypes = {}

export { CalendarHeader }
