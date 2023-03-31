import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import OrdersAPI from 'src/_ezs/api/orders'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'
import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const SearchOrder = ({ valueKey }) => {
  const debouncedKey = useDebounce(valueKey, 200)
  const ListOrdersQuery = useInfiniteQuery({
    queryKey: ['ListOrdersSearch', debouncedKey],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await OrdersAPI.orderSearch({
        Pi: pageParam,
        Ps: 20,
        Key: debouncedKey
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1
  })
  const ListOrders = formatArray.useInfiniteQuery(ListOrdersQuery?.data?.pages)

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: ListOrdersQuery.isLoading,
    hasNextPage: ListOrdersQuery.hasNextPage,
    onLoadMore: () => ListOrdersQuery.fetchNextPage()
    //disabled: !!error,
  })

  return (
    <div
      className="flex-1 px-6 py-6 pt-3 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded relative"
      ref={rootRef}
    >
      {ListOrdersQuery.isLoading &&
        Array(3)
          .fill()
          .map((_, index) => (
            <div
              className="grid grid-cols-5 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator transition"
              key={index}
            >
              <div className="flex col-span-2">
                <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-gray-200 dark:bg-gray-700 text-primary animate-pulse"></div>
                <div className="px-3.5 flex-1 flex justify-center flex-col">
                  <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                    <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
                  </div>
                  <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                </div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
              </div>
            </div>
          ))}
      {!ListOrdersQuery.isLoading && (
        <>
          {ListOrders && ListOrders.length > 0 ? (
            ListOrders.map((item, index) => (
              <div
                className="grid grid-cols-5 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator hover:bg-light dark:hover:bg-dark-light transition"
                key={index}
                ref={sentryRef}
              >
                <div className="flex col-span-2">
                  <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
                    {formatString.getLastFirst(
                      item.Member?.FullName || item.SenderName
                    )}
                  </div>
                  <div className="px-3.5 flex-1 flex justify-center flex-col">
                    <div className="mb-px font-semibold capitalize truncate dark:text-white font-inter">
                      {item.Member?.FullName || item.SenderName}
                    </div>
                    <div className="text-sm font-bold text-gray-700 text-dark dark:text-white">
                      {item.Member?.MobilePhone || item.SenderPhone}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-end flex-col">
                  <div className="text-sm font-inter text-muted mb-1">
                    ID đơn hàng
                  </div>
                  <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                    #{item.ID}
                  </div>
                </div>
                <div className="flex justify-center items-end flex-col">
                  <div className="text-sm font-inter text-muted mb-1">
                    Ngày mua
                  </div>
                  <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                    {moment(item.CreateDate).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div className="flex justify-center items-end flex-col">
                  <div className="text-sm font-inter text-muted mb-1">
                    Tổng giá trị
                  </div>
                  <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                    {formatString.formatVND(item.thanhtoan?.tong_gia_tri_dh)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Không có dữ liệu</div>
          )}
          {ListOrders.length > 0 && ListOrdersQuery.hasNextPage && (
            <div className="grid grid-cols-5 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator transition">
              <div className="flex col-span-2">
                <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-gray-200 dark:bg-gray-700 text-primary animate-pulse"></div>
                <div className="px-3.5 flex-1 flex justify-center flex-col">
                  <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                    <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
                  </div>
                  <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                </div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
              </div>
              <div className="flex justify-center items-end flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { SearchOrder }
