import React, { useMemo } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { useLocation, useNavigate, useParams } from 'react-router'
import { formatString } from 'src/_ezs/utils/formatString'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { formatArray } from 'src/_ezs/utils/formatArray'
import MembersAPI from 'src/_ezs/api/members.api'
import { useInfiniteQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const getStatusOrder = (item, type = false) => {
  if (
    item?.Status === 'finish' &&
    item?.AdminAction === 'TANG_DH_KET_THUC_NO'
  ) {
    return type ? 'Hoàn thành - Đơn tặng' : 'success'
  }
  if (
    item?.Status === 'finish' &&
    item?.AdminAction === 'KHOA_NO_KET_THUC_NO'
  ) {
    return type ? 'Hoàn thành - Khóa nợ' : 'success'
  }
  if (item?.Status === 'finish') {
    return type ? 'Hoàn thành' : 'success'
  }
  if (item?.Status === 'cancel' && item?.IsReturn) {
    return type ? 'Trả hàng' : 'danger'
  }
  if (item?.Status === 'cancel' && !item?.IsReturn) {
    return type ? 'Đơn hủy' : 'danger'
  }
}

function ViewOrders(props) {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const resultOrdersQuery = useInfiniteQuery({
    queryKey: ['ListMembersOrder', id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await MembersAPI.memberSearchOrder({
        Pi: pageParam,
        Ps: 15,
        Key: 'KH:' + id,
        searchId: 1,
        searchForMember: id
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pCount ? undefined : lastPage.pi + 1
  })
  const ListOrders = formatArray.useInfiniteQuery(
    resultOrdersQuery?.data?.pages
  )

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID Đơn hàng',
        dataKey: 'ID',
        width: 120,
        sortable: false
      },
      {
        key: 'CreateDate',
        title: 'Ngày',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        width: 160,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Status',
        title: 'Trạng thái',
        dataKey: 'Status',
        cellRenderer: ({ rowData }) => (
          <div
            className={clsx(
              'text-white text-[13px] rounded px-2 py-px',
              'bg-' + getStatusOrder(rowData)
            )}
          >
            {getStatusOrder(rowData, 'text')}
          </div>
        ),
        width: 185,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Stock.Title',
        title: 'Cơ sở',
        dataKey: 'Stock.Title',
        width: 200,
        sortable: false
      },
      {
        key: 'User.FullName',
        title: 'Nhân viên bán',
        dataKey: 'User.FullName',
        width: 180,
        sortable: false
      },
      {
        key: 'TotalValue',
        title: 'Tổng đơn hàng',
        dataKey: 'TotalValue',
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.TotalValue),
        width: 160,
        sortable: false
      },
      {
        key: 'Payed',
        title: 'Thanh toán',
        dataKey: 'Payed',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.Payed),
        width: 160,
        sortable: false
      },
      {
        key: 'TongNo',
        title: 'Còn nợ',
        dataKey: 'TongNo',
        cellRenderer: ({ rowData }) => (
          <div className="font-semibold text-danger">
            {formatString.formatVND(rowData.TotalValue - rowData.Payed)}
          </div>
        ),
        width: 135,
        sortable: false,
        frozen: 'right'
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowData }) => (
          <>
            <Link
              to={`/clients/${id}/order/${rowData.ID}`}
              state={{ previousPath: pathname }}
              className="relative flex items-center px-4 text-[15px] font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-10 focus:outline-none focus:shadow-none text-sm"
            >
              Xem đơn hàng
            </Link>
            {/* <ButtonDropdown
              classPopover="fixed bg-white dark:bg-site-aside dark:shadow-dark-shadow shadow-lg rounded w-[200px] py-2"
              placement="left"
              Button={
                <button className="relative flex items-center px-4 text-[15px] font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-10 focus:outline-none focus:shadow-none text-sm">
                  Lựa chọn <ChevronDownIcon className="w-[18px] ml-1" />
                </button>
              }
            >
              <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                Xem đơn hàng
              </div>
              {rowData?.Status === 'user_sent' && rowData.IsAnonymous && (
                <>
                  <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                    Hoàn thành khách vãng lai
                  </div>
                  {rowData?.PhoneID && (
                    <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                      Duyệt cho khách hàng
                    </div>
                  )}
                  {!rowData?.PhoneID && (
                    <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                      Tạo mới khách & Duyệt
                    </div>
                  )}
                </>
              )}
              {rowData?.Status === 'user_sent' && !rowData.IsAnonymous && (
                <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                  Hoàn thành
                </div>
              )}

              {rowData?.Status !== 'user_sent' && (
                <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                  Thưởng & Doanh số
                </div>
              )}
              {(rowData?.Status === 'finish' &&
                rowData?.AdminAction === 'TANG_DH_KET_THUC_NO') ||
                (rowData?.Status === 'finish' &&
                  rowData?.AdminAction === 'KHOA_NO_KET_THUC_NO') ||
                (rowData?.Status === 'finish' && (
                  <>
                    <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                      Thanh toán
                    </div>
                    <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                      Trả hàng
                    </div>
                  </>
                ))}
              {rowData?.Status === 'finish' && (
                <>
                  <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                    Thay đổi khách hàng
                  </div>
                  <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                    Tặng
                  </div>
                  <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                    Khóa nợ
                  </div>
                </>
              )}
              <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                COD
              </div>
              {rowData?.Status === 'user_sent' && (
                <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                  Hủy
                </div>
              )}
              <div className="flex items-center px-5 py-2 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-white font-medium">
                Xóa đơn hàng
              </div>
            </ButtonDropdown> */}
          </>
        ),
        width: 155,
        sortable: false,
        align: 'center',
        frozen: 'right'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(-1)}
          ></div>
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 z-10 w-full h-full bg-white max-w-7xl dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="flex text-2xl font-bold dark:text-graydark-800">
                Danh sách đơn hàng
                {ListOrders.length > 0 && (
                  <>
                    <span className="pl-1">({ListOrders.length})</span>
                  </>
                )}
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() => navigate(-1)}
              >
                <XMarkIcon className="w-9" />
              </div>
            </div>
            <ReactBaseTable
              wrapClassName="p-6 grow bg-white dark:bg-dark-app rounded"
              rowKey="ID"
              columns={columns}
              data={ListOrders || []}
              loading={resultOrdersQuery.isLoading}
              estimatedRowHeight={50}
              onEndReachedThreshold={1}
              onEndReached={() => resultOrdersQuery.fetchNextPage()}
            />
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

ViewOrders.propTypes = {}

export default ViewOrders
