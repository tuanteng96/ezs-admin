import React, { useEffect, useRef, useState } from 'react'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { useLocation, useNavigate } from 'react-router'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { SearchMember } from './components/SearchMember/SearchMember'
import { SearchOrder } from './components/SearchOrder/SearchOrder'

function SearchPage(props) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [Key, setKey] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])

  return (
    <FixedLayout>
      <div className="relative flex flex-col h-full bg-site-app">
        <div className="transition z-[10]">
          <div className="h-[85px] relative flex justify-end items-center px-6">
            {/* <div className="h-full px-6 grow">
              <input
                ref={inputRef}
                type="text"
                className="w-full h-full text-3xl font-semibold dark:bg-dark-aside dark:text-white"
                placeholder="Bạn cần tìm kiếm gì ?"
                onChange={e => setKey(e.target.value)}
              />
            </div> */}
            <div
              className="flex items-center justify-center w-16 h-12 cursor-pointer dark:text-graydark-800"
              onClick={() => navigate(state?.previousPath || '/')}
            >
              <XMarkIcon className="w-9" />
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-85px)]">
          <div className="max-w-4xl m-auto">
            <div className="bg-white p-5 rounded shadow-lg flex items-center">
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full text-xl h-12 font-semibold dark:bg-dark-aside dark:text-white"
                  placeholder="Bạn cần tìm kiếm gì ?"
                  onChange={e => setKey(e.target.value)}
                />
              </div>
              <div>Khách hàng</div>
            </div>
          </div>
        </div>
        {/* <div className="h-[calc(100%-85px)] flex dark:bg-dark-aside">
          <div className="flex flex-col w-2/4 border-r border-separator dark:border-dark-separator">
            <div className="px-6 py-4 text-xl font-bold border-b border-separator dark:border-dark-separator dark:text-white">
              Khách hàng
            </div>
            <SearchMember valueKey={Key} />
          </div>
          <div className="flex flex-col w-2/4 border-r border-separator dark:border-dark-separator">
            <div className="px-6 py-4 text-xl font-bold border-b border-separator dark:border-dark-separator dark:text-white">
              Đơn hàng
            </div>
            <SearchOrder valueKey={Key} />
          </div>
        </div> */}
      </div>
    </FixedLayout>
  )
}

export default SearchPage
