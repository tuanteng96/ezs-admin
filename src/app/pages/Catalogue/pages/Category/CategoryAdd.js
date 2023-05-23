import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

function CategoryAdd(props) {
  return (
    <AnimatePresence>
      <m.div
        className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1010]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></m.div>
      <div className="fixed inset-0 flex items-center justify-center z-[1010]">
        <m.div
          className="absolute flex flex-col justify-center h-5/6 py-10"
          initial={{ opacity: 0, top: '60%' }}
          animate={{ opacity: 1, top: 'auto' }}
          exit={{ opacity: 0, top: '60%' }}
        >
          <div className="bg-white dark:bg-dark-aside max-w-full w-[470px] rounded shadow-lg flex flex-col">
            <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-2xl font-bold">Thêm mới danh mục</div>
              <NavLink
                to="/catalogue/products/select-category/sp"
                className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
              >
                <XMarkIcon className="w-8" />
              </NavLink>
            </div>
            <div>a</div>
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  )
}

export default CategoryAdd
