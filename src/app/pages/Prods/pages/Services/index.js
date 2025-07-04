import {
  AdjustmentsVerticalIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import Tooltip from 'rc-tooltip'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { ImageLazy } from 'src/_ezs/partials/images'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { formatString } from 'src/_ezs/utils/formatString'
import Swal from 'sweetalert2'
import { useProds } from '../../ProdsLayout'
import {
  PickerAddEdit,
  PickerCare,
  PickerConsumableMaterials,
  PickerFilter
} from './components'
import {
  PickerCatalogue,
  PickerSettingsCommission,
  PickerSettingsImages,
  PickerSettingsTourSalary
} from '../../components'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { NotFound } from 'src/_ezs/layout/components/notfound'

function ServicesPage(props) {
  let { CateID } = useParams()

  const { ReadCate, ReadApp_type } = useRoles(['ReadCate', 'ReadApp_type'])
  let { MenuActive } = useProds()
  let [filters, setFilters] = useState({
    prods: 1,
    pi: 1,
    ps: 20,
    typeid: CateID,
    manu: '',
    byStock: '',
    is_service: 0,
    is_fee: 0,
    key: '',
    display: '',
    byPublic: '',
    rightApp: '',
    v: 2,
    is_sale: 0,
    ServiceOrFee: 1,
    skip_display: 1
  })

  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['ListProdsServices', { filters }],
      queryFn: async ({ pageParam = 1 }) => {
        let rs = await ProdsAPI.get({
          ...filters,
          typeid:
            typeof filters?.typeid === 'object'
              ? filters?.typeid?.value
              : CateID,
          manu: filters?.manu?.value || '',
          byStock: filters?.byStock || '',
          pi: pageParam
        })

        let newLists = [...(rs?.data?.data?.list || [])]
        if (newLists && newLists.length > 0) {
          var bodyFormData = new FormData()
          bodyFormData.append('ids', newLists.map(x => x.ID).toString())
          bodyFormData.append('sale', false)
          bodyFormData.append('bystock', '')
          bodyFormData.append('x', '1')

          let { data } = await ProdsAPI.getListIds(bodyFormData)
          if (data?.data && data?.data.length > 0) {
            for (let item of data?.data) {
              let index = newLists.findIndex(x => x.ID === item.id)
              if (index > -1) newLists[index]['Items'] = item.items
            }
          }
        }
        return {
          ...rs?.data?.data,
          list: newLists.filter(x => x.Items && x.Items.length > 0)
        }
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
    })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const columns = useMemo(
    () => [
      // {
      //   key: 'ID',
      //   title: 'ID',
      //   dataKey: 'ID',
      //   width: 100,
      //   sortable: false
      // },
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
        key: 'Title',
        title: 'Tên sản phẩm',
        dataKey: 'Title',
        width: 280,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div className="mb-1 font-medium">{rowData.Title}</div>
            <div className="text-sm text-muted2 font-number">
              #{rowData.ID} / {rowData?.DynamicID}
            </div>
          </div>
        )
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
          <div className="font-medium font-number">
            {formatString.formatVND(rowData?.PriceProduct)}
          </div>
        ),
        sortable: false
      },
      {
        key: '#',
        title: 'Lựa chọn',
        dataKey: '#',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <Tooltip
              //visible={true}
              showArrow={false}
              overlayClassName=""
              placement="top"
              trigger={['click']}
              overlay={
                <div className="border-[#e5e5e5] border bg-white shadow-lg rounded-lg py-2.5">
                  <PickerAddEdit initialValues={rowData}>
                    {({ open }) => (
                      <div
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition cursor-pointer"
                        onClick={() => {
                          open()
                          document.body.click()
                        }}
                      >
                        Chỉnh sửa dịch vụ
                      </div>
                    )}
                  </PickerAddEdit>
                  <PickerConsumableMaterials item={rowData}>
                    {({ open }) => (
                      <div
                        onClick={() => {
                          if (!ReadCate?.hasRight) {
                            toast.error(
                              'Bạn không có quyền truy cập chức năng này.'
                            )
                          } else {
                            open()
                          }
                          document.body.click()
                        }}
                        className="w-full text-[15px] flex items-center px-4 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Nguyên vật liệu
                      </div>
                    )}
                  </PickerConsumableMaterials>
                  <PickerCare item={rowData}>
                    {({ open }) => (
                      <div
                        onClick={() => {
                          if (!ReadCate?.hasRight) {
                            toast.error(
                              'Bạn không có quyền truy cập chức năng này.'
                            )
                          } else {
                            open()
                          }
                          document.body.click()
                        }}
                        className="w-full text-[15px] flex items-center px-4 py-2.5 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Cài đặt chăm sóc
                      </div>
                    )}
                  </PickerCare>
                  <div
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition text-danger cursor-pointer"
                    onClick={() => {
                      document.body.click()
                      onDelete(rowData)
                    }}
                  >
                    Xoá
                  </div>
                </div>
              }
              align={{
                offset: [9, 0]
              }}
            >
              <div className="flex items-center justify-center transition rounded-3xl cursor-pointer border-[#d3d3d3] border px-3.5 py-1.5 text-[14px] font-medium hover:bg-[#f5f5f5]">
                Chỉnh sửa
                <svg
                  className="w-5 ml-1"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.293 12.293a1 1 0 0 1 1.414 0l6.25 6.25a1 1 0 0 1-1.414 1.414L16 14.414l-5.543 5.543a1 1 0 0 1-1.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Tooltip>
          </div>
        ),
        headerClassName: 'justify-center',
        width: 160,
        sortable: false,
        frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const deleteProdsIDMutation = useMutation({
    mutationFn: body => ProdsAPI.deleteProdsID(body)
  })

  const deleteProdsOriginMutation = useMutation({
    mutationFn: body => ProdsAPI.getInitialProdId(body)
  })

  const recheckProdsIDMutation = useMutation({
    mutationFn: body => ProdsAPI.getInitialProdId(body)
  })

  const onDelete = async item => {
    if (!ReadCate?.hasRight) {
      toast.error('Bạn không có quyền truy cập chức năng này.')
    } else {
      toast.loading('Đang kiểm tra ...', {
        icon: (
          <div className="absolute left-4 top-2/4 -translate-y-2/4">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )
      })

      var bodyFormData = new FormData()
      bodyFormData.append('delete', item?.ID)
      bodyFormData.append('precheck', '1')

      let recheck = await recheckProdsIDMutation.mutateAsync(bodyFormData)

      toast.dismiss()

      if (recheck?.data?.error) {
        Swal.fire({
          customClass: {
            confirmButton: '!bg-danger'
          },
          title: 'Xóa dịch vụ ?',
          html: `<span class="text-danger">Dịch vụ ${item?.Title} đã phát sinh giao dịch. Bạn không thể xóa vĩnh viễn mà chỉ có thể chuyển về chế độ Ngừng Kinh doanh.</span>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ngừng kinh doanh',
          cancelButtonText: 'Đóng',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            var formData = new FormData()
            formData.append('hidden', item?.ID)
            const data = await recheckProdsIDMutation.mutateAsync(formData)
            await refetch()
            return data
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
          if (result.isConfirmed) {
            if (!result?.value?.data?.error) {
              toast.success('Đã xóa dịch vụ.')
            } else {
              toast.error('Xảy ra lỗi không xác định.')
            }
          }
        })
      } else {
        Swal.fire({
          customClass: {
            confirmButton: '!bg-danger'
          },
          title: 'Xóa dịch vụ ?',
          html: `Bạn có chắc chắn muốn xoá dịch vụ <span class="text-primary font-medium">${item?.Title}</span>? Hành động này không thể được hoàn tác.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Thực hiện',
          cancelButtonText: 'Đóng',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            const dataDelete = {
              delete: [item?.ID]
            }
            const data = await deleteProdsIDMutation.mutateAsync(dataDelete)
            await refetch()
            return data
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
          if (result.isConfirmed) {
            if (!result?.value?.data?.error) {
              toast.success('Đã xóa dịch vụ.')
            } else {
              toast.error('Xảy ra lỗi không xác định.')
            }
          }
        })
      }
    }
  }

  const onDeleteOrigin = async item => {
    if (!ReadCate?.hasRight) {
      toast.error('Bạn không có quyền truy cập chức năng này.')
    } else {
      toast.loading('Đang kiểm tra ...', {
        icon: (
          <div className="absolute left-4 top-2/4 -translate-y-2/4">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )
      })

      var bodyFormData = new FormData()
      bodyFormData.append('delete', item?.ID)
      bodyFormData.append('precheck', '1')

      let recheck = await recheckProdsIDMutation.mutateAsync(bodyFormData)

      toast.dismiss()

      if (recheck?.data?.error) {
        Swal.fire({
          customClass: {
            confirmButton: '!bg-danger'
          },
          title: 'Xóa dịch vụ ?',
          html: `<span class="text-danger">Dịch vụ ${item?.Title} đã phát sinh giao dịch. Bạn không thể xóa vĩnh viễn mà chỉ có thể chuyển về chế độ Ngừng Kinh doanh.</span>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ngừng kinh doanh',
          cancelButtonText: 'Đóng',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            var formData = new FormData()
            formData.append('hidden', item?.ID)
            const data = await recheckProdsIDMutation.mutateAsync(formData)
            await refetch()
            return data
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
          if (result.isConfirmed) {
            if (!result?.value?.data?.error) {
              toast.success('Đã xóa dịch vụ.')
            } else {
              toast.error('Xảy ra lỗi không xác định.')
            }
          }
        })
      } else {
        Swal.fire({
          customClass: {
            confirmButton: '!bg-danger'
          },
          title: 'Xóa dịch vụ ?',
          html: `Bạn có chắc chắn muốn xoá dịch vụ <span class="text-primary font-medium">${item?.Title}</span>? Hành động này không thể được hoàn tác.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Thực hiện',
          cancelButtonText: 'Đóng',
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            var formData = new FormData()
            formData.append('delete', item?.ID)

            const data = await deleteProdsOriginMutation.mutateAsync(formData)
            await refetch()
            return data
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
          if (result.isConfirmed) {
            if (!result?.value?.data?.error) {
              toast.success('Đã xóa dịch vụ.')
            } else {
              toast.error('Xảy ra lỗi không xác định.')
            }
          }
        })
      }
    }
  }

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => fetchNextPage()
    //disabled: !!error,
  })

  return (
    <div className="flex flex-col h-full sm:px-10 sm:py-8 p-4 max-w-[1155px] mx-auto">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-3xl font-bold dark:text-white">
            <span className="hidden md:block">Quản lý dịch vụ</span>
            <span className="md:hidden">Dịch vụ</span>
          </div>
          <div className="mt-1.5">Quản lý dịch vụ, thẻ dịch vụ của bạn</div>
        </div>
        <div className="flex pb-1 gap-2.5">
          <Tooltip
            showArrow={false}
            overlayClassName=""
            placement="bottom"
            trigger={['click']}
            overlay={
              <div className="rounded px-0 py-2 border-0 w-[220px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <PickerAddEdit>
                  {({ open }) => (
                    <div
                      onClick={() => {
                        if (!ReadCate?.hasRight) {
                          toast.error(
                            'Bạn không có quyền truy cập chức năng này.'
                          )
                        } else {
                          open()
                        }
                        document.body.click()
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Thêm mới dịch vụ
                    </div>
                  )}
                </PickerAddEdit>
                <PickerAddEdit>
                  {({ open }) => (
                    <div
                      onClick={() => {
                        if (!ReadCate?.hasRight) {
                          toast.error(
                            'Bạn không có quyền truy cập chức năng này.'
                          )
                        } else {
                          open()
                        }
                        document.body.click()
                      }}
                      className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                    >
                      Thêm mới thẻ liệu trình
                    </div>
                  )}
                </PickerAddEdit>
              </div>
            }
            align={{
              offset: [9, 0]
            }}
          >
            <button className="relative flex items-center h-12 px-2.5 md:px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70">
              Thêm mới
              <ChevronDownIcon
                className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex justify-between gap-2 p-4 mb-2 bg-[#f8f8fb] rounded sm:gap-0 md:rounded-none md:mb-0">
        <div className="flex w-full gap-2 md:gap-4 md:w-auto">
          <div className="relative flex-1">
            <div className="absolute top-0 left-0 flex items-center justify-center h-full pointer-events-none w-11 md:w-10 text-muted2">
              <MagnifyingGlassIcon className="w-5" />
            </div>
            <input
              className="border border-[#d3d3d3] h-11 md:h-9 rounded-full md:pl-10 pl-11 text-[14px] focus:border-primary transiton-all w-full md:max-w-[250px] md:min-w-[250px] xl:max-w-[450px] xl:min-w-[450px]"
              type="text"
              placeholder="Nhập tên dịch vụ"
              value={filters.key}
              onChange={e => {
                setFilters(prevState => ({
                  ...prevState,
                  key: e.target.value
                }))
              }}
            />
            {isFetching && (
              <div
                role="status"
                className="absolute top-0 right-0 flex items-center justify-center w-10 h-full"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 text-gray-200 animate-spin fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
          <PickerFilter
            onChange={val => {
              setFilters(prevState => ({
                ...prevState,
                ...val
              }))
            }}
            initialValues={filters}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={open}
                className="flex items-center justify-center border border-[#d3d3d3] h-11 md:h-9 rounded-full bg-white hover:bg-[#f5f5f5] transiton-all px-4"
              >
                <span className="hidden pr-2 text-sm font-medium md:block font-number">
                  Bộ lọc
                </span>
                <AdjustmentsVerticalIcon className="w-5" />
              </button>
            )}
          </PickerFilter>
        </div>
        <div>
          <Tooltip
            showArrow={false}
            overlayClassName=""
            placement="bottom"
            trigger={['click']}
            overlay={
              <div className="rounded px-0 py-2 border-0 w-[200px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div className="rounded px-0 py-2 border-0 w-[200px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                  <PickerCatalogue TypeOf="DV">
                    {({ open }) => (
                      <div
                        onClick={() => {
                          document.body.click()
                          open()
                        }}
                        className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Quản lý danh mục
                      </div>
                    )}
                  </PickerCatalogue>
                  <PickerSettingsCommission
                    Type={{
                      label: 'Tất cả dịch vụ',
                      value: MenuActive?.ID
                    }}
                    invalidateQueries={['ListProdsFees']}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => {
                          document.body.click()
                          if (!ReadCate?.hasRight) {
                            toast.error(
                              'Bạn không có quyền truy cập chức năng này.'
                            )
                          } else {
                            open()
                          }
                        }}
                        className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Quản lý hoa hồng
                      </button>
                    )}
                  </PickerSettingsCommission>
                  <PickerSettingsTourSalary
                    Type={{
                      label: 'Tất cả dịch vụ',
                      value: MenuActive?.ID
                    }}
                    invalidateQueries={['ListProdsFees']}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => {
                          document.body.click()
                          if (!ReadCate?.hasRight) {
                            toast.error(
                              'Bạn không có quyền truy cập chức năng này.'
                            )
                          } else {
                            open()
                          }
                        }}
                        className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Quản lý lương Tour
                      </button>
                    )}
                  </PickerSettingsTourSalary>
                  <hr className="h-px my-2 bg-gray-200 border-0" />
                  <PickerSettingsImages>
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => {
                          document.body.click()
                          if (ReadApp_type?.hasRight) {
                            open()
                          } else {
                            toast.error(
                              'Bạn không có quyền truy cập chức năng này.'
                            )
                          }
                        }}
                        className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                      >
                        Cài đặt hình ảnh
                      </button>
                    )}
                  </PickerSettingsImages>
                </div>
              </div>
            }
            align={{
              offset: [9, 0]
            }}
          >
            <button
              type="button"
              className="flex items-center justify-center border border-[#d3d3d3] h-11 md:h-9 rounded-full bg-white hover:bg-[#f5f5f5] transiton-all px-4"
            >
              <span className="hidden pr-2 text-sm font-medium font-number sm:block">
                Công cụ
              </span>
              <Cog6ToothIcon className="w-5" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="overflow-auto grow" ref={rootRef}>
        {isLoading && (
          <>
            {Array(2)
              .fill()
              .map((_, index) => (
                <div key={index}>
                  <div className="flex py-1 items-center relative after:w-full after:h-[1px] after:content-[''] after:border-t font-number after:border-dashed after:border-[#eee] after:absolute after:top-7 after:left-0 after:hidden border-b border-[#eee]">
                    <div className="w-2/4">
                      <div className="relative z-10 inline-block pr-4 text-sm font-semibold uppercase bg-white text-primary">
                        <div className="w-48 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-end flex-1 pr-4">
                      <div className="inline-block pr-2 bg-white text-muted2">
                        <div className="w-32 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white cursor-pointer">
                        <EllipsisVerticalIcon className="w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-[#eee]">
                    <div>
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-sm ">
                        <svg
                          className="w-6 h-6 text-gray-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
        {!isLoading && (
          <>
            {Lists &&
              Lists.length > 0 &&
              Lists.map((item, index) => (
                <div key={index} ref={sentryRef}>
                  <div className="flex py-1 items-center relative after:w-full after:h-[1px] after:content-[''] after:border-t font-number after:border-dashed after:border-[#eee] after:absolute after:top-7 after:left-0 after:hidden border-b border-[#eee]">
                    <div className="w-2/4">
                      <div className="relative z-10 inline-block pr-4 text-sm font-semibold uppercase bg-white text-primary">
                        {item.Title}
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-end flex-1 pr-4">
                      <div className="inline-block pr-2 bg-white text-muted2">
                        {item?.IsRootPublic
                          ? 'Cho phép đặt lịch'
                          : 'Cấm đặt lịch'}
                      </div>
                      <Tooltip
                        showArrow={false}
                        overlayClassName=""
                        placement="bottom"
                        trigger={['click']}
                        overlay={
                          <div className="rounded px-0 py-2 border-0 w-[220px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                            <PickerAddEdit>
                              {({ open }) => (
                                <div
                                  onClick={() => {
                                    if (!ReadCate?.hasRight) {
                                      toast.error(
                                        'Bạn không có quyền truy cập chức năng này.'
                                      )
                                    } else {
                                      open()
                                    }
                                    document.body.click()
                                  }}
                                  className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                                >
                                  Chỉnh sửa
                                </div>
                              )}
                            </PickerAddEdit>
                            <PickerConsumableMaterials item={item}>
                              {({ open }) => (
                                <div
                                  onClick={() => {
                                    if (!ReadCate?.hasRight) {
                                      toast.error(
                                        'Bạn không có quyền truy cập chức năng này.'
                                      )
                                    } else {
                                      open()
                                    }
                                    document.body.click()
                                  }}
                                  className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-white"
                                >
                                  Nguyên liệu tiêu hao
                                </div>
                              )}
                            </PickerConsumableMaterials>
                            <div
                              className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] font-inter transition cursor-pointer text-danger"
                              onClick={() => {
                                document.body.click()
                                onDeleteOrigin(item)
                              }}
                            >
                              Xoá
                            </div>
                          </div>
                        }
                        align={{
                          offset: [9, 0]
                        }}
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-white cursor-pointer">
                          <EllipsisVerticalIcon className="w-6" />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <ReactBaseTable
                    wrapStyle={{
                      height: `${96 * (item?.Items.length || 1)}px`
                    }}
                    wrapClassName="BaseTable__body_height basetable-no-border"
                    headerHeight={0}
                    rowKey="ID"
                    columns={columns}
                    data={item?.Items || []}
                    estimatedRowHeight={96}
                    emptyRenderer={() =>
                      !isLoading && (
                        <div className="flex items-center justify-center h-full text-sm font-light text-muted2">
                          Chưa có thẻ nào.
                        </div>
                      )
                    }
                    loading={isLoading}
                  />
                </div>
              ))}
            {(!Lists || Lists.length === 0) && (
              <NotFound
                Title="Không có dữ liệu"
                Desc={'Hiện tại chưa có dịch vụ nào.'}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ServicesPage
