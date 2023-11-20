import { clsx } from 'clsx/dist/clsx'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useAuth } from 'src/_ezs/core/Auth'
import { useQuery } from '@tanstack/react-query'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

function CatalogueLayout({ paths, isReceive }) {
  const { CrStocks } = useAuth()

  const { data } = useQuery({
    queryKey: ['ReceiveStock', CrStocks],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getReceiveStock({
        StockID: CrStocks?.ID
      })
      return data?.lst || []
    },
    enabled: Boolean(isReceive)
  })

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
          {isReceive && data && data.length > 0 && (
            <li>
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    'block px-4 py-3 text-[15px] rounded-md font-medium hover:bg-primarylight hover:text-primary dark:hover:bg-dark-light transition mt-1 dark:text-white',
                    isActive &&
                      'bg-primarylight text-primary dark:bg-dark-light'
                  )
                }
                to="/catalogue/ie-processed"
              >
                <span className="pr-2">Đơn cần xử lý</span>
                <span className="bg-danger text-white text-[10px] px-2 py-px rounded">
                  {data.length}
                </span>
              </NavLink>
            </li>
          )}
        </ul>
      </PerfectScrollbar>
      <div className="flex-1 h-full overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
        <Outlet />
      </div>
    </div>
  )
}

export { CatalogueLayout }
