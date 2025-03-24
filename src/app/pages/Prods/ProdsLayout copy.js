import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'

const ProdsContext = createContext()

const useProds = () => {
  return useContext(ProdsContext)
}

function ProdsLayout() {
  let [MenuActive, setMenuActive] = useState(null)
  const { updateLoadingContent } = useLayout()

  let { pathname } = useLocation()

  const { data } = useQuery({
    queryKey: ['ProdsThreeCate'],
    queryFn: async () => {
      let rs = await ProdsAPI.getThreeCate()
      return rs?.data?.data
        ? rs?.data?.data.map(x => ({
            ...x,
            Title: x.NameFr === 'nvl' ? 'Nguyên vật liệu' : x.Title
          }))
        : []
    },
    onSuccess: () => {
      updateLoadingContent(false)
    }
  })

  useEffect(() => {
    if (data) {
      let index = data.findIndex(
        x => x.NameFr === (pathname && pathname.replaceAll('/prods/', ''))
      )
      if (index > -1) setMenuActive(data[index])
      else setMenuActive(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pathname])

  return (
    <ProdsContext.Provider value={{ MenuActive }}>
      <div className="flex h-full">
        <div className="relative h-full w-[210px] bg-white border-r border-[#eaeaea]">
          <div className="h-full px-3 py-6 overflow-auto font-inter">
            <div className="mb-6 last:mb-0">
              <div className="text-[17px] font-semibold pl-3.5 mb-3">
                Danh mục
              </div>
              <div className="flex flex-col gap-1">
                {data &&
                  data.map((item, index) => (
                    <NavLink
                      className={({ isActive }) =>
                        clsx(
                          'block px-3.5 py-3 hover:bg-[#f6f6f6] text-[14px] rounded-lg transition-all',
                          isActive && 'bg-primarylight text-primary'
                        )
                      }
                      to={item.NameFr + `?id=${item.ID}`}
                      key={index}
                    >
                      {item.Title}
                    </NavLink>
                  ))}
              </div>
            </div>
            {/* <div className="mb-6 last:mb-0">
              <div className="text-[17px] font-semibold pl-3.5 mb-3">Tools</div>
              <div className="flex flex-col gap-1">
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      'block px-3.5 py-3 hover:bg-[#f6f6f6] text-[14px] rounded-lg transition-all',
                      isActive && 'bg-primarylight text-primary'
                    )
                  }
                  to="cai-dat-hoa-hong"
                >
                  Cài đặt hoa hồng
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      'block px-3.5 py-3 hover:bg-[#f6f6f6] text-[14px] rounded-lg transition-all',
                      isActive && 'bg-primarylight text-primary'
                    )
                  }
                  to="cai-dat-luong-tour"
                >
                  Cài đặt lương Tour
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    clsx(
                      'block px-3.5 py-3 hover:bg-[#f6f6f6] text-[14px] rounded-lg transition-all',
                      isActive && 'bg-primarylight text-primary'
                    )
                  }
                  to="cai-dat-hinh-anh"
                >
                  Cài đặt hình ảnh
                </NavLink>
              </div>
            </div> */}
          </div>
          <div className="absolute w-8 h-8 bg-white border border-[#eaeaea] rounded-full flex items-center justify-center top-6 -right-4 cursor-pointer">
            <svg
              className="w-5"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <path
                fillRule="evenodd"
                d="M19.957 9.043a1 1 0 0 1 0 1.414L14.414 16l5.543 5.543a1 1 0 0 1-1.414 1.414l-6.25-6.25a1 1 0 0 1 0-1.414l6.25-6.25a1 1 0 0 1 1.414 0"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 h-full bg-white">
          <Outlet />
        </div>
      </div>
    </ProdsContext.Provider>
  )
}

export { ProdsLayout, useProds }
