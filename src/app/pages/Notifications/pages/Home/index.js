import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import NotificationsAPI from 'src/_ezs/api/notifications.api'
import { DropdownMenu } from 'src/_ezs/partials/dropdown'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import Swal from 'sweetalert2'

function Home(props) {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20
  })

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListInventory', filters],
    queryFn: async () => {
      let { data } = await NotificationsAPI.list(filters)
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
        title: 'ID',
        dataKey: 'ID',
        width: 120
      },
      {
        key: 'Title',
        title: 'Tiêu đề',
        dataKey: 'Title',
        cellRenderer: ({ rowData }) => <div>{rowData.Title}</div>,
        width: 250
      },
      {
        key: 'Content',
        title: 'Nội dung',
        dataKey: 'Content',
        cellRenderer: ({ rowData }) => <div>{rowData.Content}</div>,
        width: 350
      },
      {
        key: 'ToUserTextToMemberText',
        title: 'Người nhận',
        dataKey: 'ToUserTextToMemberText',
        cellRenderer: ({ rowData }) => (
          <div>
            {rowData.ToUserText && <div>Nhân viên : {rowData.ToUserText}</div>}
            {rowData.ToMemberText && (
              <div>Khách hàng : {rowData.ToMemberText}</div>
            )}
          </div>
        ),
        width: 300
      },
      {
        key: 'CreateDate',
        title: 'Ngày gửi',
        dataKey: 'CreateDate',
        width: 200,
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY')
      },
      {
        key: 'IsSent',
        title: 'Kết quả',
        dataKey: 'IsSent',
        width: 150,
        cellRenderer: ({ rowData }) =>
          rowData.IsSent ? 'Đã gửi' : 'Đang thực hiện'
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        headerClassNames: () => 'justify-center adad',
        width: 80,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <DropdownMenu
              className="fixed rounded px-0 py-2 border-0 min-w-[100px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow"
              trigger={
                <button
                  type="button"
                  className="bg-primary hover:bg-primaryhv text-white mx-[2px] text-sm cursor-pointer p-2.5 transition rounded-full"
                >
                  <EllipsisHorizontalIcon className="w-5" />
                </button>
              }
            >
              <div className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white">
                Chỉnh sửa
              </div>
              <div>
                <button
                  type="button"
                  className="w-full text-[15px] flex items-center px-5 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light font-inter transition cursor-pointer dark:text-white text-danger"
                  onClick={() => onDelete(rowData)}
                >
                  Xóa
                </button>
              </div>
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

  const deleteMutation = useMutation({
    mutationFn: body => NotificationsAPI.delete(body)
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
        bodyFormData.append('ID', item.ID)
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

  return (
    <div className="bg-white w-full h-full">
      <div className="flex flex-col h-full px-8 pt-8 pb-5 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Danh sách tin nhắn APP
            </div>
            <div className="mt-1.5">
              Quản lý lịch sử gửi tin nhắn trên APP tới khách hàng & nhân viên.
            </div>
          </div>
          <div className="flex sm:pb-1">
            <NavLink
              to="them-moi"
              className="relative flex items-center justify-center w-10 h-10 text-white transition rounded shadow-lg sm:w-12 sm:h-12 md:w-auto md:px-4 bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Tạo mới tin nhắn
            </NavLink>
          </div>
        </div>
        <ReactBaseTable
          pagination
          wrapClassName="grow"
          rowKey="ID"
          columns={columns}
          data={data?.data || []}
          fixed
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
          pageOffset={filters.pi}
          pageSizes={filters.ps}
          onChange={({ pageIndex, pageSize }) => {
            setFilters(prevState => ({
              ...prevState,
              Pi: pageIndex,
              Ps: pageSize
            }))
          }}
          // rowEventHandlers={{
          //   onClick: ({ rowKey, ...a }) => {
          //     console.log(a)
          //   }
          // }}
        />
        <Outlet />
      </div>
    </div>
  )
}

export default Home
