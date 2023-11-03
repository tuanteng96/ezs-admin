import { clsx } from 'clsx/dist/clsx'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function CatalogueLayout({ paths }) {
  return (
    <div className="flex h-full bg-white dark:bg-dark-app">
      <PerfectScrollbar
        options={perfectScrollbarOptions}
        className="relative w-56 h-full px-3 py-4 overflow-auto border-r border-separator dark:border-dark-separator"
      >
        <div className="font-bold font-inter text-[17px] py-2 px-4 dark:text-white">
          Danh mục
        </div>
        <ul>
          {paths &&
            paths.map(({ to, name }, index) => (
              <li key={index}>
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      'block px-4 py-3 text-[15px] rounded-md font-medium hover:bg-primarylight hover:text-primary dark:hover:bg-dark-light transition mt-1 dark:text-white',
                      isActive &&
                        'bg-primarylight text-primary dark:bg-dark-light'
                    )
                  }
                  to={to}
                >
                  {name}
                </NavLink>
              </li>
            ))}
        </ul>
      </PerfectScrollbar>
      <div className="flex-1 h-full overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
        <Outlet />
      </div>
    </div>
  )
}

export { CatalogueLayout }
