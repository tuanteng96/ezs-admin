import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import MembersAPI from 'src/_ezs/api/members.api'
import useDebounce from 'src/_ezs/hooks/useDebounce'
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
      className="flex-1 px-6 py-6 pt-3 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded relative"
      ref={rootRef}
    >
      {ListMembersQuery.isLoading && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                className="grid grid-cols-7 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator transition"
                key={index}
              >
                <div className="flex col-span-3">
                  <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-gray-200 dark:bg-gray-700 text-primary animate-pulse"></div>
                  <div className="px-3.5 flex-1 flex justify-center flex-col">
                    <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                      <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
                    </div>
                    <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  </div>
                </div>
                <div className="flex justify-center flex-col">
                  <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
                </div>
                <div className="col-span-3 flex justify-center flex-col">
                  <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                  <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
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
                className="grid grid-cols-7 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator hover:bg-light dark:hover:bg-dark-light transition"
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
                <div className="flex justify-center flex-col">
                  <div className="text-sm font-inter text-muted mb-1">Nhóm</div>
                  <div className="truncate font-bold text-[15px] leading-5">
                    {item.GroupNames}
                  </div>
                </div>
                {item.HomeAddress ? (
                  <div className="col-span-3 flex justify-center flex-col">
                    <div className="text-sm font-inter text-muted mb-1">
                      Địa chỉ
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                      {item.HomeAddress || 'Chưa xác định'}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-3 flex justify-center flex-col">
                    <div className="text-sm font-inter text-muted mb-1">
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
            <div>Không có dữ liệu</div>
          )}
          {ListMembers.length > 0 && ListMembersQuery.hasNextPage && (
            <div className="grid grid-cols-7 gap-4 p-5 border rounded mt-3 cursor-pointer border-separator dark:border-dark-separator transition">
              <div className="flex col-span-3">
                <div className="flex items-center justify-center font-bold uppercase rounded-full w-14 h-14 font-inter bg-gray-200 dark:bg-gray-700 text-primary animate-pulse"></div>
                <div className="px-3.5 flex-1 flex justify-center flex-col">
                  <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
                    <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
                  </div>
                  <div className="h-3.5 mt-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                </div>
              </div>
              <div className="flex justify-center flex-col">
                <div className="h-3.5 mb-1 bg-gray-200 rounded dark:bg-gray-700 w-2/4"></div>
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-9/12"></div>
              </div>
              <div className="col-span-3 flex justify-center flex-col">
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

export { SearchMember }
