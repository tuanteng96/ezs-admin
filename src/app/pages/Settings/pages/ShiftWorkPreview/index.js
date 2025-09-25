import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router'
import SettingsAPI from 'src/_ezs/api/settings.api'
import UsersAPI from 'src/_ezs/api/users.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'

function getDaysOfMonthFromDate(dateObj) {
  const date = moment(dateObj)

  // Xác định ngày đầu và cuối tháng
  const startOfMonth = date.clone().startOf('month')
  const endOfMonth = date.clone().endOf('month')

  const days = []
  let day = startOfMonth.clone()

  while (day.isSameOrBefore(endOfMonth)) {
    days.push({
      Date: day.toDate(),
      WorkShiftType: null
    }) // Format theo DD-MM-YYYY
    day.add(1, 'day')
  }

  return days
}

function ShiftWorkPreview(props) {
  const { CrStocks, Stocks } = useAuth()
  const { GlobalConfig } = useLayout()
  let { month } = useParams()

  const { isLoading, data } = useQuery({
    queryKey: ['ShiftWorkPreview', { month, CrStocks, GlobalConfig }],
    queryFn: async () => {
      const { data: Rosters } = await SettingsAPI.getRoster({
        pi: 1,
        filter: {
          Status: '',
          Mon: moment(month, 'MM-YYYY').format('YYYY-MM'),
          StockID: CrStocks?.ID
        }
      })
      let UsersRs = null
      if (!GlobalConfig?.Admin?.roster_nv_dv) {
        const { data: Users } = await UsersAPI.listFull({
          StockID: CrStocks?.ID
        })
        UsersRs = Users
      } else {
        const { data: Users } = await UsersAPI.listService({
          StockID: CrStocks?.ID
        })
        UsersRs = Users
      }

      let rs = null

      if (Rosters?.items && Rosters?.items.length > 0) {
        let data = Rosters?.items[0]
        let Users = UsersRs?.data || []

        let newUser = [...(data?.Data?.Users || [])]
        for (let user of Users) {
          let index = newUser.findIndex(x => user.id === x.UserID)
          if (index > -1) {
            newUser[index].UserName = user.text
          }
        }

        newUser = newUser
          .map(x => {
            let newObj = {
              ...x,
              PositionIndex: x?.UserStockID === x?.StockID ? 0 : 1
            }
            let index = Users.findIndex(o => o.id === x.UserID)

            if (index === -1) newObj['isDelete'] = true
            else {
              newObj['isDelete'] = false
            }
            return newObj
          })
          .sort((a, b) => a.PositionIndex - b.PositionIndex)
          .filter(
            x =>
              x.Dates &&
              x.Dates.some(o => o.WorkShiftType && o.WorkShiftType.length > 0)
          )

        rs = newUser
      }

      return rs || []
    },
    enabled: Boolean(CrStocks?.ID),
    initialData: Array(5)
      .fill()
      .map(x => ({
        Dates: getDaysOfMonthFromDate(moment(month, 'MM-YYYY').toDate()),
        UserID: '',
        UserName: '',
        StockID: ''
      }))
  })

  const getStockByName = StocksID => {
    let index = Stocks && Stocks.findIndex(x => x.ID === StocksID)
    return index > -1 ? Stocks[index].Title : 'Chưa xác định'
  }

  return (
    <div className="relative h-full bg-white dark:bg-dark-app">
      <LoadingComponentFull
        bgClassName="bg-white/40 z-[10000]"
        loading={isLoading}
      />
      <div className="flex flex-col h-full gap-5 px-5 pt-5 pb-5 mx-auto">
        <div className="overflow-x-auto border border-[#eee] relative grow">
          <table className="min-w-full border-separate border-spacing-0">
            <thead
              className="sticky top-0 bg-[#f8f8f8] z-[1000] border-b border-b-[#eee]"
              style={{
                boxShadow: '0 10px 30px 0 rgba(82, 63, 105, .08)'
              }}
            >
              {data && data.length > 0 && (
                <>
                  {data.slice(0, 1).map((user, index) => (
                    <tr key={index}>
                      <th className="sticky left-0 px-4 py-3 text-sm font-semibold text-left z-[1000] max-w-[100px] min-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 bg-[#f8f8f8] h-[50px] uppercase">
                        ID
                      </th>
                      <th className="sticky left-0 px-4 py-3 text-sm font-semibold text-left z-[1000] max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 bg-[#f8f8f8] h-[50px] uppercase">
                        Họ tên nhân viên
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 bg-[#f8f8f8] h-[50px] uppercase">
                        Cơ sở
                      </th>
                      {user.Dates.map((date, i) => (
                        <th
                          className={clsx(
                            'capitalize px-4 py-3 font-semibold text-left min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 h-[50px] font-number text-sm',
                            (moment(date.Date).day() === 0 ||
                              moment(date.Date).day() === 6) &&
                              'bg-[#a0ffaf]'
                          )}
                          key={i}
                        >
                          <div className="flex flex-col w-full text-center">
                            <div>{moment(date.Date).format('ddd')}</div>
                            <div className="text-[13px] font-normal leading-3 mt-1">
                              {moment(date.Date).format('MM/YYYY')}
                            </div>
                          </div>
                        </th>
                      ))}
                      <th className="text-center sticky right-0 px-4 py-3 text-sm font-semibold z-[1000] max-w-[130px] min-w-[130px] border-b border-b-[#eee] border-l border-l-[#eee] bg-[#a0ffaf] h-[50px] uppercase">
                        Tổng cộng
                      </th>
                    </tr>
                  ))}
                </>
              )}
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.length > 0 && (
                <>
                  {data.map((user, index) => (
                    <tr key={index}>
                      <td className="h-[73px] sticky left-0 px-4 py-4 text-sm z-[999] font-medium bg-white max-w-[100px] min-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                        {user.UserID}
                      </td>
                      <td className="h-[73px] sticky left-0 px-4 py-4 text-sm z-[999] font-medium bg-white max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                        <div>{user.UserName}</div>
                        {!user.isDelete &&
                          user.StockID !== user.UserStockID && (
                            <div className="mt-1 text-[13px] font-light text-danger flex gap-2">
                              Khác điểm : {getStockByName(user.UserStockID)}
                            </div>
                          )}
                        {user.isDelete && (
                          <>
                            <div className="mt-1 text-[13px] font-light text-warning flex gap-2">
                              <ExclamationTriangleIcon className="w-5" />
                              Đã xoá hoặc chuyển cơ sở
                            </div>
                          </>
                        )}
                      </td>
                      <td className="h-[73px] px-4 py-4 text-sm font-medium bg-white max-w-[250px] min-w-[250px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0">
                        <div>{getStockByName(user.UserStockID)}</div>
                      </td>
                      {user.Dates.map((date, i) => (
                        <td
                          className="h-[73px] px-4 py-4 text-sm min-w-[100px] max-w-[100px] border-b border-b-[#eee] border-r border-r-[#eee] last:border-r-0 relative"
                          key={i}
                        >
                          {date?.WorkShiftType &&
                            date?.WorkShiftType.length > 0 && (
                              <div className="absolute top-0 left-0 flex w-full h-full z-1">
                                {date?.WorkShiftType.map((x, k) => (
                                  <div
                                    className="flex-1"
                                    style={{
                                      backgroundColor: x.Color
                                    }}
                                    key={k}
                                  ></div>
                                ))}
                              </div>
                            )}
                          <div
                            className={clsx(
                              'relative z-10 flex flex-col items-center justify-center w-full h-full',
                              date?.WorkShiftType &&
                                date?.WorkShiftType.some(
                                  x => x?.Symbol === 'DO' || x?.Symbol === 'ALL'
                                ) &&
                                'text-danger font-semibold text-base'
                            )}
                          >
                            <div>
                              {date?.WorkShiftType?.filter(x => x?.Symbol)
                                .map(x => x.Symbol)
                                .join(', ')}
                            </div>
                            {date?.WorkShiftType?.map(x =>
                              Number(x?.Hours || 0)
                            ).reduce((acc, curr) => acc + curr, 0) > 0 && (
                              <div>
                                {date?.WorkShiftType?.map(x =>
                                  Number(x?.Hours || 0)
                                ).reduce((acc, curr) => acc + curr, 0)}
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                      <td className="h-[73px] sticky right-0 px-4 py-4 text-sm z-[999] font-medium bg-[#a0ffaf] max-w-[130px] min-w-[130px] border-b border-b-[#eee] border-l border-l-[#eee] text-center">
                        {user.Dates.map(date =>
                          date?.WorkShiftType && date?.WorkShiftType.length > 0
                            ? date?.WorkShiftType?.map(x =>
                                Number(x?.Hours || 0)
                              ).reduce((acc, curr) => acc + curr, 0)
                            : 0
                        ).reduce((acc, curr) => acc + curr, 0)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ShiftWorkPreview
