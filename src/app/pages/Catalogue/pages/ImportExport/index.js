import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  Bars3Icon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import { Fragment } from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavLink, createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import WarehouseAPI from 'src/_ezs/api/warehouse.api'
import { useAuth } from 'src/_ezs/core/Auth'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'
import Swal from 'sweetalert2'
import { useCatalogue } from '../../CatalogueLayout'
import clsx from 'clsx'
import ExcelHepers from 'src/_ezs/utils/ExcelHepers'

function ImportExport(props) {
  const { CrStocks, auth } = useAuth()
  const { openMenu } = useCatalogue()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  const { xuat_nhap_diem, adminTools_byStock } = useRoles([
    'xuat_nhap_diem',
    'adminTools_byStock'
  ])

  const queryConfig = {
    cmd: 'getie',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 15,
    StockID: 'StockID' in queryParams ? queryParams.StockID : CrStocks?.ID,
    Private: queryParams.Private || 0,
    Type: queryParams.Type || '',
    PayStatus: queryParams.PayStatus || '',
    UserID: queryParams.UserID || '',
    ReceiverID: queryParams.ReceiverID || '',
    Key: queryParams.Key || '',
    SupplierID: queryParams.SupplierID || '',
    ProdID: queryParams.ProdID
      ? {
          value: queryParams.ProdID || '',
          label: queryParams.ProdTitle || ''
        }
      : '',
    From: queryParams.From
      ? moment(queryParams.From, 'YYYY-MM-DD').toDate()
      : '',
    To: queryParams.To ? moment(queryParams.To, 'YYYY-MM-DD').toDate() : ''
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListImportExport', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: 'getie',
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        '(filter)key': queryConfig.Key,
        '(filter)StockID': queryConfig.StockID,
        '(filter)Private': queryConfig.Private,
        '(filter)Type': queryConfig.Type || 'N,X',
        '(filter)PayStatus': queryConfig.PayStatus || '0',
        '(filter)UserID': queryConfig.UserID,
        '(filter)ReceiverID': queryConfig.ReceiverID,
        '(filter)SupplierID': queryConfig.SupplierID,
        ProdID: queryConfig.ProdID ? queryConfig.ProdID.value : '',
        From: queryConfig.From
          ? moment(queryConfig.From).format('YYYY-MM-DD')
          : '',
        To: queryConfig.To ? moment(queryConfig.To).format('YYYY-MM-DD') : ''
      }
      let { data } = await WarehouseAPI.getListInventory(newQueryConfig)
      return {
        data: data?.data?.list || [],
        PCount: data?.data?.PCount || 1
      }
    },
    keepPreviousData: true
  })

  const deleteMutation = useMutation({
    mutationFn: body => WarehouseAPI.deleteImportExport(body)
  })

  const onDelete = item => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xác nhận xóa ?',
      html: `Bạn chắc chắn muốn thực hiện xóa <b class="text-danger">${item.Code}</b> này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteMutation.mutateAsync({
          cmd: 'delete_ie',
          id: item.ID
        })
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        toast.success('Xóa thành công.')
      }
    })
  }

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
            <div
              className={clsx(
                'font-semibold',
                rowData.Type === 'X' ? 'text-danger' : 'text-success'
              )}
            >
              {rowData.Code}
            </div>
            <div className="text-xs bg-warning text-white inline-block px-1.5 py-px rounded">
              #{rowData.ID}
            </div>
          </div>
        ),
        frozen: window.top.innerWidth > 993 ? 'left' : false
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
        key: 'ToPay',
        title: 'Tổng giá trị',
        dataKey: 'ToPay',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.ToPay)}</div>
        ),
        sortable: false,
        hidden: !xuat_nhap_diem.hasRight
      },
      {
        key: 'Payed',
        title: 'Đã thanh toán',
        dataKey: 'Payed',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVNDPositive(rowData?.Payed)}</div>
        ),
        sortable: false,
        hidden: !xuat_nhap_diem.hasRight
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
        sortable: false,
        hidden: !xuat_nhap_diem.hasRight
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
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded-full"
                >
                  <EllipsisHorizontalIcon className="w-5" />
                </button>
              }
            >
              <div>
                <NavLink
                  to={{
                    pathname:
                      rowData.Type === 'N'
                        ? 'import/' + rowData.ID
                        : (rowData.Target > 0 ? 'export-stock/' : 'export/') +
                          rowData.ID,
                    search: search
                  }}
                  state={{
                    prevFrom: pathname,
                    queryConfig
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
                  onClick={() => {
                    window.top.open(
                      `/services/printHelder.aspx?importexportid=${rowData.ID}&importexportMode=1`,
                      '_blank',
                      'width=600px; height=' + window.innerHeight + 'px'
                    ).onload = function () {
                      var loc = this.document.location.href
                      if (loc.indexOf('printHelder.aspx') === -1) this.print()
                    }
                  }}
                >
                  In đơn
                </button>
              </div>
              {xuat_nhap_diem.hasRight && (
                <div>
                  <NavLink
                    to={{
                      pathname: 'topay/' + rowData.ID,
                      search: search
                    }}
                    state={{
                      prevFrom: pathname,
                      queryConfig
                    }}
                    className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                  >
                    Thanh toán
                  </NavLink>
                </div>
              )}
              {adminTools_byStock?.hasRight && (
                <div>
                  <NavLink
                    to={{
                      pathname: 'change-date/' + rowData.ID,
                      search: search
                    }}
                    state={{
                      prevFrom: pathname,
                      queryConfig
                    }}
                    className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                  >
                    Đổi ngày
                  </NavLink>
                </div>
              )}
              {(adminTools_byStock?.hasRight ||
                (!adminTools_byStock?.hasRight &&
                  moment().format('DD-MM-YYYY') ===
                    moment(rowData.CreateDate).format('DD-MM-YYYY'))) && (
                <div>
                  <button
                    type="button"
                    className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light font-inter transition cursor-pointer dark:text-white text-danger"
                    onClick={() => onDelete(rowData)}
                  >
                    Xóa đơn
                  </button>
                </div>
              )}
            </DropdownMenu>
          </div>
        ),
        sortable: false,
        frozen: 'right',
        align: 'center'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, auth]
  )

  const onExport = () => {
    if (!data.data) return

    window?.top?.loading &&
      window?.top?.loading('Đang thực hiện ...', () => {
        ExcelHepers.dataToExcel(
          'don-nhap-xuat-' + moment().format('DD-MM-YYYY[-]HH-mm-ss'),
          (sheet, workbook) => {
            workbook.suspendPaint()
            workbook.suspendEvent()
            let Head = [
              'ID',
              'MÃ ĐƠN',
              'NGÀY',
              'TỔNG GIÁ TRỊ',
              'ĐÃ THANH TOÁN',
              'CÒN LẠI',
              'LOẠI',
              'CƠ SỞ',
              'NHÀ CUNG CẤP',
              'NHÂN VIÊN THỰC HIỆN',
              'GHI CHÚ',
              'TÊN SẢN PHẨM',
              'MÃ SẢN PHẨM',
              'ĐƠN VỊ',
              'SỐ LƯỢNG'
            ]

            if (!xuat_nhap_diem.hasRight) {
              Head.splice(3, 3)
            }

            let Response = [Head]
            let newRows = []

            var indexStart = 3

            for (let [index, item] of data.data.entries()) {
              indexStart =
                index > 0
                  ? data.data[index - 1].Items.length + indexStart
                  : indexStart
              for (let [i, prod] of item.Items.entries()) {
                let newArray = [
                  item.ID,
                  item.Code,
                  moment(item.CreateDate).format('HH:mm DD-MM-YYYY'),
                  item.ToPay,
                  item.Payed,
                  item?.ToPay - Math.abs(item?.Payed),
                  item.Type === 'N' ? 'Đơn Nhập' : 'Đơn Xuất',
                  item.SourceTitle,
                  item.SupplierText,
                  item?.UserName,
                  item.Other,
                  prod.ProdTitle,
                  prod.ProdCode,
                  prod.Unit,
                  prod.Qty
                ]
                if (!xuat_nhap_diem.hasRight) {
                  newArray.splice(3, 3)
                }
                Response.push(newArray)
                if (i === 0 && item.Items.length > 0) {
                  const rowObj = {
                    row: indexStart,
                    rowCount: item.Items && item.Items.length
                  }
                  newRows.push(rowObj)
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
              .value('Danh sách đơn nhập xuất')
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
            for (let i = 1; i < TotalColumn; i++) {
              workbook.getActiveSheet().autoFitColumn(i)
            }

            for (const x of newRows) {
              for (let i = 0; i <= (xuat_nhap_diem.hasRight ? 10 : 7); i++) {
                //i là vị trí cột
                workbook
                  .getActiveSheet()
                  .addSpan(
                    x.row,
                    i,
                    x.rowCount,
                    1,
                    window.GC.Spread.Sheets.SheetArea.viewport
                  )
                workbook
                  .getActiveSheet()
                  .getCell(x.row, i)
                  .vAlign(window.GC.Spread.Sheets.VerticalAlign.center)
              }
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
    <div className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-xl font-bold sm:text-3xl dark:text-white">
            Đơn nhập xuất
          </div>
          <div className="mt-1.5 hidden sm:block">
            Quản lý tất cả các đơn nhập - xuất
          </div>
        </div>
        <div className="flex sm:pb-1">
          <NavLink
            className="flex items-center justify-center text-gray-900 bg-light border rounded border-light w-10 h-10 sm:h-12 sm:w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary mr-1 sm:mr-2.5"
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
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="relative flex items-center justify-center w-10 h-10 text-white transition rounded shadow-lg sm:w-12 sm:h-12 md:w-auto md:px-4 bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70">
                <span className="hidden md:block">Thêm mới</span>
                <PlusIcon className="w-6 sm:w-7 md:hidden" />
                <ChevronDownIcon
                  className="hidden w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100 md:block"
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
              <Menu.Items className="z-[1001] absolute right-0 rounded px-0 py-2 border-0 w-[225px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'import',
                        search: search
                      }}
                      state={{
                        prevFrom: pathname,
                        queryConfig
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn nhập kho
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'export',
                        search: search
                      }}
                      state={{
                        prevFrom: pathname,
                        queryConfig
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Đơn xuất kho
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'material-conversion',
                        search: search
                      }}
                      state={{
                        prevFrom: pathname
                      }}
                      className="w-full text-[15px] flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Xuất kho làm nguyên liệu
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'export-stock',
                        search: search
                      }}
                      state={{
                        prevFrom: pathname,
                        queryConfig
                      }}
                      className="w-full text-[15px] flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Xuất chuyển đổi cơ sở
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className="w-full text-[15px] text-danger flex flex-col px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-danger font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      onClick={onExport}
                    >
                      Xuất Excel
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <button
            className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70 ml-1 sm:ml-2.5 xl:hidden"
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
            search: createSearchParams(
              pickBy(
                {
                  ...queryConfig,
                  Pi: pageIndex,
                  Ps: pageSize,
                  From: queryConfig.From
                    ? moment(queryConfig.From).format('YYYY-MM-DD')
                    : '',
                  To: queryConfig.To
                    ? moment(queryConfig.To).format('YYYY-MM-DD')
                    : ''
                },
                identity
              )
            ).toString()
          })
        }}
        // rowClassName={({ rowData }) =>
        //   rowData.Type === 'X' && '!bg-dangerlight'
        // }
      />
      <Outlet />
    </div>
  )
}

export default ImportExport
