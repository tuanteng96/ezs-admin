import {
  AdjustmentsVerticalIcon,
  BarsArrowDownIcon,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import UsersAPI from 'src/_ezs/api/users.api'
import { Button } from 'src/_ezs/partials/button'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import {
  PickerFilter,
  PickerRating,
  PickerUserAddEdit,
  PickerUserInfo
} from './components'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useAuth } from 'src/_ezs/core/Auth'
import { formatArray } from 'src/_ezs/utils/formatArray'
import clsx from 'clsx'
import Tooltip from 'rc-tooltip'
import { useWindowSize } from 'src/_ezs/hooks/useWindowSize'
import { NotFound } from 'src/_ezs/layout/components/notfound'
import useInfiniteScroll from 'react-infinite-scroll-hook'

function Home(props) {
  const { CrStocks, Stocks } = useAuth()
  const { width } = useWindowSize()

  let [filters, setFilters] = useState({
    Key: '',
    GroupIDs: [
      // 4584
    ],
    Status: [0],
    Levels: [],
    StockIDs: CrStocks?.ID,
    Pi: 1,
    Ps: 20
  })

  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['ListUserRoles', filters],
      queryFn: async ({ pageParam = 1 }) => {
        let rs = await UsersAPI.listUsersRoles({
          ...filters,
          Status:
            filters?.Status && filters?.Status.length > 0
              ? filters?.Status
              : [0, -1],
          Pi: pageParam,
          StockIDs: [filters.StockIDs]
        })
        return rs?.data
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.Pi === lastPage.Pcount ? undefined : lastPage.Pi + 1,
      keepPreviousData: true
    })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'Items')

  const updateMutation = useMutation({
    mutationFn: async body => {
      let result = await UsersAPI.addEditUser2(body)
      await refetch()
      return result
    }
  })

  const onDisable = item => {
    document.body.click()
    Swal.fire({
      customClass: {
        confirmButton: '!bg-primary'
      },
      title: !item?.Disabled ? 'Vô hiệu hoá tài khoản' : 'Mở lại tài khoản',
      html: `Xác nhận ${
        !item?.Disabled ? 'vô hiệu hoá tài' : 'mở lại tài khoản'
      } khoản nhân viên này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let rs = await updateMutation.mutateAsync({
          updates: [
            {
              UserID: item.ID,
              Disabled: !item.Disabled
            }
          ]
        })
        return rs
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        toast.success('Thực hiện thành công.')
      }
    })
  }

  const getFirstName = str => {
    if (str) {
      let spl = str.split(' ')
      return spl[spl.length - 1].substring(0, 1)
    }
    return str
  }

  const columns = useMemo(
    () => [
      {
        key: 'FullName',
        title: 'Họ và tên',
        dataKey: 'FullName',
        cellRenderer: ({ rowData }) => (
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full border-[#a5dff8] border-[2px]">
              <div className="flex items-center justify-center w-full h-full text-lg font-bold border-[2px] border-white rounded-full bg-primarylight text-primary font-number uppercase">
                {getFirstName(rowData?.FullName)}
              </div>
            </div>
            <div className="flex-1 pl-4">
              <div className="font-medium capitalize">{rowData?.FullName}</div>
              <div className="mt-1 text-muted2 text-[14px] font-number">
                <span>#{rowData?.ID}</span>
              </div>
            </div>
          </div>
        ),
        width: 370,
        sortable: false
      },
      {
        key: 'UserName',
        title: 'Tài khoản',
        dataKey: 'UserName',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-between w-full font-medium">
            <span>{rowData?.UserName}</span>
            <PickerUserInfo values={rowData}>
              {({ open }) => (
                <div
                  onClick={() => {
                    document.body.click()
                    open()
                  }}
                >
                  <ExclamationCircleIcon className="w-[22px] ml-1.5 text-muted cursor-pointer" />
                </div>
              )}
            </PickerUserInfo>
          </div>
        ),
        width: 220,
        sortable: false
      },
      {
        key: 'Groups',
        title: 'Nhóm',
        dataKey: 'Groups',
        cellRenderer: ({ rowData }) => (
          <div className="flex flex-wrap gap-1.5">
            {rowData?.GroupList && rowData?.GroupList.length > 0 ? (
              rowData?.GroupList.map(x => ({
                ...x,
                label: `${x.TitleStock || x.GroupTitle} - ${
                  x.StockTitle || 'Hệ thống'
                }`
              })).map((item, i) => (
                <div
                  className="rounded bg-primarylight text-primary font-number px-2.5 py-[2px] text-[13px] font-medium"
                  key={i}
                >
                  {item?.label}
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        ),
        width: 300,
        sortable: false
      },
      {
        key: 'Disabled',
        title: 'Trạng thái',
        dataKey: 'Disabled',
        cellRenderer: ({ rowData }) => (
          <div
            className={clsx(
              !rowData?.Disabled ? 'text-success' : 'text-danger'
            )}
          >
            {!rowData?.Disabled ? 'Hoạt động' : 'Đã nghỉ'}
          </div>
        ),
        width: 180,
        sortable: false
      },
      {
        key: 'AverRate',
        title: 'Đánh giá',
        dataKey: 'AverRate',
        cellRenderer: ({ rowData }) => (
          <PickerRating initialValues={rowData}>
            {({ open }) => (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={open}
              >
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <svg
                    key={i}
                    className={clsx(
                      'w-5',
                      rowData?.AverRate < item
                        ? 'text-gray-300'
                        : 'text-warning'
                    )}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
            )}
          </PickerRating>
        ),
        width: 180,
        sortable: false
      },
      {
        key: 'SoCaYeuCau',
        title: 'Ca yêu cầu / tháng',
        dataKey: 'SoCaYeuCau',
        cellRenderer: ({ rowData }) => (
          <div className="font-medium font-number">
            {rowData?.SoCaYeuCau === null || rowData?.SoCaYeuCau === ''
              ? ''
              : rowData?.SoCaYeuCau}
          </div>
        ),
        width: 180,
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
                  <PickerUserAddEdit initialValues={rowData}>
                    {({ open }) => (
                      <div
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition cursor-pointer"
                        onClick={() => {
                          open()
                          document.body.click()
                        }}
                      >
                        Chỉnh sửa thông tin
                      </div>
                    )}
                  </PickerUserAddEdit>
                  <div
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition text-danger cursor-pointer"
                    onClick={() => onDisable(rowData)}
                  >
                    {!rowData?.Disabled
                      ? 'Vô hiệu hoá tài khoản'
                      : 'Mở lại tài khoản'}
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

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => fetchNextPage()
    //disabled: !!error,
  })

  let StocksTitle = filters.StockIDs || ''

  if (StocksTitle !== '') {
    StocksTitle =
      Number(StocksTitle) === 0
        ? 'Cơ sở hệ thống'
        : 'Cơ sở ' + Stocks.filter(x => x.ID === Number(StocksTitle))[0].Title
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <div className="flex flex-col h-full px-4 pt-4 pb-4 mx-auto md:pb-5 md:px-8 md:pt-8 max-w-7xl">
        <div>
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-3xl font-bold dark:text-white">
                <span className="hidden md:block">Quản lý nhân viên</span>
                <span className="md:hidden">Nhân viên</span>
              </div>
              <div className="mt-1.5">{StocksTitle}</div>
            </div>
            <div className="flex pb-1 gap-2.5">
              {/* <PickerFilter
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
                    type="button"
                    onClick={open}
                    className="flex items-center justify-center text-gray-900 bg-light border rounded border-light pl-2.5 pr-2.5 md:pr-4 h-12 dark:bg-dark-light dark:border-dark-separator dark:text-white hover:text-primary dark:hover:text-primary"
                  >
                    <AdjustmentsVerticalIcon className="w-6" />
                    <span className="hidden pl-2 font-medium md:block">
                      Bộ lọc
                    </span>
                  </button>
                )}
              </PickerFilter>
 */}
              <Button
                type="button"
                onClick={() =>
                  (window.top.location.href = '/admin/?mdl20=user&act20=right2')
                }
                className="relative flex items-center h-12 px-3 md:px-4 transition rounded shadow-lg border border-[#d3d3d3] focus:outline-none focus:shadow-none disabled:opacity-70 font-medium hover:opacity-90 md:hidden"
              >
                <span>Phân quyền</span>
              </Button>

              <PickerUserAddEdit>
                {({ open }) => (
                  <Button
                    type="button"
                    onClick={open}
                    className="relative flex items-center h-12 px-2.5 md:px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
                  >
                    <PlusIcon className="w-6 md:hidden" />
                    <span className="hidden md:block">Thêm mới</span>
                  </Button>
                )}
              </PickerUserAddEdit>
            </div>
          </div>
          <div className="bg-[#f8f8fb] p-4 flex justify-between md:rounded-none rounded mb-2 md:mb-0">
            <div className="flex w-full gap-3 md:gap-4 md:w-auto">
              <div className="relative flex-1">
                <div className="absolute top-0 left-0 flex items-center justify-center h-full pointer-events-none w-11 md:w-10 text-muted2">
                  <MagnifyingGlassIcon className="w-5" />
                </div>
                <input
                  className="border border-[#d3d3d3] h-11 md:h-9 rounded-full md:pl-10 pl-11 text-[14px] focus:border-primary transiton-all w-full md:max-w-[350px] md:min-w-[350px] lg:max-w-[450px] lg:min-w-[450px]"
                  type="text"
                  placeholder="Nhập tên nhân viên"
                  value={filters.Key}
                  onChange={e => {
                    setFilters(prevState => ({
                      ...prevState,
                      Key: e.target.value
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
            <div className="hidden md:block">
              <button
                onClick={() =>
                  (window.top.location.href = '/admin/?mdl20=user&act20=right2')
                }
                type="button"
                className="flex items-center justify-center border border-[#d3d3d3] h-9 rounded-full bg-white hover:bg-[#f5f5f5] transiton-all px-4"
              >
                <span className="hidden pr-2 text-sm font-medium md:block font-number">
                  Phân quyền
                </span>
                <BarsArrowDownIcon className="w-5" />
              </button>
            </div>
          </div>
        </div>

        {width > 767 ? (
          <ReactBaseTable
            wrapClassName="grow basetable-no-border"
            rowKey="ID"
            columns={columns}
            data={Lists || []}
            estimatedRowHeight={96}
            emptyRenderer={() =>
              !isLoading && (
                <div className="flex items-center justify-center h-full">
                  Không có dữ liệu
                </div>
              )
            }
            loading={isLoading}
            onEndReachedThreshold={1}
            onEndReached={fetchNextPage}
          />
        ) : (
          <>
            {isLoading && (
              <div className="overflow-auto grow scroll">
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <div
                      className="mb-4 overflow-hidden border border-gray-300 rounded last:mb-0"
                      key={index}
                    >
                      <div className="relative px-4 py-3 border-b border-gray-300 bg-gray-50">
                        <div className="w-8/12 h-3.5 bg-gray-200 rounded-full animate-pulse mb-1.5"></div>
                        <div className="w-5/12 h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="p-4">
                        <div className="w-full h-2.5 bg-gray-200 rounded-full animate-pulse mb-1.5"></div>
                        <div className="w-5/12 h-2.5 bg-gray-200 rounded-full animate-pulse mb-3.5"></div>
                        <div className="w-8/12 h-2.5 bg-gray-200 rounded-full animate-pulse mb-1.5"></div>
                        <div className="w-11/12 h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {!isLoading && (
              <div className="overflow-auto grow scroll" ref={rootRef}>
                {Lists && Lists.length > 0 && (
                  <>
                    {Lists.map((item, index) => (
                      <div
                        className="mb-4 overflow-hidden border border-gray-300 rounded last:mb-0"
                        key={index}
                        ref={sentryRef}
                      >
                        <div>
                          <div className="relative flex justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
                            <div>
                              <div className="font-medium">
                                {item?.FullName}
                              </div>
                              <div className="mt-px text-muted2 text-[14px] font-number">
                                <span>#{item?.ID}</span>
                                <span>- {item?.UserName}</span>
                              </div>
                            </div>
                            <Tooltip
                              //visible={true}
                              showArrow={false}
                              overlayClassName=""
                              placement="top"
                              trigger={['click']}
                              overlay={
                                <div className="border-[#e5e5e5] border bg-white shadow-lg rounded-lg py-2.5">
                                  <PickerUserInfo values={item}>
                                    {({ open }) => (
                                      <div
                                        onClick={() => {
                                          document.body.click()
                                          open()
                                        }}
                                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition cursor-pointer"
                                      >
                                        Thông tin đăng nhập
                                      </div>
                                    )}
                                  </PickerUserInfo>
                                  <PickerUserAddEdit initialValues={item}>
                                    {({ open }) => (
                                      <div
                                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition cursor-pointer"
                                        onClick={() => {
                                          open()
                                          document.body.click()
                                        }}
                                      >
                                        Chỉnh sửa thông tin
                                      </div>
                                    )}
                                  </PickerUserAddEdit>
                                  <div
                                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition text-danger cursor-pointer"
                                    onClick={() => onDisable(item)}
                                  >
                                    {!item?.Disabled
                                      ? 'Vô hiệu hoá tài khoản'
                                      : 'Mở lại tài khoản'}
                                  </div>
                                </div>
                              }
                              align={{
                                offset: [9, 0]
                              }}
                            >
                              <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full">
                                <EllipsisVerticalIcon className="w-6" />
                              </div>
                            </Tooltip>
                          </div>
                          <div className="p-4">
                            <div className="mb-4 last:mb-0">
                              <div className="mb-1 text-sm text-muted2">
                                Nhóm
                              </div>
                              <div className="flex flex-wrap gap-1.5 font-medium">
                                {item?.GroupList &&
                                item?.GroupList.length > 0 ? (
                                  item?.GroupList.map(x => ({
                                    ...x,
                                    label: `${x.TitleStock || x.GroupTitle} - ${
                                      x.StockTitle || 'Hệ thống'
                                    }`
                                  })).map((item, i) => (
                                    <div
                                      className="rounded bg-primarylight text-primary font-number px-2.5 py-[2px] text-[13px] font-medium"
                                      key={i}
                                    >
                                      {item?.label}
                                    </div>
                                  ))
                                ) : (
                                  <>Chưa xác định</>
                                )}
                              </div>
                            </div>
                            <div className="mb-4 last:mb-0">
                              <div className="mb-1 text-sm text-muted2">
                                Trạng thái
                              </div>
                              <div
                                className={clsx(
                                  'font-medium',
                                  !item?.Disabled
                                    ? 'text-success'
                                    : 'text-danger'
                                )}
                              >
                                {!item?.Disabled ? 'Hoạt động' : 'Đã nghỉ'}
                              </div>
                            </div>
                            <div className="mb-4 last:mb-0">
                              <div className="mb-1 text-sm text-muted2">
                                Đánh giá
                              </div>
                              <PickerRating initialValues={item}>
                                {({ open }) => (
                                  <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={open}
                                  >
                                    {[1, 2, 3, 4, 5].map((x, i) => (
                                      <svg
                                        key={i}
                                        className={clsx(
                                          'w-5',
                                          item?.AverRate < x
                                            ? 'text-gray-300'
                                            : 'text-warning'
                                        )}
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                      >
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                      </svg>
                                    ))}
                                  </div>
                                )}
                              </PickerRating>
                            </div>
                            <div className="mb-4 last:mb-0">
                              <div className="mb-1 text-sm text-muted2">
                                Ca yêu cầu / tháng
                              </div>
                              <div className="font-medium">
                                {item?.SoCaYeuCau === null ||
                                item?.SoCaYeuCau === ''
                                  ? 'Chưa xác định'
                                  : item?.SoCaYeuCau}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {(!Lists || Lists.length === 0) && (
                  <div className="flex items-center justify-center h-full">
                    <NotFound
                      Title="Không có dữ liệu"
                      Desc="Dữ liệu nhân viên hiện tại trống."
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
