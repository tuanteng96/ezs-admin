import { FloatingPortal } from '@floating-ui/react'
import { ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Button } from 'src/_ezs/partials/button'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import ExcelHepers from 'src/_ezs/utils/ExcelHepers'

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
            toast.success('Cập nhật thành công.')
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

function PickerInventory({ children, item, StockID, to }) {
  const [visible, setVisible] = useState(false)
  const [byStock, setByStock] = useState(false)

  const [filters, setFilters] = useState({
    cmd: 'getprod',
    Pi: 1,
    Ps: 15,
    '(filter)ProdID': item?.ProdID,
    '(filter)StockID': StockID
  })
  const { GlobalConfig } = useLayout()

  const { pathname } = useLocation()

  const { xuat_nhap_diem } = useRoles(['xuat_nhap_diem'])

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

  let { data: dataStocks } = useQuery(['ListInventoryProdIDByStock', filters], {
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventoryByStock({
        ProdIDs: [item?.ProdID],
        To: moment(to, 'HH:mm DD/MM/YYYY').format('YYYY-MM-DD HH:mm')
      })

      return data.rs && data.rs.length > 0 ? data.rs[0] : null
    },
    enabled: visible && byStock
  })

  const columns = useMemo(
    () => {
      if (byStock) {
        return [
          {
            key: 'StockTitle',
            title: 'Cơ sở',
            dataKey: 'StockTitle',
            width: 400,
            sortable: false
          },
          {
            key: 'Qty',
            title: 'Số lượng',
            dataKey: 'Qty',
            width: 100,
            cellRenderer: ({ rowData }) => <div>{rowData.Qty}</div>,
            sortable: false
          }
        ]
      }
      return [
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
                        window.top.open(
                          `/admin/?mdl=store&act=sell#mp:${rowData.MemberID}/orderid/${rowData.OrderID}`,
                          '_blank'
                        )
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
                      window.top.open(
                        `/admin/?mdl=store&act=sell#mp:${rowData.MemberID}/orderid/${rowData.SourceID}`,
                        '_blank'
                      )
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
                        <div className="mb-px text-sm font-light text-muted2">
                          Tên khách hàng
                        </div>
                        <div className="font-medium">
                          {rowData?.WarehouseOs?.FullName || 'Chưa xác định'}
                        </div>
                      </div>
                      <div className="p-3 border-b last:border-0 border-separator">
                        <div className="mb-px text-sm font-light text-muted2">
                          Số điện thoại
                        </div>
                        <div className="font-medium">
                          {rowData?.WarehouseOs?.Phone || 'Chưa xác định'}
                        </div>
                      </div>
                      <div className="p-3 border-b last:border-0 border-separator">
                        <div className="mb-px text-sm font-light text-muted2">
                          Dịch vụ
                        </div>
                        <div className="font-medium">
                          {rowData?.WarehouseOs?.Title || 'Chưa xác định'}
                        </div>
                      </div>
                      <div className="p-3 border-b last:border-0 border-separator">
                        <div className="mb-px text-sm font-light text-muted2">
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
              {!rowData.Source && (
                <>
                  <div>
                    Đơn nhập xuất
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      to={{
                        pathname:
                          rowData.Type === 'N'
                            ? '/catalogue/import-export/import/' +
                              rowData.ImportID
                            : '/catalogue/import-export/' +
                              (rowData.Target > 0
                                ? 'export-stock/'
                                : 'export/') +
                              rowData.ImportID
                      }}
                      state={{
                        prevFrom: pathname
                      }}
                      className="text-primary pl-1.5 cursor-pointer"
                    >
                      #{rowData.ImportID}
                    </Link>
                  </div>
                  {rowData?.Desc &&
                    rowData?.Desc.includes('Cân kho tự động') && (
                      <div className="text-sm text-danger">{rowData?.Desc}</div>
                    )}
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
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [byStock]
  )

  const onExport = () => {
    if (!dataStocks || !dataStocks.Stocks) return
    window?.top?.loading &&
      window?.top?.loading('Đang thực hiện ...', () => {
        ExcelHepers.dataToExcel(
          'ton-theo-co-so-' + dataStocks?.Prod?.Title,
          (sheet, workbook) => {
            workbook.suspendPaint()
            workbook.suspendEvent()
            let Head = ['CƠ SỞ', 'SỐ LƯỢNG']

            let Response = [Head]

            for (let item of dataStocks?.Stocks || []) {
              let newArray = [item.StockTitle, item.Qty]
              Response.push(newArray)
            }

            let TotalRow = Response.length
            let TotalColumn = Head.length

            sheet.setArray(2, 0, Response)

            //title
            workbook
              .getActiveSheet()
              .getCell(0, 0)
              .value(
                'Tồn theo cơ sở đến ngày (' + dataStocks?.Prod?.Title + ')'
              )
            workbook.getActiveSheet().getCell(0, 0).font('18pt Arial')

            workbook
              .getActiveSheet()
              .getRange(2, 0, 1, TotalColumn)
              .font('12pt Arial')
            workbook
              .getActiveSheet()
              .getRange(2, 0, 1, TotalColumn)
              .backColor('#E7E9EB')
            //border
            var border = new window.GC.Spread.Sheets.LineBorder()
            border.color = '#000'
            border.style = window.GC.Spread.Sheets.LineStyle.thin
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderLeft(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderRight(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderBottom(border)
            workbook
              .getActiveSheet()
              .getRange(2, 0, TotalRow, TotalColumn)
              .borderTop(border)
            //filter
            var cellrange = new window.GC.Spread.Sheets.Range(
              3,
              0,
              1,
              TotalColumn
            )
            var hideRowFilter =
              new window.GC.Spread.Sheets.Filter.HideRowFilter(cellrange)
            workbook.getActiveSheet().rowFilter(hideRowFilter)

            //format number
            workbook
              .getActiveSheet()
              .getCell(2, 0)
              .hAlign(window.GC.Spread.Sheets.HorizontalAlign.center)

            //auto fit width and height
            workbook.getActiveSheet().autoFitRow(TotalRow + 2)
            workbook.getActiveSheet().autoFitRow(0)

            workbook
              .getActiveSheet()
              .setColumnWidth(
                0,
                400.0,
                window.GC.Spread.Sheets.SheetArea.viewport
              )

            for (let i = 1; i < TotalColumn; i++) {
              workbook.getActiveSheet().autoFitColumn(i)
            }

            window.top?.toastr?.remove()

            //Finish
            workbook.resumePaint()
            workbook.resumeEvent()
          }
        )
      })
  }

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
                <div className="flex flex-col w-full h-full">
                  <div className="flex items-center justify-between px-4 py-4 border-b lg:px-6 border-separator dark:border-dark-separator">
                    <div className="w-10/12 text-xl font-bold truncate lg:text-2xl dark:text-graydark-800">
                      {item?.Title}
                    </div>
                    <div className="flex items-center">
                      {xuat_nhap_diem?.hasRight && xuat_nhap_diem?.IsStocks && (
                        <>
                          <div
                            className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                            onClick={() => setByStock(!byStock)}
                          >
                            <ListBulletIcon className="w-7 lg:w-9" />
                          </div>
                          <div className="h-6 bg-gray-300 w-[1px] mx-2.5"></div>
                        </>
                      )}

                      <div
                        className="flex items-center justify-center w-10 h-10 transition cursor-pointer lg:w-12 lg:h-12 dark:text-graydark-800 hover:text-primary"
                        onClick={() => setVisible(false)}
                      >
                        <XMarkIcon className="w-7 lg:w-9" />
                      </div>
                    </div>
                  </div>
                  <ReactBaseTable
                    pagination={!byStock}
                    wrapClassName="grow p-4 lg:p-6"
                    paginationClassName="flex items-center justify-between w-full px-4 pb-4 lg:px-6 lg:pb-6"
                    rowKey="ID"
                    columns={columns}
                    data={byStock ? dataStocks?.Stocks || [] : data?.data || []}
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
                    footerHeight={byStock ? 60 : 0}
                    footerRenderer={() => (
                      <div className="flex justify-end pt-3">
                        <Button
                          type="button"
                          className="relative text-[14px] flex items-center justify-center h-12 px-4 text-white transition rounded shadow-lg w-[110px] bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
                          onClick={onExport}
                        >
                          Xuất Excel
                        </Button>
                      </div>
                    )}
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
