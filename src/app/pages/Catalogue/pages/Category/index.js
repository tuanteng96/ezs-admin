import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import {
  ArrowsPointingOutIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'
import { formatString } from 'src/_ezs/utils/formatString'
import { useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const DragHandle = sortableHandle(() => (
  <div className="w-16 flex justify-center items-center">
    <ArrowsPointingOutIcon className="w-5 text-muted2" />
  </div>
))

const SortableItem = sortableElement(({ item }) => {
  const { search } = useLocation()
  const { type } = useParams()
  const { path, title } = formatString.formatTypesProds(type)
  return (
    <li className="flex z-[10001] bg-white transition border-b cursor-pointer border-separator dark:border-dark-separator hover:bg-light">
      <NavLink
        to={{
          pathname: `/catalogue/${path}/edit-category/${type}/${item.ID}`,
          search: search
        }}
        className="block px-5 py-4 flex-1"
      >
        <div className="font-bold">{item.Title}</div>
        <div className="text-muted2">
          {item.Count} {title}
        </div>
      </NavLink>
      <DragHandle />
    </li>
  )
})

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>
})

function Category(props) {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { type } = useParams()
  const { path, title, ID } = formatString.formatTypesProds(type)
  useEscape(() => navigate({ pathname: '/catalogue/' + path, search: search }))

  const { data, isLoading } = useQuery({
    queryKey: ['ListCategory-products'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListCategory()
      let result = []
      if (data) {
        result = data[type.toUpperCase()].filter(x => x.ParentID === ID)
      }
      return result
    }
  })

  return (
    <AnimatePresence>
      <m.div
        key={pathname}
        className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <div className="fixed inset-0 flex items-center justify-center z-[1010]">
        <m.div
          key={pathname}
          className="absolute flex flex-col justify-center xxl:py-10 h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[600px] h-full rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-bold">Danh mục {title}</div>
              <NavLink
                to={{
                  pathname: '/catalogue/' + path,
                  search: search
                }}
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
              >
                <XMarkIcon className="w-8" />
              </NavLink>
            </div>
            <div className="border-b border-separator dark:border-dark-separator">
              <NavLink
                className="flex items-center px-5 py-4 font-semibold text-primary"
                to={{
                  pathname: `/catalogue/${path}/add-category/${type}`,
                  search: search
                }}
              >
                <PlusCircleIcon className="w-7 mr-1.5" />
                Thêm mới danh mục
              </NavLink>
            </div>
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="relative grow"
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
                          <div className=" w-2/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
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
                  {data && data.length > 0 && (
                    <SortableContainer
                      onSortEnd={val => console.log(val)}
                      useDragHandle
                    >
                      {data.map((item, index) => (
                        <SortableItem
                          key={`item-${index}`}
                          index={index}
                          item={item}
                        />
                      ))}
                    </SortableContainer>
                  )}

                  {(!data || data.length === 0) && (
                    <div className="h-full flex justify-center flex-col items-center">
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
                      <div className="font-bold mt-4 text-lg">
                        Chưa có danh mục nào ở đây.
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

export default Category
