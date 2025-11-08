import React, { useMemo } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { toast } from 'react-toastify'
import {
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { PickerAddEdit } from './components'
import Swal from 'sweetalert2'

function PointVoucher(props) {
  const { CrStocks } = useAuth()

  const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['ListSettingsPointVoucher'],
    queryFn: async ({ pageParam = 1 }) => {
      let { data } = await SettingsAPI.getPointVoucher({
        Pi: pageParam,
        Ps: 20
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1,
    keepPreviousData: true
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'items')

  const deleteMutation = useMutation({
    mutationFn: body => SettingsAPI.deletePointVoucher(body)
  })

  const onDelete = id => {
    const dataPost = {
      delete: [id]
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa giải thưởng này ?',
      html: `Bạn có chắc chắn muốn xóa giải thưởng này? Hành động này không thể được hoàn tác.`,
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
          toast.success('Đã xóa.')
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
        title: 'STT',
        dataKey: 'ID',
        width: 60,
        sortable: false,
        align: 'center',
        cellRenderer: ({ rowIndex }) => rowIndex + 1
      },
      {
        key: 'Title',
        title: 'Tên giải thưởng',
        dataKey: 'Title',
        width: 280,
        sortable: false
      },
      {
        key: 'Desc',
        title: 'Mô tả',
        dataKey: 'Desc',
        width: 400,
        sortable: false
      },
      {
        key: 'Point',
        title: 'Điểm quy đổi',
        dataKey: 'Point',
        width: 200,
        sortable: false
      },
      {
        key: 'IsPublic',
        title: 'Trạng thái',
        dataKey: 'IsPublic',
        cellRenderer: ({ rowData }) => (
          <>
            {rowData.IsPublic ? (
              <span className="text-success">Hoạt động</span>
            ) : (
              <span className="text-danger">Ẩn</span>
            )}
          </>
        ),
        width: 160,
        sortable: false
      },
      {
        key: 'Action',
        title: 'Lựa chọn',
        dataKey: 'Action',
        width: 120,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full gap-2">
            <PickerAddEdit data={rowData}>
              {({ open }) => (
                <Button
                  onClick={open}
                  type="button"
                  className="p-2 text-sm text-white transition rounded cursor-pointer bg-primary hover:bg-primaryhv"
                >
                  <PencilIcon className="w-4" />
                </Button>
              )}
            </PickerAddEdit>
            <Button
              type="button"
              onClick={() => onDelete(rowData.ID)}
              className="p-2 text-sm text-white transition rounded cursor-pointer bg-danger hover:bg-dangerhv"
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
    <div className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl">
      <div className="flex items-center justify-between mb-5">
        <div
          onClick={() => {
            window.top.location.href = '/admin/?mdl25=memberconfig'
          }}
          className="flex items-center cursor-pointer"
        >
          <div className="w-10">
            <ChevronLeftIcon className="w-8" />
          </div>
          <div className="text-xl font-bold sm:text-3xl dark:text-white">
            Cài đặt đổi thưởng
          </div>
        </div>
        <PickerAddEdit>
          {({ open }) => (
            <Button
              onClick={open}
              type="button"
              className="relative flex items-center h-12 px-4 mr-2 font-medium text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Thêm mới
            </Button>
          )}
        </PickerAddEdit>
      </div>
      <ReactBaseTable
        wrapClassName="grow"
        rowKey="ID"
        columns={columns || []}
        data={Lists || []}
        rowHeight={70}
        emptyRenderer={() =>
          !isLoading && (
            <div className="flex items-center justify-center h-full">
              Không có dữ liệu
            </div>
          )
        }
        onEndReachedThreshold={1}
        onEndReached={fetchNextPage}
        loading={isLoading}
      />
    </div>
  )
}

export default PointVoucher
