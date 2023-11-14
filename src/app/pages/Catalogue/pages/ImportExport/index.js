import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import { Fragment } from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavLink, createSearchParams } from 'react-router-dom'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useAuth } from 'src/_ezs/core/Auth'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'

function ImportExport(props) {
  const { CrStocks } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    cmd: 'getie',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 15,
    StockID: queryParams.StockID || CrStocks?.ID,
    Private: queryParams.Private || true,
    Type: queryParams.Type || 'N,X',
    PayStatus: queryParams.PayStatus || '0',
    UserID: queryParams.UserID || '',
    ReceiverID: queryParams.ReceiverID || ''
  }

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListInventory', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: 'getie',
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        '(filter)StockID': queryConfig.StockID,
        '(filter)Private': queryConfig.Private,
        '(filter)Type': queryConfig.Type,
        '(filter)PayStatus': queryConfig.PayStatus,
        '(filter)UserID': queryConfig.UserID,
        '(filter)ReceiverID': queryConfig.ReceiverID
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
        title: 'Mã',
        dataKey: 'ID',
        width: 180,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="font-semibold">{rowData.Code}</div>
            <div className="text-xs bg-warning text-white inline-block px-1.5 py-px rounded">
              #{rowData.ID}
            </div>
          </div>
        )
      },
      {
        key: 'CreateDate',
        title: 'Ngày',
        dataKey: 'CreateDate',
        width: 200,
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        sortable: false
      },
      {
        key: 'Type',
        title: 'Loại',
        dataKey: 'Type',
        width: 135,
        cellRenderer: ({ rowData }) =>
          rowData.Type === 'N' ? 'Đơn Nhập' : 'Đơn Xuất',
        sortable: false
      },
      {
        key: 'SourceTitle',
        title: 'Cơ sở',
        dataKey: 'SourceTitle',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.SourceTitle,
        sortable: false
      },
      {
        key: 'SupplierText',
        title: 'Nhà cung cấp',
        dataKey: 'SupplierText',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.SupplierText,
        sortable: false
      },
      {
        key: 'PriceBase',
        title: 'Nhân viên thực hiện',
        dataKey: 'PriceBase',
        width: 200,
        cellRenderer: ({ rowData }) => rowData?.UserName,
        sortable: false
      },
      {
        key: 'Total',
        title: 'Tổng giá trị',
        dataKey: 'Total',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.Total)}</div>
        ),
        sortable: false
      },
      {
        key: 'ToPay',
        title: 'Đã thanh toán',
        dataKey: 'ToPay',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.ToPay)}</div>
        ),
        sortable: false
      },
      {
        key: 'Total-ToPay',
        title: 'Còn lại',
        dataKey: 'Total-ToPay',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.Total - rowData?.ToPay)}</div>
        ),
        sortable: false
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassNames: () => 'justify-center',
        width: 80,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded-full"
                >
                  <ArrowRightIcon className="w-5" />
                </button>
              }
            >
              <div>
                <NavLink
                  to={{
                    pathname: 'list-category/sp'
                  }}
                  className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                >
                  Xem chi tiết
                </NavLink>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                >
                  In đơn
                </button>
              </div>
              <div>
                <NavLink
                  to={{
                    pathname: 'list-category/sp'
                  }}
                  className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                >
                  Thanh toán
                </NavLink>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                  onClick={() => console.log('Delete')}
                >
                  Xóa đơn
                </button>
              </div>
            </DropdownMenu>
          </div>
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
            Đơn nhập xuất
          </div>
          <div className="mt-1.5">Quản lý tất cả các đơn nhập - xuất</div>
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
              <Menu.Items className="z-[1001] absolute rounded px-0 py-2 border-0 w-[180px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/sp'
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn nhập
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh'
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn xuất
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh'
                      }}
                      className="w-full text-[15px] flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Nhận đơn
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
              Không có dữ liệu
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
        rowClassName={({ rowData }) =>
          rowData.Type === 'X' && '!bg-danger !text-white'
        }
      />
      <Outlet />
    </div>
  )
}

export default ImportExport
