import {
  AdjustmentsVerticalIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavLink, createSearchParams } from 'react-router-dom'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useAuth } from 'src/_ezs/core/Auth'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'

function IeProcessed(props) {
  const { CrStocks } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    cmd: 'getie',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 15,
    StockID: 'StockID' in queryParams ? queryParams.StockID : CrStocks?.ID,
    Type: queryParams.Type || '',
    FromID: queryParams.UserID || '',
    Receive: queryParams.Receive || '1',
    Key: queryParams.Key || '',
    TargetCreated: queryParams.TargetCreated || '0'
  }

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListIEProcessed', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: 'getie',
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        '(filter)StockID': queryConfig.StockID,
        '(filter)Type': queryConfig.Type || 'N,X',
        '(filter)Receive': queryConfig.Receive,
        '(filter)TargetCreated': queryConfig.TargetCreated,
        '(filter)FromID': queryConfig.FromID
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
        width: 180,
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        sortable: false
      },
      {
        key: 'SourceTitle',
        title: 'Từ cơ sở',
        dataKey: 'SourceTitle',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.SourceTitle,
        sortable: false
      },
      {
        key: 'TargetTitle',
        title: 'Đến cơ sở',
        dataKey: 'TargetTitle',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.TargetTitle,
        sortable: false
      },
      {
        key: 'Summary',
        title: 'Số lượng',
        dataKey: 'Summary',
        width: 200,
        cellRenderer: ({ rowData }) => rowData.Summary,
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
        key: 'ToPay',
        title: 'Tổng giá trị',
        dataKey: 'ToPay',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.ToPay)}</div>
        ),
        sortable: false
      },
      {
        key: 'Payed',
        title: 'Đã thanh toán',
        dataKey: 'Payed',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVNDPositive(rowData?.Payed)}</div>
        ),
        sortable: false
      },
      {
        key: 'ToPay-Payed',
        title: 'Còn lại',
        dataKey: 'ToPay-Payed',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>
            {formatString.formatVND(rowData?.ToPay - Math.abs(rowData?.Payed))}
          </div>
        ),
        sortable: false
      },
      {
        key: 'Other',
        title: 'Ghi chú',
        dataKey: 'Other',
        width: 200,
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
            <NavLink
              to={{
                pathname: 'import/' + rowData.ID,
                search: search
              }}
              state={{
                prevFrom: pathname,
                queryConfig
              }}
              className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded-full"
            >
              <ArrowRightIcon className="w-5" />
            </NavLink>
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
            Đơn cần xử lý
          </div>
          <div className="mt-1.5">Quản lý tất cả các đơn cần xử lý</div>
        </div>
        <div className="flex pb-1">
          <NavLink
            className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
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

export default IeProcessed
