import { clsx } from 'clsx/dist/clsx'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useAuth } from 'src/_ezs/core/Auth'
import { useQuery } from '@tanstack/react-query'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
}

const CatalogueContext = createContext()

const useCatalogue = () => {
  return useContext(CatalogueContext)
}

function CatalogueLayout({ paths, isReceive }) {
  const { pathname } = useLocation()
  const { CrStocks } = useAuth()
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const { xuat_nhap, xuat_nhap_ten_slg, xuat_nhap_diem } = useRoles([
    'xuat_nhap',
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg'
  ])

  useEffect(() => {
    if (isOpenMenu) setIsOpenMenu(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const { data } = useQuery({
    queryKey: ['ReceiveStock', CrStocks],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getReceiveStock({
        StockID: CrStocks?.ID,
        IsAllStock:
          xuat_nhap.IsStocks ||
          (xuat_nhap_diem.IsStocks && xuat_nhap_ten_slg.IsStocks)
      })
      return data?.lst || []
    },
    enabled: Boolean(isReceive)
  })

  return (
    <CatalogueContext.Provider
      value={{
        isOpenMenu,
        openMenu: () => setIsOpenMenu(true),
        hideMenu: () => setIsOpenMenu(false)
      }}
    >
      <div className="flex h-full bg-white dark:bg-dark-app relative">
        {isReceive && (
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className={clsx(
              'w-56 h-full px-3 py-4 overflow-auto border-r border-separator dark:border-dark-separator absolute xl:relative bg-white z-50 xl:visible',
              !isOpenMenu && 'invisible'
            )}
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
        )}
        <div
          className={clsx(
            'absolute inset-0 flex items-center justify-center z-40 bg-black/[.2] dark:bg-black/[.4] transition',
            !isOpenMenu ? 'invisible opacity-0' : 'visible opacity-100'
          )}
          onClick={() => setIsOpenMenu(false)}
        />
        <div className="flex-1 h-full overflow-auto grow scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded">
          <Outlet />
        </div>
      </div>
    </CatalogueContext.Provider>
  )
}

export { CatalogueLayout, useCatalogue }
