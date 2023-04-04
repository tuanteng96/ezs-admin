import React, { useMemo } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { useLocation, useNavigate, useParams } from 'react-router'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { formatString } from 'src/_ezs/utils/formatString'
import { useQuery } from '@tanstack/react-query'
import MembersAPI from 'src/_ezs/api/members.api'
import uuid from 'react-uuid'
import Text from 'react-texty'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { Button } from 'src/_ezs/partials/button'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function ViewPay(props) {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const resultPay = useQuery({
    queryKey: ['MemberListPay', { MemberID: id }],
    queryFn: async () => {
      const { data } = await MembersAPI.memberListPay({
        MemberID: id,
        DateEnd: null,
        DateStart: '1/1/1990',
        Pi: 1,
        Ps: 100,
        StockID: '',
        TypeCN: ''
      })
      let newData = {
        data: [],
        total: 0
      }
      if (data?.result?.Items && data?.result?.Items.length > 0) {
        let { ListOrders, TongNo } = data?.result?.Items[0]
        newData.total = TongNo
        for (let [o, order] of ListOrders.entries()) {
          let ToPayOrder = order.ListDebt.reduce((n, { ToPay }) => n + ToPay, 0)
          for (let [k, item] of order.ListDebt.entries()) {
            const newObj = {
              ...item,
              ...order,
              ToPayOrder: ToPayOrder,
              rowIndex: o,
              Ids: uuid()
            }
            if (k !== 0) {
              delete newObj.ListDebt
            }
            newData.data.push(newObj)
          }
        }
      }
      return newData
    }
  })

  const columns = useMemo(
    () => [
      {
        key: 'Id',
        title: 'ID Đơn hàng',
        dataKey: 'Id',
        width: 120,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.ListDebt ? rowData.ListDebt.length : 1
      },
      {
        key: 'CreateDate',
        title: 'Ngày',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        width: 160,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.ListDebt ? rowData.ListDebt.length : 1
        //align: 'center',
      },
      {
        key: 'ProdTitle',
        title: 'Mặt hàng',
        dataKey: 'ProdTitle',
        width: 300,
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={280}>
            {rowData.ProdTitle} <span className="pl-1">(x{rowData.Qty})</span>
          </Text>
        ),
        sortable: false
      },
      {
        key: 'ToPay',
        title: 'Giá tiền',
        dataKey: 'ToPay',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.ToPay),
        width: 162,
        sortable: false
      },
      {
        key: 'ToPayOrder',
        title: 'Tổng tiền',
        dataKey: 'ToPayOrder',
        cellRenderer: ({ rowData }) =>
          formatString.formatVND(rowData.ToPayOrder),
        width: 160,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.ListDebt ? rowData.ListDebt.length : 1
      },
      {
        key: 'TongNo',
        title: 'Còn nợ',
        dataKey: 'TongNo',
        cellRenderer: ({ rowData }) => (
          <div className="font-semibold text-danger">
            {formatString.formatVND(rowData.TongNo)}
          </div>
        ),
        width: 160,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.ListDebt ? rowData.ListDebt.length : 1
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowData }) => (
          <Button className="relative flex items-center px-4 text-[15px] font-medium text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none text">
            Thanh toán nợ
          </Button>
        ),
        width: 170,
        sortable: false,
        rowSpan: ({ rowData }) =>
          rowData.ListDebt ? rowData.ListDebt.length : 1,
        align: 'center'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    if (isScrolling)
      return (
        <div className="pl-15px d-flex align-items">
          <div className="spinner spinner-primary w-40px"></div> Đang tải ...
        </div>
      )
    const indexList = [0, 1, 4, 5, 6]
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex })
      if (rowSpan > 1) {
        const cell = cells[index]
        const style = {
          ...cell.props.style,
          backgroundColor: 'var(--ezs-element-bg)',
          height: rowSpan * 70 - 1,
          alignSelf: 'flex-start',
          zIndex: 1
        }
        cells[index] = React.cloneElement(cell, { style })
      }
    }
    return cells
  }

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
                Thanh toán nợ
                {resultPay?.data?.total > 0 && (
                  <div className="pl-2">
                    - Tổng nợ
                    <span className="pl-2 text-danger">
                      {formatString.formatVND(resultPay?.data?.total)}
                    </span>
                  </div>
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
              rowKey="Ids"
              columns={columns}
              data={resultPay?.data?.data || []}
              loading={resultPay.isLoading}
              rowHeight={70}
              //estimatedRowHeight={50}
              rowRenderer={rowRenderer}
            />
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  )
}

ViewPay.propTypes = {}

export default ViewPay
