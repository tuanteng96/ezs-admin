import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatString } from 'src/_ezs/utils/formatString'
import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

function WalletList({ resultWallet }) {
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
        width: 200,
        sortable: false
        //align: 'center',
      },
      {
        key: 'Value',
        title: 'Tiền trong ví',
        dataKey: 'Value',
        cellRenderer: ({ rowData }) => formatString.formatVND(rowData.Value),
        width: 130,
        sortable: false
      },
      {
        key: 'NAP_QUY',
        title: 'Tiền nạp',
        dataKey: 'NAP_QUY',
        width: 130,
        cellRenderer: ({ rowData }) =>
          rowData.Type === 'NAP_QUY'
            ? formatString.formatVND(rowData.Value)
            : '-',
        sortable: false
      },
      {
        key: 'Desc',
        title: 'Ghi chú',
        dataKey: 'Desc',
        cellRenderer: ({ rowData }) => rowData.Desc,
        width: 260,
        sortable: false
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
    []
  )
  return (
    <>
      <div className="flex items-end justify-between p-6 mb-4 bg-white rounded shadow-sm">
        <div>
          <div className="mb-2 font-semibold">Ví khả dụng</div>
          <div className="text-4xl font-bold text-orange">3.980.000</div>
        </div>
        <div>
          <div className="text-[#969ba0] uppercase text-[13px] font-inter font-medium">
            Tổng ví
          </div>
          <div className="text-xl font-bold">7.680.000</div>
        </div>
        <div>
          <div className="text-[#969ba0] uppercase text-[13px] font-inter font-medium">
            Chờ xử lý
          </div>
          <div className="text-xl font-bold text-warning">1.300.000</div>
        </div>
        <div>
          <button className="relative flex items-center px-4 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none">
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
        estimatedRowHeight={40}
      />
    </>
  )
}

WalletList.propTypes = {
  resultWallet: PropTypes.object
}

export default WalletList
