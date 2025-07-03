import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { formatString } from 'src/_ezs/utils/formatString'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { Button } from 'src/_ezs/partials/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import MembersAPI from 'src/_ezs/api/members.api'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const ButtonLock = ({ item }) => {
  const queryClient = useQueryClient()

  const lockCardMutation = useMutation({
    mutationFn: body => MembersAPI.memberLockMoneyCard(body)
  })

  const onLockCardMoney = ({ id, trang_thai }) => {
    lockCardMutation.mutate(
      { CardID: id },
      {
        onSuccess: data => {
          queryClient
            .invalidateQueries({ queryKey: ['MemberListMoneyCard'] })
            .then(() => {
              toast.success(
                trang_thai === 'Khóa'
                  ? 'Kích hoạt thẻ tiền thành công'
                  : 'Khóa thẻ tiền thành công'
              )
            })
        },
        onError: error => {
          console.log(error)
        }
      }
    )
  }

  return (
    <Button
      disabled={lockCardMutation.isLoading}
      loading={lockCardMutation.isLoading}
      onClick={() => onLockCardMoney(item)}
      type="button"
      className={clsx(
        'relative flex items-center px-4 font-semibold text-white transition rounded shadow-lg h-10 focus:outline-none focus:shadow-none text-sm disabled:opacity-70',
        item.trang_thai === 'Khóa'
          ? 'bg-success hover:bg-successhv'
          : 'bg-danger hover:bg-dangerhv'
      )}
    >
      {item.trang_thai === 'Khóa' ? 'Kích hoạt' : 'Khóa thẻ'}
    </Button>
  )
}

function MoneyCardList({ resultMoneyCard }) {
  const columns = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        dataKey: 'id',
        width: 110,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div className="flex">
            <ChevronRightIcon className="w-4 mr-1 text-muted2 icon-expanded" />
            {rowData.id}
          </div>
        )
      },
      {
        key: 'ten',
        title: 'Tên thẻ tiền',
        dataKey: 'ten',
        width: 220,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div>
            <div>
              {rowData.ten}
              {rowData.trang_thai === 'Khóa' && (
                <b className="text-sm text-danger text-capitalize">- Đã khóa</b>
              )}
            </div>
            <div>
              <span className="pr-1">HSD : </span>
              {!rowData.han_dung ? (
                'Không giới hạn'
              ) : (
                <React.Fragment>
                  {rowData.han_dung &&
                  moment().diff(rowData.han_dung, 'minutes') < 0 ? (
                    moment(rowData.han_dung).format('DD/MM/YYYY')
                  ) : (
                    <b className="text-danger">Hết hạn</b>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        )
        //align: 'center',
      },
      {
        key: 'gia_tri_the',
        title: 'Giá trị',
        dataKey: 'gia_tri_the',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{formatString.formatVND(rowData.gia_tri_the)} </div>
            {(rowData.gioi_han_sp !== 0 || rowData.gioi_han_dv !== 0) && (
              <>
                <div>
                  Sản phẩm : {formatString.formatVND(rowData.gioi_han_sp)}
                </div>
                <div>
                  Dịch vụ : {formatString.formatVND(rowData.gioi_han_dv)}
                </div>
              </>
            )}
          </div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: 'gia_tri_chi_tieu',
        title: 'Giá trị chi tiêu',
        dataKey: 'gia_tri_chi_tieu',
        width: 200,
        cellRenderer: ({ rowData }) => (
          <div>
            <div>{formatString.formatVND(rowData.gia_tri_chi_tieu)} </div>
            {(rowData.gia_tri_chi_tieu_sp !== 0 ||
              rowData.gia_tri_chi_tieu_dv !== 0) && (
              <>
                <div>
                  Sản phẩm :
                  <span className="pl-1">
                    {formatString.formatVND(rowData.gia_tri_chi_tieu_sp)}
                  </span>
                </div>
                <div>
                  Dịch vụ :
                  <span className="pl-1">
                    {formatString.formatVND(rowData.gia_tri_chi_tieu_dv)}
                  </span>
                </div>
              </>
            )}
          </div>
        ),
        sortable: false
      },
      {
        key: 'con_lai',
        title: 'Còn lại',
        dataKey: 'con_lai',
        cellRenderer: ({ rowData }) => (
          <div>
            <div>
              {formatString.formatVND(
                rowData.gia_tri_chi_tieu - rowData.su_dung
              )}
            </div>
            {(rowData.gia_tri_chi_tieu_sp - rowData.su_dung_sp !== 0 ||
              rowData.gia_tri_chi_tieu_dv - rowData.su_dung_dv !== 0) &&
              (rowData.gioi_han_sp !== 0 ||
                rowData.gioi_han_dv !== 0 ||
                rowData.gia_tri_chi_tieu_sp !== 0 ||
                rowData.gia_tri_chi_tieu_dv !== 0) && (
                <>
                  <div>
                    Sản phẩm :
                    <span className="pl-1">
                      {formatString.formatVND(
                        rowData.gia_tri_chi_tieu_sp - rowData.su_dung_sp
                      )}
                    </span>
                  </div>
                  <div>
                    Dịch vụ :
                    <span className="pl-1">
                      {formatString.formatVND(
                        rowData.gia_tri_chi_tieu_dv - rowData.su_dung_dv
                      )}
                    </span>
                  </div>
                </>
              )}
          </div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: '#',
        title: '#',
        dataKey: '#',
        cellRenderer: ({ rowData }) => <ButtonLock item={rowData} />,
        align: 'center',
        width: 160,
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const rowRenderer = ({ rowData, cells }) => {
    if (rowData.content)
      return (
        <div className="p-6">
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {rowData.content && rowData.content.length > 0 ? (
              rowData.content.map((item, index) => (
                <li className="mb-10 ml-4 last:mb-0" key={index}>
                  <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-inter">
                    {formatString.formatVND(item.Value)}
                    <time className="pl-2 mb-1 text-sm font-medium leading-none text-gray-800 dark:text-gray-500">
                      {moment(item.CreateDate).format('HH:mm DD-MM-YYYY')}
                    </time>
                  </h3>
                  <div className="text-base font-medium text-gray-700 dark:text-graydark-700 text-[15px]">
                    {item.ProdTitle}
                  </div>
                </li>
              ))
            ) : (
              <div>Không có lịch sử</div>
            )}
          </ol>
        </div>
      )
    return cells
  }

  return (
    <>
      <div className="py-6 pt-3 text-2xl font-bold dark:text-graydark-800">
        Thẻ tiền
      </div>
      <ReactBaseTable
        expandColumnKey={columns[0].key}
        wrapClassName="flex-grow bg-white rounded"
        rowKey="id"
        columns={columns}
        data={resultMoneyCard?.data || []}
        loading={resultMoneyCard.isLoading}
        estimatedRowHeight={50}
        rowRenderer={rowRenderer}
      />
    </>
  )
}

MoneyCardList.propTypes = {
  resultMoneyCard: PropTypes.object
}

export default MoneyCardList
