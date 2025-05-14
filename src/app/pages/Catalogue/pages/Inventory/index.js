import {
  AdjustmentsVerticalIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import {
  NavLink,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatString } from 'src/_ezs/utils/formatString'
import { PickerInventory, PickerWarehouseScale } from './components'
import { useAuth } from 'src/_ezs/core/Auth'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { useCatalogue } from '../../CatalogueLayout'
import moment from 'moment'

function Inventory(props) {
  const { CrStocks } = useAuth()
  const { GlobalConfig } = useLayout()
  const { openMenu } = useCatalogue()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const { xuat_nhap_diem } = useRoles(['xuat_nhap_diem'])

  const queryConfig = {
    cmd: 'prodinstock',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 10,
    to: queryParams.to || moment().format('DD/MM/YYYY'),
    Only: queryParams.Only || true,
    RootTypeID: 'RootTypeID' in queryParams ? queryParams.RootTypeID : '794',
    manus: queryParams.manus || '',
    StockID: 'StockID' in queryParams ? queryParams.StockID : CrStocks?.ID,
    Key: queryParams.Key || '',
    NotDelv: queryParams.NotDelv || false,
    IsPublic: queryParams.IsPublic || true
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListInventory', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: queryConfig.cmd,
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        manus: queryConfig.manus,
        to: queryConfig?.to,
        '(filter)Only': queryConfig.Only,
        '(filter)RootTypeID': queryConfig.RootTypeID,
        '(filter)StockID': queryConfig.StockID,
        '(filter)key': queryConfig.Key,
        '(filter)NotDelv': queryConfig.NotDelv,
        '(filter)IsPublic': queryConfig.IsPublic,
      }
      let { data } = await WarehouseAPI.getListInventory(newQueryConfig)
      return {
        data: data?.data?.list || [],
        PCount: data?.data?.PCount || 1
      }
    },
    keepPreviousData: true
  })

  const columns = useMemo(
    () => [
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
        width: 320,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">
              {rowData?.OnStocks === '' ? '[Ngừng kinh doanh] ' : ''}{' '}
              {rowData.Title}
            </div>
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
        sortable: false,
        hidden: GlobalConfig?.Admin?.khong_co_kho
      },
      {
        key: 'PriceBase',
        title: 'Giá nhập / Giá Cost',
        dataKey: 'PriceBase',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceBase)}</div>
        ),
        sortable: false,
        hidden: !xuat_nhap_diem?.hasRight
      },
      {
        key: 'PriceBase*Qty',
        title: 'Giá trị tồn',
        dataKey: 'PriceBase*Qty',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceBase * rowData?.Qty)}</div>
        ),
        sortable: false,
        hidden: !xuat_nhap_diem?.hasRight
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassNames: () => 'justify-center adad',
        width: 80,
        cellRenderer: ({ rowData }) => (
          <PickerInventory item={rowData} StockID={queryConfig.StockID}>
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
    [queryConfig]
  )

  return (
    <div className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-xl font-bold sm:text-3xl dark:text-white">
            Kho & hàng tồn
          </div>
          <div className="mt-1.5 hidden sm:block">
            Quản lý sản phẩm còn hết của bạn trong kho
          </div>
        </div>
        <div className="flex sm:pb-1">
          {queryConfig?.StockID && (
            <PickerWarehouseScale queryConfig={queryConfig}>
              {({ open }) => (
                <button
                  onClick={open}
                  className="flex items-center justify-center h-10 px-4 mr-2 text-white border rounded sm:h-12 bg-success border-success hover hover:bg-successhv"
                >
                  Cân Kho
                </button>
              )}
            </PickerWarehouseScale>
          )}

          <button
            className="flex items-center justify-center w-10 h-10 mr-2 text-gray-900 border rounded sm:w-12 sm:h-12 bg-light border-light dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
            onClick={refetch}
          >
            <ArrowPathIcon className="w-5 sm:w-6" />
          </button>
          <NavLink
            className="flex items-center justify-center w-10 h-10 text-gray-900 border rounded sm:w-12 sm:h-12 bg-light border-light dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
            to={{
              pathname: 'filters',
              search: search
            }}
            state={{
              prevFrom: pathname,
              queryConfig
            }}
          >
            <AdjustmentsVerticalIcon className="w-6 sm:w-7" />
          </NavLink>
          <button
            className="relative flex items-center justify-center w-10 h-10 ml-2 text-white transition rounded shadow-lg sm:w-12 sm:h-12 bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70 xl:hidden"
            onClick={openMenu}
          >
            <Bars3Icon className="w-6 sm:w-7" />
          </button>
        </div>
      </div>
      <ReactBaseTable
        pagination
        wrapClassName="grow"
        rowKey="ID"
        columns={columns}
        data={data?.data || []}
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
        pageCount={data?.PCount}
        pageOffset={Number(queryConfig.Pi)}
        pageSizes={Number(queryConfig.Ps)}
        onChange={({ pageIndex, pageSize }) => {
          navigate({
            pathname: pathname,
            search: createSearchParams({
              ...queryConfig,
              Pi: pageIndex,
              Ps: pageSize
            }).toString()
          })
        }}
        // rowEventHandlers={{
        //   onClick: ({ rowKey, ...a }) => {
        //     console.log(a)
        //   }
        // }}
      />
      <Outlet />
    </div>
  )
}

export default Inventory
