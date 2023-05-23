import React from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import { formatString } from 'src/_ezs/utils/formatString'

function CategoryAdd(props) {
  const { search } = useLocation()
  const { type } = useParams()
  const { path } = formatString.formatTypesProds(type)
  return (
    <>
      <m.div
        className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <div className="fixed inset-0 flex items-center justify-center z-[1010]">
        <m.div
          className="absolute flex flex-col justify-center py-10 h-5/6"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[470px] rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-bold">Thêm mới danh mục</div>
              <NavLink
                to={{
                  pathname: '/catalogue/' + path + '/select-category/' + type,
                  search: search
                }}
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
              >
                <XMarkIcon className="w-8" />
              </NavLink>
            </div>
            <div>a</div>
          </div>
        </m.div>
      </div>
    </>
  )
}

export default CategoryAdd
