import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon
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

function ImportExport(props) {
  const { CrStocks, auth } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  const { xuat_nhap_diem } = useRoles(['xuat_nhap_diem', 'xuat_nhap_ten_slg'])

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
    SupplierID: queryParams.SupplierID || ''
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
        '(filter)SupplierID': queryConfig.SupplierID
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

              {auth.User.ID !== 1 &&
                moment().format('DD-MM-YYYY') ===
                  moment(rowData.CreateDate).format('DD-MM-YYYY') && (
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
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70">
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
        rowClassName={({ rowData }) =>
          rowData.Type === 'X' && '!bg-dangerlight'
        }
      />
      <Outlet />
    </div>
  )
}

export default ImportExport
