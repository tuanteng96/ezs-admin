import {
  AdjustmentsVerticalIcon,
  ArrowPathIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useAuth } from 'src/_ezs/core/Auth'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useCatalogue } from '../../CatalogueLayout'
import moment from 'moment'
import { PickerFilter } from './components'
import { Button } from 'src/_ezs/partials/button'
import ExcelHepers from 'src/_ezs/utils/ExcelHepers'

function InventoryStocks(props) {
  const { auth } = useAuth()
  const { openMenu } = useCatalogue()

  const [isExport, setIsExport] = useState(false)
  const [filters, setFilters] = useState({
    _Method_: 'Reports.BaoCaoTonKho_SanPhamCoSo.Danh_sach', // giữ nguyên
    DateStart: '01/01/2000',
    DateEnd: moment().toDate(),
    Pi: 1,
    Ps: 20
  })

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListInventory', filters],
    queryFn: async () => {
      let { data } = await WarehouseAPI.getListInventoryStocks({
        ...filters,
        DateEnd: moment(filters.DateEnd).format('DD/MM/YYYY')
      })
      return {
        data: data?.Lst
          ? data?.Lst.map(x => ({
              ...x,
              ID: x.Prod?.ID
            }))
          : [],
        PCount: data?.PCount || 1,
        Total: data?.Total || 0
      }
    },
    keepPreviousData: true
  })

  const columns = useMemo(
    () => {
      let newColumns = [
        {
          key: 'Prod.ID',
          title: 'ID',
          dataKey: 'Prod.ID',
          width: 100,
          sortable: false
          //align: 'center',
        },
        {
          key: 'Prod.Title',
          title: 'Tên sản phẩm',
          dataKey: 'Prod.Title',
          width: 320,
          cellRenderer: ({ rowData }) => (
            <div>
              <div className="font-semibold">
                {rowData?.OnStocks === '' ? '[Ngừng kinh doanh] ' : ''}{' '}
                {rowData?.Prod?.Title}
              </div>
              <div className="text-sm">{rowData?.Prod?.DynamicID}</div>
            </div>
          ),
          sortable: false
        }
      ]

      if (auth.Stocks && auth.Stocks.length > 0) {
        for (let stock of auth.Stocks) {
          newColumns.push({
            key: stock.ID.toString(),
            title: stock.ID === 778 ? 'Tồn kho' : stock.Title,
            dataKey: stock.ID.toString(),
            width: 250,
            cellRenderer: ({ rowData }) => {
              let Qty = 0
              if (stock.ID === 778) {
                Qty = rowData?.Stocks?.reduce(
                  (total, item) => total + item.Qty,
                  0
                )
              } else {
                let index = rowData?.Stocks?.findIndex(
                  x => x?.Stock?.ID === stock.ID
                )
                if (index > -1) {
                  Qty = rowData?.Stocks[index].Qty
                }
              }

              return <div>{Qty}</div>
            },
            sortable: false
          })
        }
      }
      return newColumns
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onExport = async () => {
    setIsExport(true)

    window?.top?.loading &&
      window?.top?.loading('Đang thực hiện ...', async () => {
        let { data: rs } = await WarehouseAPI.getListInventoryStocks({
          ...filters,
          DateEnd: moment(filters.DateEnd).format('DD/MM/YYYY'),
          Ps: data?.Total,
          Pi: 1
        })
        ExcelHepers.dataToExcel('ton-kho-theo-co-so', (sheet, workbook) => {
          workbook.suspendPaint()
          workbook.suspendEvent()

          let Head = [
            'ID',
            'MÃ',
            'TÊN SẢN PHẨM',
            'CƠ SỞ',
            'SỐ LƯỢNG',
            'MÃ CƠ SỞ',
            'ĐƠN VỊ TÍNH',
            'VÙNG (THÀNH PHỐ)'
          ]

          let Response = [Head]

          for (let item of rs?.Lst || []) {
            Response.push([
              item?.Prod?.ID,
              item?.Prod?.DynamicID,
              item?.Prod?.Title,
              'TẤT CẢ CƠ SỞ',
              item?.Stocks?.reduce((total, item) => total + item.Qty, 0),
              '',
              '',
              ''
            ])
            if (item?.Stocks && item?.Stocks.length > 0) {
              for (let stock of item?.Stocks) {
                let index = auth.Stocks?.findIndex(
                  x => x.ID === stock?.Stock?.ID
                )
                let MA = ''
                let TP = ''
                if (index > -1) {
                  MA = auth.Stocks[index].TitleSEO
                  if (auth.Stocks[index].DescSEO) {
                    let DescSEO = JSON.parse(auth.Stocks[index].DescSEO)
                    if (DescSEO && DescSEO.place && DescSEO.place.length > 0) {
                      TP = DescSEO.place[0].Title
                    }
                  }
                }
                Response.push([
                  item?.Prod?.ID,
                  item?.Prod?.DynamicID,
                  item?.Prod?.Title,
                  stock?.Stock?.Title,
                  stock?.Qty,
                  MA,
                  item?.Prod?.StockUnit,
                  TP
                ])
              }
            }
          }

          let TotalRow = Response.length
          let TotalColumn = Head.length

          sheet.setArray(2, 0, Response)

          //title
          workbook
            .getActiveSheet()
            .getCell(0, 0)
            .value(
              'Tồn kho theo cơ sở đến ngày' +
                ` ${moment(filters.DateEnd).format('DD/MM/YYYY')})`
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
          var hideRowFilter = new window.GC.Spread.Sheets.Filter.HideRowFilter(
            cellrange
          )
          workbook.getActiveSheet().rowFilter(hideRowFilter)

          //format number
          workbook
            .getActiveSheet()
            .getCell(2, 0)
            .hAlign(window.GC.Spread.Sheets.HorizontalAlign.center)

          //auto fit width and height
          workbook.getActiveSheet().autoFitRow(TotalRow + 2)
          workbook.getActiveSheet().autoFitRow(0)

          //   workbook
          //     .getActiveSheet()
          //     .setColumnWidth(
          //       0,
          //       400.0,
          //       window.GC.Spread.Sheets.SheetArea.viewport
          //     )

          for (let i = 1; i < TotalColumn; i++) {
            workbook.getActiveSheet().autoFitColumn(i)
          }

          window.top?.toastr?.remove()
          setIsExport(true)
          //Finish
          workbook.resumePaint()
          workbook.resumeEvent()
        })
      })
  }

  return (
    <div className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-xl font-bold sm:text-3xl dark:text-white">
            Tồn kho theo cơ sở
          </div>
        </div>
        <div className="flex gap-2.5 sm:pb-1">
          <Button
            type="button"
            className="relative flex items-center justify-center h-12 px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70"
            onClick={onExport}
            loading={isExport}
            disabled={isExport}
          >
            Xuất Excel
          </Button>
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-900 border rounded sm:w-12 sm:h-12 bg-light border-light dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
            onClick={refetch}
          >
            <ArrowPathIcon className="w-5 sm:w-6" />
          </button>
          <PickerFilter
            initialValues={filters}
            onChange={val =>
              setFilters(prevState => ({
                ...prevState,
                ...val
              }))
            }
          >
            {({ open }) => (
              <button
                onClick={open}
                type="button"
                className="flex items-center justify-center w-10 h-10 text-gray-900 border rounded sm:w-12 sm:h-12 bg-light border-light dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
              >
                <AdjustmentsVerticalIcon className="w-6 sm:w-7" />
              </button>
            )}
          </PickerFilter>
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
        pageOffset={filters.Pi}
        pageSizes={filters.Ps}
        onChange={({ pageIndex, pageSize }) => {
          setFilters(prevSatte => ({
            ...prevSatte,
            Pi: pageIndex,
            Ps: pageSize
          }))
        }}
      />
      <Outlet />
    </div>
  )
}

export default InventoryStocks
