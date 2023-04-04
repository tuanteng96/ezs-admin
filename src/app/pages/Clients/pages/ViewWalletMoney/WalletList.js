import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'
import MembersAPI from 'src/_ezs/api/members.api'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const getTypeString = ({ TypeText, Type }) => {
  if (Type === 'NAP_QUY') return 'Nạp ví'
  if (Type === 'MUA_HANG_SANPHAM') return 'Mua hàng sản phẩm'
  return TypeText
}

const EditableCell = ({ rowData }) => {
  const [value, setValue] = useState(rowData.Desc)
  const [editing, setEditing] = useState(false)

  let descRef = useRef()
  let targetRef = useRef()
  const handleClick = () => setEditing(true)

  useEffect(() => {
    descRef?.current?.focus()
  }, [descRef, editing])

  const addDescWallteMutation = useMutation({
    mutationFn: body => MembersAPI.memberWalletAddDesc(body)
  })

  const onChangeValue = e => {
    var bodyFormData = new FormData()
    bodyFormData.append('cmd', 'member_money_desc')
    bodyFormData.append('desc', e.target.value)
    bodyFormData.append('ID', rowData.ID)

    setValue(e.target.value)
    setEditing(false)

    addDescWallteMutation.mutate(bodyFormData)
  }

  return (
    <div className="w-full" ref={targetRef}>
      {!editing && value && (
        <div
          className={clsx(
            'w-full border-dashed border border-transparent rounded h-12 flex items-center px-3 ',
            !rowData?.Order && 'hover:border-[rgb(204,204,204)]',
            !rowData?.Order ? 'border' : 'border-0'
          )}
          onClick={() => !rowData?.Order && handleClick()}
        >
          {value && value}
        </div>
      )}
      <>
        {!editing && !value && (
          <div
            className="w-full border-[rgb(204,204,204)] border-dashed border-0 rounded h-12 flex items-center px-3 hover:border text-muted"
            onClick={handleClick}
          >
            Thêm ghi chú
          </div>
        )}
        {editing && (
          <textarea
            ref={descRef}
            className="w-full px-3 py-2 font-medium text-gray-700 transition bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700 border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary h-12"
            placeholder="Nhập ghi chú"
            onBlur={onChangeValue}
            onChange={e => setValue(e.target.value)}
            value={value}
          ></textarea>
        )}
      </>
    </div>
  )
}

function WalletList({ resultWallet, onOpenAddWallet }) {
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
        title: 'Loại',
        dataKey: 'TypeText',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{getTypeString(rowData)}</div>
            {statusPayted(rowData)}
          </div>
        ),
        width: 200,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Value',
        title: 'Tiền trong ví',
        dataKey: 'Value',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.Value),
        width: 150,
        sortable: false
      },
      {
        key: 'NAP_QUY',
        title: 'Tiền nạp',
        dataKey: 'NAP_QUY',
        width: 150,
        cellRenderer: ({ rowData }) => getDeposits(rowData),
        sortable: false
      },
      {
        key: 'Desc',
        title: 'Ghi chú',
        dataKey: 'Desc',
        //cellRenderer: ({ rowData }) => rowData.Desc,
        width: 260,
        sortable: false,
        cellRenderer: <EditableCell />,
        style: {
          padding: '15px 0'
        },
        headerClassName: '!px-3'
      },
      {
        key: 'CreateDate',
        title: 'Ngày',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) =>
          moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY'),
        width: 170,
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resultWallet]
  )

  const getDeposits = item => {
    if (resultWallet?.data?.cash && resultWallet?.data?.cash.length > 0) {
      let index = resultWallet?.data?.cash.findIndex(
        x => x.SourceID === item.ID
      )
      if (index > -1) {
        return formatString.formatVND(resultWallet?.data?.cash[index].Value)
      }
    }
    return
  }

  const statusPayted = ({ SourceID, SubSourceID }) => {
    const { remainPayed } = resultWallet.data
    if (remainPayed?.OrderIDs && remainPayed?.OrderItemIDs) {
      const isOrders = remainPayed?.OrderIDs.some(x => x === SubSourceID)
      const isOrderItems = remainPayed?.OrderItemIDs.some(x => x === SourceID)
      if (isOrders || isOrderItems)
        return <div className="text-sm text-danger">Chưa thanh toán hết</div>
    }
    return
  }

  return (
    <>
      <div className="flex items-end justify-between p-6 mb-4 bg-white dark:bg-dark-aside rounded shadow-sm">
        <div>
          <div className="mb-2 font-semibold">Ví khả dụng</div>
          <div className="text-4xl font-bold text-orange">
            {formatString.formatVND(resultWallet?.data?.total)}
          </div>
        </div>
        <div>
          <div className="text-[#969ba0] uppercase text-[13px] font-inter font-medium dark:text-gray-300">
            Tổng ví
          </div>
          <div className="text-xl font-bold dark:text-white">
            {formatString.formatVND(resultWallet?.data?.total2)}
          </div>
        </div>
        <div>
          <div className="text-[#969ba0] uppercase text-[13px] font-inter font-medium dark:text-gray-300">
            Chờ xử lý
          </div>
          <div className="text-xl font-bold text-warning">
            {formatString.formatVND(
              resultWallet?.data?.total2 - resultWallet?.data?.total
            )}
          </div>
        </div>
        <div>
          <button
            type="button"
            className="relative flex items-center px-4 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none"
            onClick={onOpenAddWallet}
          >
            Nạp tiền Ví điện tử
          </button>
        </div>
      </div>
      <ReactBaseTable
        wrapClassName="flex-grow bg-white rounded"
        rowKey="ID"
        columns={columns}
        data={resultWallet?.data?.data || []}
        loading={resultWallet.isLoading}
        estimatedRowHeight={50}
      />
    </>
  )
}

WalletList.propTypes = {
  resultWallet: PropTypes.object
}

export default WalletList
