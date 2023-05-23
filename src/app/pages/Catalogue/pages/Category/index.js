import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import useEscape from 'src/_ezs/hooks/useEscape'
import { formatString } from 'src/_ezs/utils/formatString'
import { useQuery } from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import PerfectScrollbar from 'react-perfect-scrollbar'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

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
                          <div class=" w-2/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                        </div>
                        <div className="text-muted2">
                          <div class="w-1/3 h-2.5 bg-gray-200 rounded dark:bg-gray-700"></div>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {!isLoading && (
                <>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => (
                      <NavLink
                        to="/"
                        className="block px-5 py-4 transition border-b cursor-pointer border-separator dark:border-dark-separator hover:bg-light"
                        key={index}
                      >
                        <div className="font-bold">{item.Title}</div>
                        <div className="text-muted2">
                          {item.Count} {title}
                        </div>
                      </NavLink>
                    ))}
                  {!data || (data.length === 0 && <div>Không có danh mục</div>)}
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
