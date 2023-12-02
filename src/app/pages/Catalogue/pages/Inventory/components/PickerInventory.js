import { FloatingPortal } from '@floating-ui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Button } from 'src/_ezs/partials/button'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { ReactBaseTable } from 'src/_ezs/partials/table'

const ButtonAction = ({ item }) => {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: body => WarehouseAPI.getListInventory(body)
  })

  const onSubmit = () => {
    let values = {
      cmd: 'delivery',
      stockid: item?.ID
    }
    updateMutation.mutate(values, {
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ['ListInventoryProdID'] })
          .then(() => {
            toast.success('Cập nhập thành công.')
          })
      }
    })
  }

  if (!item?.NotDelivery && !item?.IsPending)
    return <div className="text-success">Hoàn thành</div>

  return (
    <Button
      onClick={onSubmit}
      type="button"
      hideText={updateMutation.isLoading}
      loading={updateMutation.isLoading}
      className={clsx(
        'relative flex items-center px-4 text-white transition rounded shadow-lg h-10 focus:outline-none focus:shadow-none text-sm',
        item.Qty > 0
          ? 'bg-success hover:bg-successhv'
          : 'bg-danger hover:bg-dangerhv'
      )}
    >
      {item.Qty > 0 ? 'Nhập' : 'Xuất'}
    </Button>
  )
}

function PickerInventory({ children, item, StockID }) {
  const [visible, setVisible] = useState(false)
  const [filters, setFilters] = useState({
    cmd: 'getprod',
    Pi: 1,
    Ps: 15,
    '(filter)ProdID': item?.ProdID,
    '(filter)StockID': StockID
  })
  const { GlobalConfig } = useLayout()

  const { pathname } = useLocation()

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListInventoryProdID', filters],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventory(filters)
      return {
        data: data?.data?.list || [],
        PCount: data?.data?.PCount || 1
      }
    },
    keepPreviousData: true,
    enabled: visible
  })

  const columns = useMemo(
    () => [
      {
        key: 'StockName',
        title: 'Kho',
        dataKey: 'StockName',
        width: 220,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Thời gian',
        dataKey: 'Title',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY')}</div>
        ),
        sortable: false
      },
      {
        key: 'OrderID',
        title: 'Nguồn',
        dataKey: 'OrderID',
        width: 230,
        cellRenderer: ({ rowData }) => (
          <div>
            {rowData.OrderID > 0 &&
              rowData.Source !== 'AfterReturn' &&
              rowData.Source !== 'ServiceItem' && (
                <>
                  Đơn hàng
                  <span
                    className="text-primary pl-1.5 cursor-pointer"
                    onClick={() =>
                      (window.top.location.href = `/admin/?mdl=store&act=sell#mp:${rowData.MemberID}/orderid/${rowData.OrderID}`)
                    }
                  >
                    #{rowData.SourceID}
                  </span>
                </>
              )}
            {rowData.Source === 'AfterReturn' && (
              <>
                Đơn trả hàng
                <span
                  className="text-primary pl-1.5 cursor-pointer"
                  onClick={() =>
                    (window.top.location.href = `/admin/?mdl=store&act=sell#mp:${rowData.MemberID}/orderid/${rowData.SourceID}`)
                  }
                >
                  #{rowData.SourceID}
                </span>
              </>
            )}
            {rowData.Source === 'ServiceItem' && (
              <>
                Định mức dịch vụ
                <DropdownMenu
                  zIndex={10009}
                  trigger={
                    <span className="text-primary pl-1.5 cursor-pointer">
                      #{rowData.SourceID}
                    </span>
                  }
                  className="fixed rounded px-0 py-2 border-0 min-w-[250px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow"
                >
                  <div>
                    <div className="p-3 border-b last:border-0 border-separator">
                      <div className="text-sm text-muted2 font-light mb-px">
                        Tên khách hàng
                      </div>
                      <div className="font-medium">
                        {rowData?.WarehouseOs?.FullName || 'Chưa xác định'}
                      </div>
                    </div>
                    <div className="p-3 border-b last:border-0 border-separator">
                      <div className="text-sm text-muted2 font-light mb-px">
                        Số điện thoại
                      </div>
                      <div className="font-medium">
                        {rowData?.WarehouseOs?.Phone || 'Chưa xác định'}
                      </div>
                    </div>
                    <div className="p-3 border-b last:border-0 border-separator">
                      <div className="text-sm text-muted2 font-light mb-px">
                        Dịch vụ
                      </div>
                      <div className="font-medium">
                        {rowData?.WarehouseOs?.Title || 'Chưa xác định'}
                      </div>
                    </div>
                    <div className="p-3 border-b last:border-0 border-separator">
                      <div className="text-sm text-muted2 font-light mb-px">
                        Ngày thực hiện
                      </div>
                      <div className="font-medium">
                        {rowData?.WarehouseOs?.UseDate
                          ? moment(rowData?.WarehouseOs?.UseDate).format(
                              'HH:mm DD-MM-YYYY'
                            )
                          : 'Chưa xác định'}
                      </div>
                    </div>
                  </div>
                </DropdownMenu>
              </>
            )}
            {!rowData.Source && !rowData.Source && (
              <>
                Đơn nhập xuất
                <Link
                  to={{
                    pathname:
                      rowData.Type === 'N'
                        ? '/catalogue/import-export/import/' + rowData.ImportID
                        : '/catalogue/import-export/' +
                          (rowData.Target > 0 ? 'export-stock/' : 'export/') +
                          rowData.ImportID
                  }}
                  state={{
                    prevFrom: pathname
                  }}
                  className="text-primary pl-1.5 cursor-pointer"
                >
                  #{rowData.ImportID}
                </Link>
              </>
            )}
          </div>
        ),
        sortable: false
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        dataKey: 'Qty',
        width: 100,
        cellRenderer: ({ rowData }) => <div>{rowData.Qty}</div>,
        sortable: false
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassName: () => 'justify-center',
        className: 'justify-center',
        width: 120,
        cellRenderer: ({ rowData }) => <ButtonAction item={rowData} />,
        sortable: false,
        frozen: 'right',
        hidden: GlobalConfig?.Admin?.khong_co_kho
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      <AnimatePresence>
        <FloatingPortal root={document.body}>
          {visible && (
            <div className="fixed inset-0 flex items-center justify-center z-[1010]">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
                onClick={() => setVisible(false)}
              ></m.div>
              <m.div
                className="absolute top-0 right-0 z-10 flex w-full h-full max-w-4xl bg-white dark:bg-dark-aside"
                initial={{ x: '100%' }}
                transition={{
                  transform: { ease: 'linear' }
                }}
                animate={{ x: '0' }}
              >
                <div className="flex flex-col h-full w-full">
                  <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-separator dark:border-dark-separator">
                    <div className="text-xl lg:text-2xl font-bold dark:text-graydark-800 truncate w-10/12">
                      {item?.Title}
                    </div>
                    <div
                      className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                      onClick={() => setVisible(false)}
                    >
                      <XMarkIcon className="w-7 lg:w-9" />
                    </div>
                  </div>
                  <ReactBaseTable
                    pagination
                    wrapClassName="grow p-4 lg:p-6"
                    paginationClassName="flex items-center justify-between w-full px-4 pb-4 lg:px-6 lg:pb-6"
                    rowKey="ID"
                    columns={columns}
                    data={data?.data || []}
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
                    pageCount={data?.PCount}
                    pageOffset={Number(filters.Pi)}
                    pageSizes={Number(filters.Ps)}
                    onChange={({ pageIndex, pageSize }) => {
                      setFilters(prevState => ({
                        ...prevState,
                        Pi: pageIndex,
                        Ps: pageSize
                      }))
                    }}
                  />
                </div>
              </m.div>
            </div>
          )}
        </FloatingPortal>
      </AnimatePresence>
    </>
  )
}

export default PickerInventory
