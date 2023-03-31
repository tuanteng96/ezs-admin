import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import MembersAPI from 'src/_ezs/api/members.api'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { NotFound } from 'src/_ezs/layout/components/notfound'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'

function SearchMember({ valueKey }) {
  const debouncedKey = useDebounce(valueKey, 200)
  const ListMembersQuery = useInfiniteQuery({
    queryKey: ['ListMembersSearch', debouncedKey],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await MembersAPI.memberSearch({
        Pi: pageParam,
        Ps: 20,
        Key: debouncedKey
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1
  })
  const ListMembers = formatArray.useInfiniteQuery(
    ListMembersQuery?.data?.pages
  )

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: ListMembersQuery.isLoading,
    hasNextPage: ListMembersQuery.hasNextPage,
    onLoadMore: () => ListMembersQuery.fetchNextPage()
    //disabled: !!error,
  })

  return (
    <div
      className="relative mt-1.5 overflow-auto bg-white rounded"
      ref={rootRef}
    >
      {ListMembersQuery.isLoading && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                className="grid grid-cols-7 gap-4 p-5 mt-3 transition border-b cursor-pointer border-separator dark:border-dark-separator"
                key={index}
              >
                <div className="flex col-span-3">
                  <div className="flex items-center justify-center font-bold uppercase bg-gray-200 rounded-full w-14 h-14 font-inter dark:bg-gray-700 text-primary animate-pulse"></div>
                  <div className="px-3.5 flex-1 flex justify-center flex-col">
                    <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                      <div className="w-9/12 h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
                    </div>
                    <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  <div className="w-9/12 h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-col justify-center col-span-3">
                  <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  <div className="w-full h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
        </>
      )}
      {!ListMembersQuery.isLoading && (
        <>
          {ListMembers && ListMembers.length > 0 ? (
            ListMembers.map((item, index) => (
              <div
                className="grid grid-cols-7 gap-4 p-5 transition border-t cursor-pointer border-separator dark:border-dark-separator hover:bg-light dark:hover:bg-dark-light"
                ref={sentryRef}
                key={index}
              >
                <div className="flex col-span-3">
                  <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
                    {formatString.getLastFirst(item.FullName)}
                  </div>
                  <div className="px-3.5 flex-1 flex justify-center flex-col">
                    <div className="mb-px font-semibold capitalize truncate dark:text-white font-inter">
                      {item.FullName}
                    </div>
                    <div className="text-sm font-bold text-gray-700 text-dark dark:text-white">
                      {item.MobilePhone}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="mb-1 text-sm font-inter text-muted">Nhóm</div>
                  <div className="truncate font-bold text-[15px] leading-5">
                    {item.GroupNames}
                  </div>
                </div>
                {item.HomeAddress ? (
                  <div className="flex flex-col justify-center col-span-3">
                    <div className="mb-1 text-sm font-inter text-muted">
                      Địa chỉ
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                      {item.HomeAddress || 'Chưa xác định'}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center col-span-3">
                    <div className="mb-1 text-sm font-inter text-muted">
                      Cơ sở
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                      {item?.Stock?.Title || 'Chưa xác định'}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <NotFound Title="Không thấy dữ liệu" />
          )}
          {ListMembers.length > 0 && ListMembersQuery.hasNextPage && (
            <div className="grid grid-cols-7 gap-4 p-5 mt-3 transition border rounded cursor-pointer border-separator dark:border-dark-separator">
              <div className="flex col-span-3">
                <div className="flex items-center justify-center font-bold uppercase bg-gray-200 rounded-full w-14 h-14 font-inter dark:bg-gray-700 text-primary animate-pulse"></div>
                <div className="px-3.5 flex-1 flex justify-center flex-col">
                  <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                    <div className="w-9/12 h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
                  </div>
                  <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="w-9/12 h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
              <div className="flex flex-col justify-center col-span-3">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="w-full h-5 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { SearchMember }
