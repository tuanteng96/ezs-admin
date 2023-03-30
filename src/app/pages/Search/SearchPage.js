import React, { useEffect, useRef } from 'react'
import FixedLayout from 'src/_ezs/layout/FixedLayout'
import { useLocation, useNavigate } from 'react-router'
import { XMarkIcon } from '@heroicons/react/24/outline'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'

function SearchPage(props) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const queryParams = useQueryParams()
  const queryConfig = {
    type: queryParams.type || 'member'
  }

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef?.current?.focus()
  }, [inputRef])

  return (
    <FixedLayout>
      <div className="relative flex flex-col h-full">
        <div className="transition border-b z-[10] border-separator dark:border-dark-separator bg-white dark:bg-dark-aside">
          <div className="h-[85px] relative flex items-center">
            <div className="h-full px-6 grow">
              <input
                ref={inputRef}
                type="text"
                className="w-full h-full text-3xl font-semibold"
                placeholder="Bạn cần tìm kiếm gì ?"
              />
            </div>
            <div
              className="flex items-center justify-center w-16 h-12 cursor-pointer dark:text-graydark-800"
              onClick={() => navigate(state?.previousPath || '/')}
            >
              <XMarkIcon className="w-9" />
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-85px)] flex">
          <div className="flex flex-col w-2/4 border-r border-separator dark:border-dark-separator">
            <div className="px-6 py-4 text-lg font-bold">Khách hàng</div>
            <div className="flex-1 px-6 overflow-auto">
              <div className="h-[1000px]">Danh sách khách hàng</div>
            </div>
          </div>
          <div className="flex flex-col w-2/4 border-r border-separator dark:border-dark-separator">
            <div className="px-6 py-4 text-lg font-bold">Đơn hàng</div>
            <div className="flex-1 px-6 overflow-auto">Danh sách đơn hàng</div>
          </div>
        </div>
      </div>
    </FixedLayout>
  )
}

export default SearchPage
