import { Transition } from '@headlessui/react'
import { BarsArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import MembersAPI from 'src/_ezs/api/members.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { NotFound } from '../../notfound'
import { DropdownCheckinItem } from './DropdownCheckinItem'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { DropdownCheckinFilter } from './DropdownCheckinFilter'

const DropdownCheckin = props => {
  const { CrStocks, auth } = useAuth()
  const [isShowing, setIsShowing] = useState(false)
  const [key, setkey] = useState('')
  const [type, setType] = useState({
    value: '',
    label: 'Tất cả'
  })

  const debouncedKey = useDebounce(key, 300)

  const onHideShowing = () => {
    setIsShowing(false)
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'MembersCheckin',
      { StockID: CrStocks?.ID, Key: debouncedKey, Type: type?.value }
    ],
    queryFn: async () => {
      const data = await MembersAPI.memberCheckin({
        StockID: CrStocks?.ID,
        Key: debouncedKey,
        Type: type?.value
      })
      return data?.data || []
    },
    onSuccess: () => {},
    enabled: (isShowing && CrStocks?.ID > 0) || Boolean(debouncedKey)
  })

  return (
    <>
      {auth?.Present?.CHECKIN[CrStocks?.ID] > 0 && (
        <button
          type="button"
          className="relative flex items-center px-4 text-sm font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none text"
          onClick={() => setIsShowing(true)}
        >
          <span className="absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
            <span className="relative inline-flex w-3 h-3 border border-white rounded-full bg-primary"></span>
          </span>
          <span className="font-medium font-inter">
            {auth?.Present?.CHECKIN[CrStocks?.ID]} khách CheckIn
          </span>
          <BarsArrowDownIcon className="w-6 h-6 ml-3" />
        </button>
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
          <Transition.Child
            className="absolute max-w-[460px] w-full h-full bg-white dark:bg-dark-aside right-0 top-0 z-10 flex flex-col"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative py-5 text-xl font-bold text-center border-b border-separator dark:border-dark-separator dark:text-graydark-800">
              <div
                className="absolute flex items-center justify-center transition cursor-pointer w-11 h-11 dark:text-graydark-800 hover:text-primary top-1/2 -translate-y-2/4 left-3"
                onClick={onHideShowing}
              >
                <XMarkIcon className="w-7" />
              </div>
              Khách CheckIn
            </div>
            <DropdownCheckinFilter
              valueText={key}
              onChangeInput={e => setkey(e)}
              valueOption={type}
              onChangeType={e => setType(e)}
            />
            <div className="p-6 overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
              {isLoading && (
                <>
                  {Array(2)
                    .fill()
                    .map((_, index) => (
                      <div
                        role="status"
                        className="flex pb-5 mb-5 border-b border-dashed animate-pulse border-separator dark:border-dark-separator last:mb-0 last:pb-0 last:border-0"
                        key={index}
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded dark:bg-gray-700"></div>
                        <div className="px-3.5 grow">
                          <div className="w-4/5 h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
                          <div className="flex mt-2">
                            <div className="w-2/4 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                            <div className="w-1/5 h-3 ml-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end w-24">
                          <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                          <div className="w-10 h-10 ml-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {!isLoading && (
                <>
                  {data?.data.length > 0 ? (
                    <>
                      {data?.data.map((member, index) => (
                        <DropdownCheckinItem member={member} key={index} />
                      ))}
                    </>
                  ) : (
                    <NotFound
                      Title="Không có dữ liệu"
                      Desc={
                        key
                          ? 'Dữ liệu Check In không được tìm thấy'
                          : 'Hiện tại chưa có khách hàng Check In.'
                      }
                    />
                  )}
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  )
}

export { DropdownCheckin }
