import React, { Fragment, useEffect, useRef, useState } from 'react'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { useLocation, useNavigate } from 'react-router'
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { SearchMember } from './components/SearchMember/SearchMember'
import { SearchOrder } from './components/SearchOrder/SearchOrder'
import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { createSearchParams, Link } from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'

const ListsType = [
  {
    label: 'Khách hàng',
    value: 'member'
  },
  {
    label: 'Đơn hàng',
    value: 'order'
  }
]

function SearchPage(props) {
  const queryParams = useQueryParams()
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const [Key, setKey] = useState(queryParams?.key || '')
  const [isModeNew, setIsModeNew] = useState(true)

  const inputRef = useRef(null)

  const queryConfig = {
    type: queryParams?.type || 'member'
  }

  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])

  useEscape(() => navigate(state?.previousPath || '/'))

  return (
    <FixedLayout>
      <div className="relative flex flex-col h-full bg-site-app dark:bg-dark-app">
        <div
          className="absolute flex items-center justify-center w-16 h-16 cursor-pointer top-2 right-2 dark:text-graydark-800"
          onClick={() => navigate(state?.previousPath || '/')}
        >
          <XMarkIcon className="w-9" />
        </div>
        <div className="h-full pt-16 pb-8">
          <div className="flex flex-col h-full max-w-4xl m-auto">
            <div className="flex px-6 py-4 bg-white rounded shadow-lg dark:bg-dark-aside">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute w-6 pointer-events-none top-2/4 -translate-y-2/4 text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full h-12 pl-10 text-lg font-semibold pr-14 dark:bg-dark-aside dark:text-white"
                  placeholder={
                    queryConfig.type === 'member'
                      ? 'Nhập thông tin khách hàng cần tìm ?'
                      : 'Nhập thông tin đơn hàng cần tìm ?'
                  }
                  value={Key}
                  onChange={e => setKey(e.target.value)}
                />
                {queryConfig.type === 'member' && (
                  <Link
                    to="/clients/add"
                    state={{
                      previousFinishPath: true,
                      previousPath:
                        pathname + '?type=' + queryConfig.type + '&key=' + Key,
                      key: isModeNew ? '' : Key
                    }}
                    className="absolute right-0 flex items-center justify-center h-full transition cursor-pointer w-14 top-2/4 -translate-y-2/4 text-muted hover:text-black"
                  >
                    <UserPlusIcon className="w-6 mt-1" />
                  </Link>
                )}
              </div>
              <div className="relative h-12 pl-6 border-l border-separator">
                <Listbox
                  value={ListsType.filter(x => x.value === queryConfig.type)[0]}
                  onChange={val =>
                    navigate({
                      pathname: '/search',
                      search: createSearchParams({
                        ...queryConfig,
                        type: val.value
                      }).toString()
                    })
                  }
                >
                  <div className="relative h-full">
                    <div className="flex items-center justify-center h-full">
                      <Listbox.Button
                        type="button"
                        className="flex items-center h-full font-medium"
                      >
                        <span className="block w-[90px] text-left truncate">
                          {
                            ListsType.filter(
                              x => x.value === queryConfig.type
                            )[0].label
                          }
                        </span>
                        <ChevronDownIcon className="w-4 mt-1 ml-2" />
                      </Listbox.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 w-[180px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute">
                        {ListsType.map((item, index) => (
                          <Listbox.Option key={index} value={item}>
                            {({ selected }) => (
                              <div
                                className={clsx(
                                  'flex text-[15px] items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray',
                                  selected
                                    ? 'bg-[#F4F6FA] text-primary dark:text-primary dark:bg-dark-light'
                                    : 'text-site-color'
                                )}
                              >
                                <div className="flex-1 truncate">
                                  {item?.label}
                                </div>
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
              </div>
            </div>
            {queryConfig.type === 'member' ? (
              <SearchMember
                valueKey={Key}
                onChangeMode={val => setIsModeNew(val)}
              />
            ) : (
              <SearchOrder valueKey={Key} />
            )}
          </div>
        </div>
      </div>
    </FixedLayout>
  )
}

export default SearchPage
