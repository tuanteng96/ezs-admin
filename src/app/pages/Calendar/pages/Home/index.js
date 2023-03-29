import React from 'react'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import { CalendarHeader } from '../../components/CalendarHeader/CalendarHeader'
import { CalendarBody } from '../../components/CalendarBody/CalendarBody'
import MembersAPI from 'src/_ezs/api/members.api'
import { useQuery } from '@tanstack/react-query'

import moment from 'moment'
import 'moment/locale/vi'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'

moment.locale('vi')

const getQueryParams = queryConfig => {
  let params = {
    From: moment(moment(queryConfig.day, 'YYYY-MM-DD')),
    To: moment(moment(queryConfig.day, 'YYYY-MM-DD'))
  }
  if (queryConfig.view === 'dayGridMonth') {
    params.From = params.From.startOf('month').format('YYYY-MM-DD')
    params.To = params.To.endOf('month').format('YYYY-MM-DD')
  }

  return params
}

const getStatusClass = (Status, item) => {
  const isAuto =
    item?.Desc && item.Desc.toUpperCase().indexOf('TỰ ĐỘNG ĐẶT LỊCH')
  if (Status === 'XAC_NHAN') {
    if (isAuto !== '' && isAuto > -1) return 'primary1'
    return 'primary'
  }
  if (Status === 'CHUA_XAC_NHAN') {
    return 'warning'
  }
  if (Status === 'KHACH_KHONG_DEN') {
    return 'danger'
  }
  if (Status === 'KHACH_DEN') {
    return 'success'
  }
  if (Status === 'doing') {
    return 'info'
  }
  if (Status === 'done') {
    return 'secondary'
  }
}

const checkStar = item => {
  if (item?.Member?.MobilePhone !== '0000000000') return ''
  if (item?.Member?.MobilePhone === '0000000000' && item?.IsNew) return '**'
  else {
    return '*'
  }
}

function Home(props) {
  const queryParams = useQueryParams()
  const queryConfig = {
    view: queryParams?.view || 'dayGridMonth',
    day: queryParams?.day || moment().format('YYYY-MM-DD')
  }

  const MembersBookings = useQuery({
    queryKey: ['MembersBookings', queryConfig],
    queryFn: async () => {
      const { data } = await MembersAPI.memberBookings({
        ...getQueryParams(queryConfig)
      })
      const dataBooks =
        data.books && Array.isArray(data.books)
          ? data.books
              .map(item => ({
                ...item,
                start: item.BookDate,
                end: moment(item.BookDate)
                  .add(item.RootMinutes ?? 60, 'minutes')
                  .toDate(),
                title: item.RootTitles,
                className: `fc-${getStatusClass(
                  item.Status,
                  item
                )} shadow-lg rounded !mb-1.5 !mt-0 !ml-0 !mr-0 p-3 text-white`,
                resourceIds:
                  item.UserServices &&
                  Array.isArray(item.UserServices) &&
                  item.UserServices.length > 0
                    ? item.UserServices.map(item => item.ID)
                    : [],
                MemberCurrent: {
                  FullName:
                    item?.IsAnonymous ||
                    item.Member?.MobilePhone === '0000000000'
                      ? item?.FullName
                      : item?.Member?.FullName,
                  MobilePhone:
                    item?.IsAnonymous ||
                    item.Member?.MobilePhone === '0000000000'
                      ? item?.Phone
                      : item?.Member?.MobilePhone
                },
                Star: checkStar(item),
                isBook: true
              }))
              .filter(item => item.Status !== 'TU_CHOI')
          : []
      const dataBooksAuto =
        data.osList && Array.isArray(data.osList)
          ? data.osList.map(item => ({
              ...item,
              AtHome: false,
              Member: item.member,
              MemberCurrent: {
                FullName: item?.member?.FullName,
                MobilePhone: item?.member?.MobilePhone
              },
              start: item.os.BookDate,
              end: moment(item.os.BookDate)
                .add(item.os.RootMinutes ?? 60, 'minutes')
                .toDate(),
              BookDate: item.os.BookDate,
              title: item.os.Title,
              RootTitles: item.os.ProdService2 || item.os.ProdService,
              className: `fc-${getStatusClass(
                item.os.Status,
                item
              )} shadow-lg rounded !mb-1.5 !mt-0 !ml-0 !mr-0 p-3 text-white`,
              resourceIds:
                item.staffs && Array.isArray(item.staffs)
                  ? item.staffs.map(staf => staf.ID)
                  : []
            }))
          : []
      return {
        data: [...dataBooks, ...dataBooksAuto],
        userOffline: data?.dayOffs ?? []
      }
    }
  })

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader queryConfig={queryConfig} />
      <div className="bg-white dark:bg-dark-aside h-[calc(100%-77px)]">
        <CalendarBody
          queryConfig={queryConfig}
          MemberBookings={MembersBookings}
        />
        <LoadingComponentFull
          bgClassName="bg-transparent z-[10]"
          loading={MembersBookings.isLoading}
        />
      </div>
    </div>
  )
}

export default Home
