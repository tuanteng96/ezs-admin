import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import React, { Fragment, useMemo } from 'react'
import {
  NavLink,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import ProdsAPI from 'src/_ezs/api/prods.api'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatString } from 'src/_ezs/utils/formatString'
import { PickerInventory } from './components'
import { useAuth } from 'src/_ezs/core/Auth'

function Inventory(props) {
  const { CrStocks } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    cmd: 'prodinstock',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 15,
    Only: queryParams.Only || true,
    RootTypeID: queryParams.RootTypeID || '',
    manus: queryParams.manus || '',
    StockID: 'StockID' in queryParams ? queryParams.StockID : CrStocks?.ID,
    Key: queryParams.Key || '',
    NotDelv: queryParams.NotDelv || true
  }

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListInventory', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: queryConfig.cmd,
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        manus: queryConfig.manus,
        '(filter)Only': queryConfig.Only,
        '(filter)RootTypeID': queryConfig.RootTypeID,
        '(filter)StockID': queryConfig.StockID,
        '(filter)key': queryConfig.Key,
        '(filter)NotDelv': queryConfig.NotDelv
      }
      let { data } = await ProdsAPI.getListInventory(newQueryConfig)
      return data?.data?.list || []
    },
    keepPreviousData: true
  })

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        width: 100,
        sortable: false
      },
      {
        key: 'TypeText',
        title: 'Hình ảnh',
        dataKey: 'TypeText',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <div className="border border-separator">
              {rowData?.Thumbnail ? (
                <ImageLazy
                  wrapperClassName="object-cover w-16 h-16 !block"
                  className="object-cover w-16 h-16"
                  effect="blur"
                  src={toAbsolutePath(rowData?.Thumbnail)}
                  alt={rowData.Title}
                />
              ) : (
                <svg
                  className="w-16 h-16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1000 1000"
                >
                  <path fill="#fff" d="M0 0h1000v1000H0z" />
                  <g opacity=".1">
                    <path d="M566.64 267.54V237.6c0-6.74-5.46-12.2-12.2-12.2h-5.37v-68.2c0-6.74-5.46-12.2-12.2-12.2h-73.72c-6.74 0-12.2 5.46-12.2 12.2v68.18h-5.37c-6.74 0-12.2 5.46-12.2 12.2v29.94c-43.58 4.54-76.71 41.22-76.81 85.03v490.23c0 6.74 5.46 12.21 12.2 12.21h262.49c6.74 0 12.2-5.46 12.2-12.2V352.56c-.11-43.81-33.24-80.49-76.82-85.02zM500 166.48c15.23 0 27.58 12.35 27.58 27.58 0 15.23-12.35 27.58-27.58 27.58-15.23 0-27.58-12.35-27.58-27.58 0-15.23 12.35-27.58 27.58-27.58zm-42.23 83.32h84.46v17.33h-84.46V249.8zm161.27 580.79H380.96V352.56c.04-33.68 27.34-60.98 61.02-61.02h116.03c33.68.04 60.98 27.34 61.02 61.02v478.03z" />
                    <path d="M419.04 406.1c-6.74 0-12.2 5.46-12.2 12.2v263.14c0 6.74 5.46 12.2 12.2 12.2s12.2-5.46 12.2-12.2V418.31c.01-6.74-5.46-12.21-12.2-12.21z" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        ),
        width: 100,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Title',
        title: 'Tên sản phẩm',
        dataKey: 'Title',
        width: 300,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">{rowData.Title}</div>
            <div className="text-sm">{rowData.ProdCode}</div>
          </div>
        ),
        sortable: false
      },
      {
        key: 'Unit',
        title: 'Đơn vị',
        dataKey: 'Unit',
        width: 120,
        cellRenderer: ({ rowData }) => <div>{rowData.Unit}</div>,
        sortable: false
      },
      {
        key: 'Qty',
        title: 'Tồn PM',
        dataKey: 'Qty',
        width: 120,
        cellRenderer: ({ rowData }) => <div>{rowData.Qty}</div>,
        sortable: false
      },
      {
        key: 'RealQty',
        title: 'Tồn kho',
        dataKey: 'RealQty',
        width: 120,
        cellRenderer: ({ rowData }) => <div>{rowData.RealQty}</div>,
        sortable: false
      },
      {
        key: 'PriceBase',
        title: 'Giá Cost',
        dataKey: 'PriceBase',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceBase)}</div>
        ),
        sortable: false
      },
      {
        key: 'PriceBase*Qty',
        title: 'Giá trị tồn',
        dataKey: 'PriceBase*Qty',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceBase * rowData?.Qty)}</div>
        ),
        sortable: false
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassNames: () => 'justify-center adad',
        width: 80,
        cellRenderer: ({ rowData }) => (
          <PickerInventory
            item={rowData}
            StockID={queryConfig['(filter)StockID']}
          >
            {({ open }) => (
              <div className="flex justify-center w-full">
                <button
                  type="button"
                  className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded-full"
                  onClick={open}
                >
                  <ArrowRightIcon className="w-5" />
                </button>
              </div>
            )}
          </PickerInventory>
        ),
        sortable: false,
        frozen: 'right',
        align: 'center'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-3xl font-bold dark:text-white">
            Kho & hàng tồn
          </div>
          <div className="mt-1.5">
            Quản lý sản phẩm còn hết của bạn trong kho
          </div>
        </div>
        <div className="flex pb-1">
          <NavLink
            className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary mr-2.5"
            to={{
              pathname: 'filters',
              search: search
            }}
            state={{
              prevFrom: pathname,
              queryConfig
            }}
          >
            <AdjustmentsVerticalIcon className="w-7" />
          </NavLink>
          <Menu as="div" className="relative mr-2.5">
            <div>
              <Menu.Button className="flex items-center relative h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70">
                Thêm mới
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="z-[1001] absolute rounded px-0 py-2 border-0 w-[250px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/sp'
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn nhập kho
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh'
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn xuất kho
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh'
                      }}
                      className="w-full text-[15px] flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Xuất kho làm nguyên liệu
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh'
                      }}
                      className="w-full text-[15px] flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Xuất chuyển đổi cơ sở
                    </NavLink>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <ReactBaseTable
        pagination
        wrapClassName="grow"
        rowKey="ID"
        columns={columns}
        data={data || []}
        estimatedRowHeight={96}
        emptyRenderer={() =>
          !isLoading && (
            <div className="flex items-center justify-center h-full">
              Không có dữ liệu.
            </div>
          )
        }
        isPreviousData={isPreviousData}
        loading={isLoading || isPreviousData}
        pageCount={data?.data?.pcount}
        pageOffset={Number(queryConfig.Pi)}
        pageSizes={Number(queryConfig.Ps)}
        onChange={({ pageIndex, pageSize }) => {
          navigate({
            pathname: pathname,
            search: createSearchParams(
              pickBy(
                {
                  ...queryConfig,
                  Pi: pageIndex,
                  Ps: pageSize
                },
                identity
              )
            ).toString()
          })
        }}
      />
      <Outlet />
    </div>
  )
}

export default Inventory
