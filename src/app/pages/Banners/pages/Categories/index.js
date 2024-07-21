import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useInfiniteQuery } from '@tanstack/react-query'
import BannersAPI from 'src/_ezs/api/banners.api'
import { formatArray } from 'src/_ezs/utils/formatArray'
import useInfiniteScroll from 'react-infinite-scroll-hook'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function Categories(props) {
  const { search, pathname } = useLocation()
  const path = pathname.replace('/categories', '')
  const navigate = useNavigate()

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['BannersCategories'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await BannersAPI.categories({
        pi: pageParam,
        ps: 10
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => fetchNextPage()
  })

  const onToBack = () => {
    navigate({
      pathname: path,
      search: search
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-[1010]">
        <m.div
          key={pathname}
          className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToBack}
        ></m.div>

        <m.div
          className="absolute z-10 flex flex-col justify-center xxl:py-10 h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[500px] h-full rounded shadow-lg flex flex-col overflow-hidden">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-semibold">Quản lý vị trí</div>
              <div
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                onClick={onToBack}
              >
                <XMarkIcon className="w-8" />
              </div>
            </div>
            <div className="border-b border-separator dark:border-dark-separator">
              <NavLink
                className="flex items-center px-5 py-4 text-primary"
                to={{
                  pathname: 'add',
                  search: search
                }}
              >
                <PlusCircleIcon className="w-7 mr-1.5" />
                Thêm mới vị trí
              </NavLink>
            </div>
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="relative grow"
              containerRef={rootRef}
            >
              {isLoading && (
                <>
                  {Array(4)
                    .fill()
                    .map((_, index) => (
                      <div
                        className="px-5 py-4 transition border-b cursor-pointer animate-pulse border-separator dark:border-dark-separator"
                        key={index}
                      >
                        <div className="mb-2.5 font-bold">
                          <div className="w-2/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                        </div>
                        <div className="text-muted2">
                          <div className="w-1/3 h-2.5 bg-gray-200 rounded dark:bg-gray-700"></div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {!isLoading && (
                <>
                  {Lists &&
                    Lists.map((item, index) => (
                      <div
                        ref={sentryRef}
                        key={index}
                        className="flex z-[10001] bg-white border-b cursor-pointer border-separator dark:border-dark-separator hover:bg-light"
                      >
                        <NavLink
                          className="flex-1 block px-5 py-4"
                          to={{
                            pathname: item?.ID.toString(),
                            search: search
                          }}
                          state={{
                            formState: item
                          }}
                        >
                          <div className="font-semibold">
                            <span>[{item?.ID}] {item?.Title}</span>
                          </div>
                          <div className="font-light text-muted2">
                            {item?.Count} bài viết
                            {item.IsPublic !== 1 && (
                              <span className="pl-1 text-sm font-medium text-danger">
                                - Ẩn trên Web/App
                              </span>
                            )}
                          </div>
                        </NavLink>
                      </div>
                    ))}

                  {(!Lists || Lists.length === 0) && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg
                        className="w-16"
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="none" fillRule="evenodd">
                          <path fill="#FBD74C" d="M27 11h16v34H27z" />
                          <path
                            d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM39 14a1 1 0 011 1v26a1 1 0 01-1 1H17a1 1 0 01-1-1V15a1 1 0 011-1zm-1 2H18v24h20V16zm-3 16a1 1 0 01.117 1.993L35 34H21a1 1 0 01-.117-1.993L21 32h14zm0-12a1 1 0 011 1v7a1 1 0 01-1 1H21a1 1 0 01-1-1v-7a1 1 0 011-1zm-1 2H22v5h12v-5z"
                            fill="#101928"
                            fillRule="nonzero"
                          />
                        </g>
                      </svg>
                      <div className="mt-4 text-lg font-bold">
                        Chưa có vị trí nào ở đây.
                      </div>
                    </div>
                  )}
                </>
              )}
            </PerfectScrollbar>
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  )
}

export default Categories
