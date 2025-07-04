import { PowerIcon } from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { toast } from 'react-toastify'
import UsersAPI from 'src/_ezs/api/users.api'
import WorksheetAPI from 'src/_ezs/api/workshee.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { DropdownStocks } from 'src/_ezs/layout/components/header/DropdownStocks'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { toAbsoluteAvatar, toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import CookieHelpers from 'src/_ezs/utils/CookieHelpers'
import Swal from 'sweetalert2'

function Home(props) {
  const { CrStocks, logout } = useAuth()
  const { GlobalConfig } = useLayout()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['Massage-Checkin', CrStocks],
    queryFn: async () => {
      let CrDate = moment().format('DD/MM/YYYY')
      if (GlobalConfig?.Admin?.checkout_time) {
        let now = moment()
        let CrOut = moment().set({
          hours: '00',
          minute: '00'
        })
        let CrOutEnd = moment().set({
          hours: GlobalConfig?.Admin?.checkout_time.split(';')[1].split(':')[0],
          minute: GlobalConfig?.Admin?.checkout_time.split(';')[1].split(':')[1]
        })

        if (now.isBetween(CrOut, CrOutEnd, null, '[]')) {
          CrDate = moment().subtract(1, 'days').format('DD/MM/YYYY')
        }
      }
      const { data } = await UsersAPI.listService({
        Key: '',
        StockID: CrStocks?.ID || CookieHelpers.get('StockID')
      })
      const rs = await WorksheetAPI.getAllWorkSheet({
        From: CrDate,
        To: CrDate,
        //StockID: CrStocks?.ID || CookieHelpers.get('StockID'),
        key: ''
      })
      let newRs = data?.data || []

      for (let m of rs?.data?.list || []) {
        let index = newRs.findIndex(x => x.id === m.UserID)

        if (index > -1) {
          newRs[index].Dates = m.Dates
          newRs[index].FullName = m.FullName
          newRs[index].StockID = m.StockID
          newRs[index].StockTitle = m.StockTitle
          newRs[index].UserID = m.UserID
          newRs[index].UserName = m.UserName
        }
      }
      newRs = newRs
        .map(item => ({
          ...item,
          Photo: item.photo,
          Order: item?.source?.Order
        }))
        .sort((a, b) => a.Order - b.Order)
      return newRs || []
    }
  })

  const updateMutation = useMutation({
    mutationFn: body => WorksheetAPI.checkinWorkSheet(body)
  })

  const onCheckIn = item => {
    if (
      item?.Dates[0]?.WorkTrack?.CheckIn &&
      item?.Dates[0]?.WorkTrack?.CheckOut
    )
      return

    let obj = {
      CheckIn: item?.Dates[0]?.WorkTrack?.CheckIn
        ? moment(item?.Dates[0]?.WorkTrack?.CheckIn).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : '',
      CheckOut: item?.Dates[0]?.WorkTrack?.CheckOut
        ? moment(item?.Dates[0]?.WorkTrack?.CheckOut).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : '',
      CreateDate: moment(item.Dates[0].Date).format('YYYY-MM-DD'),
      Info: {
        ...(item.Dates[0].WorkTrack?.Info || {})
      },
      StockID: item.StockID,
      UserID: item.UserID
    }

    let isOut = Boolean(item?.Dates[0]?.WorkTrack?.CheckIn)

    if (
      moment(item.Dates[0].Date).format('YYYY-MM-DD') !==
      moment().format('YYYY-MM-DD')
    ) {
      if (!isOut) {
        obj.CheckIn = moment()
          .subtract(1, 'days')
          .set({
            hour: '23',
            minute: '59',
            second: '59'
          })
          .format('YYYY-MM-DD HH:mm:ss')
        obj.Info['CheckInReality'] = moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        obj.CheckOut = moment()
          .subtract(1, 'days')
          .set({
            hour: '23',
            minute: '59',
            second: '59'
          })
          .format('YYYY-MM-DD HH:mm:ss')
        obj.Info['CheckOutReality'] = moment().format('YYYY-MM-DD HH:mm:ss')
      }
    } else {
      if (!isOut) {
        obj.CheckIn = moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        obj.CheckOut = moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }

    let values = {
      edit: [obj]
    }

    Swal.fire({
      customClass: {
        confirmButton: '!bg-primary'
      },
      title: isOut ? 'Xác nhận về ?' : 'Xác nhận đến ?',
      html: isOut
        ? `Hệ thống ghi nhận giờ về của bạn là <span class="text-danger font-medium font-number">${moment().format(
            'HH:mm'
          )}</span> ngày <span class="text-danger font-number font-medium">${moment().format(
            'DD/MM/YYYY'
          )}</span>`
        : `Hệ thống ghi nhận giờ đến của bạn là <span class="text-success font-medium font-number">${moment().format(
            'HH:mm'
          )}</span> ngày <span class="text-success font-number font-medium">${moment().format(
            'DD/MM/YYYY'
          )}</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isOut ? 'Xác nhận về' : 'Xác nhận đến',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await updateMutation.mutateAsync(values)
        await refetch()
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        toast.success('Thực hiện thành công.')
      }
    })
  }

  const onLogout = () => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Đăng xuất tài khoản',
      html: `Bạn đang muốn thực hiện đăng xuất tài khoản này. Vui lòng xác nhận đăng xuất ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        logout()
        return null
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
      }
    })
  }

  return (
    <div>
      <div className="flex justify-between flex-1 px-5 py-4 bg-white border-b border-separator dark:border-dark-separator">
        <div className="flex items-center">
          <DropdownStocks widthClass="max-w-[260px]" />
        </div>
        <div className="flex items-center">
          <div>
            <button
              type="button"
              className="flex items-center justify-center text-gray-700 transition rounded cursor-pointer dark:text-dark-muted w-11 h-11 hover:bg-light dark:hover:bg-dark-light hover:text-primary"
              onClick={onLogout}
            >
              <PowerIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 px-4 pt-10 pb-5 lg:pt-12 md:px-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-5 md:gap-y-11 gap-y-10">
        {!isLoading && (
          <>
            {data &&
              data.map((item, index) => (
                <div
                  className={clsx(
                    'border border-[#eaeaea] relative rounded min-h-[160px] cursor-pointer',
                    item?.Dates[0]?.WorkTrack?.CheckIn
                      ? 'bg-primary text-white'
                      : 'bg-warninglight'
                  )}
                  onClick={() => {
                    onCheckIn(item)
                  }}
                  key={index}
                >
                  <div className="absolute flex flex-col items-center justify-center w-full px-4 left-2/4 -translate-x-2/4 -top-5">
                    <div className="relative p-1 bg-white border rounded-full md:w-16 md:h-16 w-14 h-14 font-inter border-primary">
                      <div className="relative cursor-pointer aspect-square">
                        <img
                          className="object-cover object-top w-full h-full rounded-full"
                          src={toAbsoluteAvatar(item?.Photo, '/')}
                          alt={item.title}
                          onError={e => {
                            if (
                              e.target.src !==
                              toAbsoluteUrl('/assets/images/user/blank.png')
                            ) {
                              e.target.src = toAbsoluteUrl(
                                '/assets/images/user/blank.png'
                              )
                            }
                          }}
                          onClick={e => {
                            e.stopPropagation()
                            window.$.magnificPopup.open({
                              items: {
                                src: toAbsoluteAvatar(item?.Photo, '/')
                              },
                              type: 'image'
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2.5 font-medium text-center md:text-[15px] text-[14px]">
                      {item.FullName}
                    </div>
                  </div>
                  {item?.Dates[0]?.WorkTrack?.CheckIn && (
                    <div className="flex flex-col items-center justify-end h-full pb-4 text-[13px]">
                      <div>
                        <span>Đến lúc </span>
                        <span className="font-number">
                          {item?.Dates[0]?.WorkTrack?.Info?.CheckInReality
                            ? moment(
                                item?.Dates[0]?.WorkTrack?.Info?.CheckInReality,
                                'YYYY-MM-DD HH:mm'
                              ).format('HH:mm DD-MM-YYYY')
                            : moment(item?.Dates[0]?.WorkTrack?.CheckIn).format(
                                'HH:mm DD-MM-YYYY'
                              )}
                        </span>
                      </div>
                      {item?.Dates[0]?.WorkTrack?.CheckOut && (
                        <div className="mt-px">
                          <span>Về lúc </span>
                          <span className="font-number">
                            {item?.Dates[0]?.WorkTrack?.Info?.CheckOutReality
                              ? moment(
                                  item?.Dates[0]?.WorkTrack?.Info
                                    ?.CheckOutReality,
                                  'YYYY-MM-DD HH:mm'
                                ).format('HH:mm DD-MM-YYYY')
                              : moment(
                                  item?.Dates[0]?.WorkTrack?.CheckOut
                                ).format('HH:mm DD-MM-YYYY')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
        {isLoading && (
          <>
            {Array(5)
              .fill()
              .map((_, index) => (
                <div
                  className={clsx(
                    'animate-pulse border border-[#eaeaea] relative rounded min-h-[160px] cursor-pointer bg-warninglight'
                  )}
                  key={index}
                >
                  <div className="absolute flex flex-col items-center justify-center w-full px-4 left-2/4 -translate-x-2/4 -top-5">
                    <div className="relative w-16 h-16 p-1 bg-white border rounded-full font-inter border-primary">
                      <div className="relative cursor-pointer aspect-square">
                        <img
                          className="object-cover object-top w-full h-full rounded-full"
                          src={toAbsoluteUrl('/assets/images/user/blank.png')}
                          alt="Blank"
                        />
                      </div>
                    </div>
                    <div className="mt-2.5 font-medium text-center">
                      <div className="h-2.5 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
