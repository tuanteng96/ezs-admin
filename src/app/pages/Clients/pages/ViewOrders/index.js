import React, { useMemo } from 'react'
import { LayoutGroup, m } from 'framer-motion'
import { useLocation, useNavigate, useParams } from 'react-router'
import { formatString } from 'src/_ezs/utils/formatString'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { formatArray } from 'src/_ezs/utils/formatArray'
import MembersAPI from 'src/_ezs/api/members.api'
import { useInfiniteQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import Text from 'react-texty'

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
  const { pathname, state } = useLocation()
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
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={280}>
            {rowData?.User?.FullName || 'Đơn hàng Online'}
          </Text>
        ),
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
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() => navigate(state?.previousPath || `/clients/${id}`)}
          ></div>
        </m.div>
        <m.div
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
                onClick={() =>
                  navigate(state?.previousPath || `/clients/${id}`)
                }
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
        </m.div>
      </div>
    </LayoutGroup>
  )
}

ViewOrders.propTypes = {}

export default ViewOrders
