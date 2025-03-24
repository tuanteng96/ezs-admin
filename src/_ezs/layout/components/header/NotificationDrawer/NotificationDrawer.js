import {
  AdjustmentsVerticalIcon,
  BellAlertIcon,
  BookmarkSlashIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  PencilSquareIcon,
  ShoppingCartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Tab, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { useAuth } from 'src/_ezs/core/Auth'
import { useQuery } from '@tanstack/react-query'
import { NotificationDrawerContent } from './NotificationDrawerContent'
import TasksAPI from 'src/_ezs/api/tasks.api'
import { NotificationDrawerFilter } from './NotificationDrawerFilter'
import { NotificationDrawerTab } from './NotificationDrawerTab'
import { NotFound } from '../../notfound'
import clsx from 'clsx'
import useEscape from 'src/_ezs/hooks/useEscape'
import { useRoles } from 'src/_ezs/hooks/useRoles'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

let initialResult = [
  {
    title: 'Đặt lịch',
    name: 'memberBooks',
    icon: <CalendarDaysIcon className="w-7" />
  },
  {
    title: 'Hủy lịch',
    name: 'memberBooksCancel',
    icon: <BookmarkSlashIcon className="w-7" />
  },
  {
    title: 'Đơn hàng Online',
    name: 'orderWebApp',
    icon: <ShoppingCartIcon className="w-7" />
  },
  {
    title: 'Duyệt thanh toán',
    name: 'smsPayed',
    icon: <CreditCardIcon className="w-7" />
  },
  {
    title: 'Lịch nhắc',
    name: 'noti',
    icon: <PencilSquareIcon className="w-7" />
  },
  {
    title: 'Liên hệ',
    name: 'contact',
    icon: <GlobeAsiaAustraliaIcon className="w-7" />
  },
  {
    title: 'Dịch vụ',
    name: 'osUnDoneList',
    icon: <HeartIcon className="w-7" />
  }
]

const getObjectByKey = (data, key) => {
  if (!data) return []
  return data[key]
}

const NotificationDrawer = props => {
  const { CrStocks, auth } = useAuth()
  const [isShowing, setIsShowing] = useState(false)
  const [isShowingFilter, setIsShowingFilter] = useState(false)
  const [filters, setFilters] = useState({
    From: '',
    To: ''
  })

  const { pos_mng } = useRoles(['pos_mng'])

  const { data, isLoading } = useQuery({
    queryKey: ['Notifications', { ...filters, StockID: CrStocks?.ID }],
    queryFn: () =>
      TasksAPI.getTasksAll({
        ...filters,
        From: filters.From
          ? moment(filters.From).format('DD/MM/YYYY HH:mm')
          : '',
        To: filters.To ? moment(filters.To).format('DD/MM/YYYY HH:mm') : '',
        StockID: CrStocks?.ID
      }),
    onSuccess: () => {
      isShowingFilter && setIsShowingFilter(false)
    },
    enabled: isShowing && CrStocks?.ID > 0 && pos_mng.hasRight
  })

  const onHideShowing = () => {
    isShowingFilter && setIsShowingFilter(false)
    setIsShowing(false)
  }

  useEscape(() => onHideShowing())

  return (
    <>
      {pos_mng.hasRight && (
        <div
          onClick={() => setIsShowing(true)}
          className="relative flex items-center justify-center text-gray-700 transition rounded cursor-pointer dark:text-dark-muted w-11 h-11 hover:bg-light dark:hover:bg-dark-light hover:text-primary"
        >
          {auth?.Present?.CAN_XU_LY[CrStocks?.ID] > 0 && (
            <div className="w-1.5 h-1.5 bg-success rounded-full top-0 animate-blink absolute"></div>
          )}
          <BellAlertIcon
            className={clsx(
              'w-6 h-6',
              auth?.Present?.CAN_XU_LY[CrStocks?.ID] > 0 && 'animate-ring-bell'
            )}
          />
        </div>
      )}

      <Transition show={isShowing}>
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
              onClick={onHideShowing}
              className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            ></div>
          </Transition.Child>
          <Tab.Group
            onChange={index => isShowingFilter && setIsShowingFilter(false)}
          >
            <Transition.Child
              className="absolute max-w-[640px] w-full h-full bg-white dark:bg-dark-aside right-0 top-0 z-10 flex"
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-[150px] flex flex-col">
                <div className="flex items-center justify-center border-b py-7 border-separator dark:border-dark-separator">
                  <div
                    className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                    onClick={onHideShowing}
                  >
                    <XMarkIcon className="w-9" />
                  </div>
                </div>
                <div className="overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                  <Tab.List className="flex flex-col">
                    {initialResult.map(({ title, icon, name }, index) => (
                      <Tab as={Fragment} key={index}>
                        {({ selected }) => (
                          <div>
                            <NotificationDrawerTab
                              selected={selected}
                              title={title}
                              icon={icon}
                              count={
                                getObjectByKey(data?.data?.data, name).length
                              }
                            />
                          </div>
                        )}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
              </div>
              <Tab.Panels className="flex-1 bg-site-app dark:bg-dark-app">
                {initialResult.map(({ title, name }, index) => (
                  <Tab.Panel className="relative h-full" key={index}>
                    <div className="absolute top-0 left-0 z-10 flex items-center justify-between w-full h-20 px-6 bg-site-app dark:bg-dark-app">
                      <div className="text-2xl font-bold dark:text-graydark-800">
                        {title}
                      </div>
                      <div
                        className="flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer dark:bg-dark-light w-11 h-11"
                        onClick={() => setIsShowingFilter(true)}
                      >
                        <AdjustmentsVerticalIcon className="w-6" />
                      </div>
                    </div>
                    <div className="h-full px-6 pt-20 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                      {isLoading && (
                        <>
                          {Array(2)
                            .fill()
                            .map((_, x) => (
                              <div
                                className="p-6 mb-4 bg-white rounded shadow-sm dark:bg-dark-aside"
                                key={x}
                              >
                                <div role="status" className="animate-pulse">
                                  <div className="w-48 mb-4 bg-gray-200 rounded-sm h-7 dark:bg-gray-700" />
                                  <div className="h-3.5 bg-gray-200 rounded-sm dark:bg-gray-700 w-10/12 mb-2.5" />
                                  <div className="h-3.5 bg-gray-200 rounded-sm dark:bg-gray-700 mb-2.5" />
                                  <div className="h-3.5 bg-gray-200 rounded-sm dark:bg-gray-700 w-9/12 mb-2.5" />
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                      {!isLoading && (
                        <>
                          {getObjectByKey(data?.data?.data, name).length > 0 &&
                            getObjectByKey(data?.data?.data, name).map(
                              (item, index) => (
                                <NotificationDrawerContent
                                  data={item}
                                  key={index}
                                  name={name}
                                />
                              )
                            )}
                          {getObjectByKey(data?.data?.data, name).length ===
                            0 && (
                            <NotFound
                              Title="Thông báo trống"
                              Desc="Bạn chưa có bất kì thông báo nào."
                            />
                          )}
                        </>
                      )}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Transition.Child>
            <NotificationDrawerFilter
              isShowing={isShowingFilter}
              onHide={() => setIsShowingFilter(false)}
              filters={filters}
              onSubmit={val => setFilters(val)}
              loading={isLoading}
            />
          </Tab.Group>
        </div>
      </Transition>
    </>
  )
}

export { NotificationDrawer }
