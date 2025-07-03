import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { toast } from 'react-toastify'
import UsersAPI from 'src/_ezs/api/users.api'
import WorksheetAPI from 'src/_ezs/api/workshee.api'
import { useAuth } from 'src/_ezs/core/Auth'
import { toAbsoluteAvatar, toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import CookieHelpers from 'src/_ezs/utils/CookieHelpers'
import Swal from 'sweetalert2'

function CheckIn(props) {
  //StockID
  const { CrStocks } = useAuth()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['Massage-Checkin', CrStocks],
    queryFn: async () => {
      const { data } = await UsersAPI.listService({
        Key: '',
        StockID: CrStocks?.ID || CookieHelpers.get('StockID')
      })
      const rs = await WorksheetAPI.getAllWorkSheet({
        From: moment().format('DD/MM/YYYY'),
        To: moment().format('DD/MM/YYYY'),
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
    let isOut = Boolean(item?.Dates[0]?.WorkTrack?.CheckIn)

    let values = {
      edit: [
        {
          CheckIn: !isOut
            ? moment(item.Dates[0].Date)
                .set({
                  hour: moment().get('hour'),
                  minute: moment().get('minute'),
                  second: moment().get('second')
                })
                .format('YYYY-MM-DD HH:mm:ss')
            : moment(item?.Dates[0]?.WorkTrack?.CheckIn).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
          CheckOut: isOut
            ? moment(item.Dates[0].Date)
                .set({
                  hour: moment().get('hour'),
                  minute: moment().get('minute'),
                  second: moment().get('second')
                })
                .format('YYYY-MM-DD HH:mm:ss')
            : '',
          CreateDate: moment(item.Dates[0].Date).format('YYYY-MM-DD'),
          Info: {},
          StockID: item.StockID,
          UserID: item.UserID
        }
      ]
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

  return (
    <div>
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
                          {moment(item?.Dates[0]?.WorkTrack?.CheckIn).format(
                            'HH:mm'
                          )}
                        </span>
                      </div>
                      {item?.Dates[0]?.WorkTrack?.CheckOut && (
                        <div className="mt-px">
                          <span>Về lúc </span>
                          <span className="font-number">
                            {moment(item?.Dates[0]?.WorkTrack?.CheckOut).format(
                              'HH:mm'
                            )}
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

export default CheckIn
