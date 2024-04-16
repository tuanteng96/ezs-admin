import {
  AdjustmentsVerticalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { identity, pickBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavLink, createSearchParams } from 'react-router-dom'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { Button } from 'src/_ezs/partials/button'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
// import { IsPublicComponent, OrderComponent } from './components'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import PostsAPI from 'src/_ezs/api/posts.api'
import { IsPublicComponent, OrderComponent } from './components'

function Lists() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    key: queryParams?.key || '',
    cateid: queryParams?.cateid || '',
    byOrder: true
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListPosts', queryConfig],
    queryFn: () =>
      PostsAPI.list({
        pi: queryConfig.pi,
        ps: queryConfig.ps,
        filter: {
          byOrder: true,
          cateid: queryConfig.cateid,
          key: queryConfig.key
        }
      }),
    keepPreviousData: true
  })

  const deleteMutation = useMutation({
    mutationFn: body => PostsAPI.delete(body)
  })

  const onDelete = id => {
    const dataPost = {
      delete: [id]
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa bài viết ?',
      html: `Bạn có chắc chắn muốn xóa vài viết này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện xóa',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteMutation.mutateAsync(dataPost)
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.data?.error) {
          toast.success('Đã xóa .')
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
        key: 'CateTitle',
        title: 'Danh mục',
        dataKey: 'CateTitle',
        width: 250,
        sortable: false,
        cellRenderer: ({ rowData }) => rowData?.CateTitle
      },
      {
        key: 'Title',
        title: 'Tiêu đề',
        dataKey: 'Title',
        width: 345,
        sortable: false,
        cellRenderer: ({ rowData }) => rowData?.Title
      },
      {
        key: 'Thumbnail',
        title: 'Ảnh đại diện',
        dataKey: 'Thumbnail',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <div className="border border-separator">
              {rowData?.Thumbnail ? (
                <ImageLazy
                  wrapperClassName="object-cover w-20 h-20 !block"
                  className="object-contain w-20 h-20"
                  effect="blur"
                  src={toAbsolutePath(rowData?.Thumbnail)}
                  alt={rowData.Title}
                />
              ) : (
                <svg
                  className="w-20 h-20"
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
        width: 120,
        sortable: false
      },
      {
        key: 'Order',
        title: 'Thứ tự',
        dataKey: 'Order',
        cellRenderer: props => <OrderComponent {...props} />,
        width: 120,
        sortable: false
      },
      {
        key: 'IsPublic',
        title: 'Hiển thị Web/APP',
        dataKey: 'IsPublic',
        cellRenderer: props => <IsPublicComponent {...props} />,
        width: 160,
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
              state={{
                formState: rowData
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
    <div className="h-full bg-white dark:bg-dark-app relative">
      <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Bài viết & Blogs
            </div>
            <div className="mt-1.5">
              Thêm mới và quản lý các bài viết & Blogs
            </div>
          </div>
          <div className="flex pb-1">
            <NavLink
              to={{
                pathname: 'filter',
                search: search
              }}
              className="flex items-center justify-center text-gray-900 bg-light border rounded border-light h-12 w-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary mr-2.5"
            >
              <AdjustmentsVerticalIcon className="w-7" />
            </NavLink>
            <NavLink
              to={{
                pathname: 'categories',
                search: search
              }}
              className="flex items-center px-3.5 border border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-graydark-700 transition rounded h-12 bg-white mr-2.5 font-semibold"
            >
              Quản lý danh mục
            </NavLink>
            <NavLink
              to={{
                pathname: 'add',
                search: search
              }}
              className="relative flex items-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Thêm mới
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
          pageCount={data?.data?.pCount}
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
      </div>
      <Outlet />
    </div>
  )
}

export default Lists
