import {
  AdjustmentsVerticalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import React, { useMemo, Fragment } from 'react'
import {
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useAuth } from 'src/_ezs/core/Auth'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { PickerAddEdit } from './components'
import { Button } from 'src/_ezs/partials/button'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'

function Supplier(props) {
  const { CrStocks } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    cmd: 'get',
    Pi: queryParams.Pi || 1,
    Ps: queryParams.Ps || 15,
    StockID: queryParams.StockID || CrStocks?.ID,
    Type: queryParams.Type || 'NCC'
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListSupplier', queryConfig],
    queryFn: async () => {
      let newQueryConfig = {
        cmd: queryConfig.cmd,
        Pi: queryConfig.Pi,
        Ps: queryConfig.Ps,
        '(filter)StockID': queryConfig.StockID,
        '(filter)Type': queryConfig.Type
      }
      let { data } = await ProdsAPI.getListSupplier(newQueryConfig)
      return data?.data?.list || []
    },
    keepPreviousData: true
  })

  const deleteMutation = useMutation({
    mutationFn: body => ProdsAPI.deleteSupplier(body)
  })

  const onDelete = item => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xác nhận xóa ?',
      html: `Bạn chắc chắn muốn thực hiện xóa <b class="text-danger">${item.Title}</b> này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        var bodyFormData = new FormData()
        bodyFormData.append('[ID]', item.ID)
        const data = await deleteMutation.mutateAsync(bodyFormData)
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
        cellRenderer: ({ rowData }) => rowData.ID
      },
      {
        key: 'Title',
        title: 'Tên nhà cung cấp, đại lý',
        dataKey: 'Title',
        width: 300,
        sortable: false
      },
      {
        key: 'Phone',
        title: 'Số điện thoại',
        dataKey: 'Phone',
        width: 180,
        sortable: false
      },
      {
        key: 'Address',
        title: 'Địa chỉ',
        dataKey: 'Address',
        width: 500,
        cellRenderer: ({ rowData }) => rowData.SourceTitle,
        sortable: false
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassNames: () => 'justify-center',
        width: 120,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <PickerAddEdit data={rowData}>
              {({ open }) => (
                <button
                  onClick={open}
                  type="button"
                  className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded"
                >
                  <PencilIcon className="w-4" />
                </button>
              )}
            </PickerAddEdit>
            <button
              type="button"
              className="bg-danger hover:bg-dangerhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded"
              onClick={() => onDelete(rowData)}
            >
              <TrashIcon className="w-4" />
            </button>
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
            Nhà cung cấp, đại lý
          </div>
          <div className="mt-1.5">Quản lý tất cả các nhà cung cấp, đại lý</div>
        </div>
        <div className="flex pb-1">
          <Menu as="div" className="relative mr-2.5">
            <div>
              <Menu.Button className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary">
                <AdjustmentsVerticalIcon className="w-7" />
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
                    <div
                      className={clsx(
                        'w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white',
                        queryConfig.Type === 'NCC' &&
                          'text-primary bg-[#F4F6FA]'
                      )}
                      onClick={() =>
                        navigate({
                          pathname: pathname,
                          search: createSearchParams(
                            pickBy(
                              {
                                ...queryConfig,
                                Type: 'NCC'
                              },
                              identity
                            )
                          ).toString()
                        })
                      }
                    >
                      Nhà cung cấp
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={clsx(
                        'w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white',
                        queryConfig.Type === 'DAI_LY' &&
                          'text-primary bg-[#F4F6FA]'
                      )}
                      onClick={() =>
                        navigate({
                          pathname: pathname,
                          search: createSearchParams(
                            pickBy(
                              {
                                ...queryConfig,
                                Type: 'DAI_LY'
                              },
                              identity
                            )
                          ).toString()
                        })
                      }
                    >
                      Đại lý
                    </div>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <PickerAddEdit>
            {({ open }) => (
              <Button
                onClick={open}
                type="button"
                className="flex items-center relative h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
              >
                Thêm mới
              </Button>
            )}
          </PickerAddEdit>
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

export default Supplier
