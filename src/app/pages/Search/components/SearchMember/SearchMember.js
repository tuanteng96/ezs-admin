import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useNavigate } from 'react-router-dom'
import MembersAPI from 'src/_ezs/api/members.api'
import useDebounce from 'src/_ezs/hooks/useDebounce'
import { NotFound } from 'src/_ezs/layout/components/notfound'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'
import { Button } from 'src/_ezs/partials/button'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const ButtonCheckIn = ({ item }) => {
  const navigate = useNavigate()
  const MemberCheckinMutation = useMutation({
    mutationFn: body => MembersAPI.memberOnCheckin(body)
  })

  const onCheckin = async e => {
    e.stopPropagation()
    const id = toast.loading('Đang thực hiện Check In ...', {
      icon: (
        <div className="absolute left-4 top-2/4 -translate-y-2/4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )
    })
    try {
      var bodyFormData = new FormData()
      bodyFormData.append('cmd', 'checkin')
      bodyFormData.append('mid', item.ID)

      await MemberCheckinMutation.mutateAsync(bodyFormData)
      toast.update(id, {
        render: 'Check In thành công.',
        type: 'success',
        isLoading: false,
        icon: '',
        autoClose: 1000
      })
      navigate('/clients/' + item.ID)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex items-center justify-end">
      <Button
        className={clsx(
          'bg-success hover:bg-successhv text-white text-center rounded py-1 px-2.5 text-sm inline-block font-semibold opacity-0 group-hover:opacity-100 transition'
        )}
        disabled={MemberCheckinMutation.isLoading}
        onClick={onCheckin}
        type="button"
      >
        Check IN
      </Button>
    </div>
  )
}

function SearchMember({ valueKey, onChangeMode }) {
  const debouncedKey = useDebounce(valueKey, 200)
  const navigate = useNavigate()

  const ListMembersQuery = useInfiniteQuery({
    queryKey: ['ListMembersSearch', debouncedKey],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await MembersAPI.memberSearch({
        Pi: pageParam,
        Ps: 15,
        Key: debouncedKey
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1,
    onSuccess: ({ pages }) => {
      if (!pages || (pages && pages[0].data.length === 0)) {
        onChangeMode(false)
      } else {
        onChangeMode(true)
      }
    }
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
    <PerfectScrollbar
      className="relative mt-1.5 overflow-auto bg-white dark:bg-dark-app rounded scroll"
      options={perfectScrollbarOptions}
      containerRef={rootRef}
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
                onClick={() => navigate('/clients/' + item.ID)}
                className={clsx(
                  'grid grid-cols-7 gap-4 p-5 transition border-t cursor-pointer hover:bg-light dark:hover:bg-dark-light border-separator dark:border-dark-separator first:border-0 group'
                )}
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
                    {item.GroupNames || 'Không'}
                  </div>
                </div>
                {item.HomeAddress ? (
                  <div className="flex flex-col justify-center col-span-2">
                    <div className="mb-1 text-sm font-inter text-muted">
                      Địa chỉ
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                      {item.HomeAddress || 'Chưa xác định'}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center col-span-2">
                    <div className="mb-1 text-sm font-inter text-muted">
                      Cơ sở
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 dark:text-white">
                      {item?.Stock?.Title || 'Chưa xác định'}
                    </div>
                  </div>
                )}
                {item?.CheckIn ? (
                  <div className="flex flex-col justify-center">
                    <div className="mb-1 text-sm font-inter text-muted">
                      Đang CheckIn
                    </div>
                    <div className="truncate font-bold text-[15px] leading-5 capitalize text-success">
                      {item?.CheckIn?.StockTitle}
                    </div>
                  </div>
                ) : (
                  <ButtonCheckIn item={item} />
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
    </PerfectScrollbar>
  )
}

export { SearchMember }
