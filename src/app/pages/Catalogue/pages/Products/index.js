import React, { Fragment, useMemo } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { formatString } from 'src/_ezs/utils/formatString'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import {
  NavLink,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { identity, pickBy } from 'lodash-es'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid'
import { ImageLazy } from 'src/_ezs/partials/images'

function Products(props) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    key: queryParams.key || ''
  }
  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListProducts', queryConfig],
    queryFn: () => ProdsAPI.getListProdsProduct(queryConfig),
    keepPreviousData: true
  })

  const deleteProdsIDMutation = useMutation({
    mutationFn: body => ProdsAPI.deleteProdsID(body)
  })

  const onDelete = id => {
    const dataDelete = {
      delete: [id]
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa sản phẩm ?',
      html: `Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteProdsIDMutation.mutateAsync(dataDelete)
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.data?.error) {
          toast.success('Đã xóa sản phẩm')
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }

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
        key: 'DynamicID',
        title: 'Mã sản phẩm',
        dataKey: 'DynamicID',
        width: 130,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên sản phẩm',
        dataKey: 'Title',
        width: 300,
        cellRenderer: ({ rowData }) => <div>{rowData.Title}</div>,
        sortable: false
      },
      {
        key: 'TypeName',
        title: 'Phân loại',
        dataKey: 'TypeName',
        width: 250,
        cellRenderer: ({ rowData }) => <div>{rowData.TypeName}</div>,
        sortable: false
      },
      {
        key: 'PriceProduct',
        title: 'Giá bán',
        dataKey: 'PriceProduct',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceProduct)}</div>
        ),
        sortable: false
      },
      {
        key: 'Action',
        title: 'Lựa chọn',
        dataKey: 'Action',
        width: 100,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <NavLink
              to={{
                pathname: rowData.ID.toString(),
                search: search
              }}
              className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm rounded cursor-pointer p-2 transition"
            >
              <PencilIcon className="w-4" />
            </NavLink>
            <Button
              type="button"
              onClick={() => onDelete(rowData.ID)}
              className="bg-danger hover:bg-dangerhv text-white mx-[2px] text-sm rounded cursor-pointer p-2 transition"
            >
              <TrashIcon className="w-4" />
            </Button>
          </div>
        ),
        sortable: false,
        headerClassNames: 'center',
        frozen: 'right'
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
            Quản lý sản phẩm
          </div>
          <div className="mt-1.5">
            Thêm và quản lý sản phẩm của bạn trong kho
          </div>
        </div>
        <div className="flex pb-1">
          <Button
            type="button"
            className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary mr-2.5"
          >
            <AdjustmentsVerticalIcon className="w-7" />
          </Button>
          <Menu as="div" className="relative mr-2.5">
            <div>
              <Menu.Button className="flex items-center px-3.5 border border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-graydark-700 transition rounded h-12 dark:text-white">
                Tùy chọn
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
              <Menu.Items className="z-[1001] absolute rounded px-0 py-2 border-0 w-[220px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div>
                  {/* <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white">
                      Tải lên Excel
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white">
                      Tải xuống Excel
                    </button>
                  </Menu.Item> */}
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/sp',
                        search: search
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Quản lý danh mục
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item>
                    <NavLink
                      to={{
                        pathname: 'list-category/nh',
                        search: search
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Quản lý nhãn hàng
                    </NavLink>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <NavLink
            to={{
              pathname: 'add',
              search: search
            }}
            className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
          >
            Thêm mới sản phẩm
          </NavLink>
        </div>
      </div>
      <ReactBaseTable
        pagination
        wrapClassName="grow"
        rowKey="ID"
        columns={columns}
        data={data?.data?.list || []}
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
        pageOffset={Number(queryConfig.pi)}
        pageSizes={Number(queryConfig.ps)}
        onChange={({ pageIndex, pageSize }) => {
          navigate({
            pathname: pathname,
            search: createSearchParams(
              pickBy(
                {
                  ...queryConfig,
                  pi: pageIndex,
                  ps: pageSize
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

export default Products
