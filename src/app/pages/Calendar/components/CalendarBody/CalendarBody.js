import React, { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import scrollGridPlugin from '@fullcalendar/scrollgrid'
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { isEmpty, omitBy } from 'lodash'
import clsx from 'clsx'
import { formatString } from 'src/_ezs/utils/formatString'
import { useAuth } from 'src/_ezs/core/Auth'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const viLocales = {
  code: 'vi',
  week: {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  },
  buttonText: {
    prev: 'Tháng trước',
    next: 'Tháng sau',
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    list: 'Danh sách',
    timeGridWeek: 'Tuần'
  },
  weekText: 'Sm',
  allDayText: 'Cả ngày',
  moreLinkText: 'Xem thêm',
  noEventsText: 'Không có dữ liệu'
}

let TimeOpen = '10:00:00'
let TimeClose = '21:00:00'

function CalendarBody({ queryConfig, MemberBookings, Resources }) {
  const { CrStocks } = useAuth()
  const calendarRef = useRef('')
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (calendarRef?.current?.getApi()) {
      let calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(queryConfig.view)
    }
  }, [calendarRef, queryConfig.view])

  useEffect(() => {
    if (calendarRef?.current?.getApi()) {
      let calendarApi = calendarRef.current.getApi()
      calendarApi.gotoDate(queryConfig.day)
    }
  }, [calendarRef, queryConfig.day])

  return (
    <FullCalendar
      firstDay={1}
      schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
      themeSystem="unthemed"
      locale={viLocales}
      headerToolbar={false}
      plugins={[
        dayGridPlugin,
        interactionPlugin,
        timeGridPlugin,
        listPlugin,
        resourceTimeGridPlugin,
        scrollGridPlugin
      ]}
      initialDate={queryConfig.day}
      initialView={queryConfig.view}
      handleWindowResize={true}
      aspectRatio="3"
      editable={false}
      navLinks={true}
      ref={calendarRef}
      events={MemberBookings?.data?.data || []}
      resources={Resources?.data || []}
      views={{
        dayGridMonth: {
          dayMaxEvents: 2,
          dateClick: ({ date }) => {
            navigate(
              `/appointments/new?date=${moment(date).format('DD-MM-YYYY')}`,
              {
                state: {
                  previousPath: pathname + search
                }
              }
            )
          },
          dayHeaderContent: ({ date, text }) => {
            return moment(date).format('dddd')
          },
          slotMinTime: TimeOpen,
          slotMaxTime: TimeClose
        },
        timeGridWeek: {
          allDaySlot: false,
          eventMaxStack: 2,
          slotLabelContent: ({ date, text }) => {
            return (
              <>
                <span className="text-[11px] font-medium text-[#70757a] absolute -top-[11px] bg-white dark:bg-dark-aside left-0 pl-4 pr-1.5 font-inter dark:text-gray-400">
                  {text} {moment(date).format('A')}
                </span>
                <span className="block w-14"></span>
              </>
            )
          },
          dayHeaderContent: ({ date, isToday, ...arg }) => {
            return (
              <>
                <div className="mb-1 text-sm">{moment(date).format('ddd')}</div>
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isToday
                      ? 'bg-primary text-white'
                      : 'bg-primarylight text-primary'
                  )}
                >
                  {moment(date).format('DD')}
                </div>
              </>
            )
          },
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          dateClick: ({ date }) => {
            navigate(`/appointments/new`, {
              state: {
                previousPath: pathname + search,
                formState: {
                  MemberIDs: '',
                  AtHome: false,
                  Desc: '',
                  booking: [
                    {
                      BookDate: moment(date).toDate(),
                      Time: moment(date).toDate(),
                      Desc: '',
                      IsAnonymous: false,
                      MemberID: '',
                      RootIdS: '',
                      Status: 'XAC_NHAN',
                      StockID: CrStocks.ID,
                      UserServiceIDs: ''
                    }
                  ]
                }
              }
            })
          },
          duration: { weeks: 1 },
          slotMinTime: TimeOpen,
          slotMaxTime: TimeClose
        },
        timeGridDay: {
          allDaySlot: false,
          eventMaxStack: 8,
          slotLabelContent: ({ date, text }) => {
            return (
              <>
                <span className="dark:text-gray-400 text-[11px] font-medium text-[#70757a] dark:bg-dark-aside absolute -top-[11px] bg-white left-0 pl-4 pr-1.5 font-inter">
                  {text} {moment(date).format('A')}
                </span>
                <span className="block w-14"></span>
              </>
            )
          },
          dayHeaderContent: ({ date, isToday, ...arg }) => {
            return (
              <>
                <div className="mb-1 text-sm">{moment(date).format('ddd')}</div>
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary">
                  {moment(date).format('DD')}
                </div>
              </>
            )
          },
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          slotMinWidth: '50',
          dateClick: ({ date }) => {
            navigate(`/appointments/new`, {
              state: {
                previousPath: pathname + search,
                formState: {
                  MemberIDs: '',
                  AtHome: false,
                  Desc: '',
                  booking: [
                    {
                      BookDate: moment(date).toDate(),
                      Time: moment(date).toDate(),
                      Desc: '',
                      IsAnonymous: false,
                      MemberID: '',
                      RootIdS: '',
                      Status: 'XAC_NHAN',
                      StockID: CrStocks.ID,
                      UserServiceIDs: ''
                    }
                  ]
                }
              }
            })
          },
          slotMinTime: TimeOpen,
          slotMaxTime: TimeClose
        },
        resourceTimeGridDay: {
          dayMinWidth: 300,
          allDaySlot: false,
          type: 'resourceTimeline',
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          resourceAreaWidth: '300px',
          stickyHeaderDates: true,
          slotLabelContent: ({ date, text }) => {
            return (
              <>
                <span className="text-[11px] font-medium text-[#70757a] absolute -top-[11px] bg-white dark:bg-dark-aside left-0 pl-4 pr-1.5 font-inter dark:text-gray-400">
                  {text} {moment(date).format('A')}
                </span>
                <span className="block w-14"></span>
              </>
            )
          },
          resourceLabelContent: ({ resource }) => {
            return (
              <Link to="/" className="flex flex-col items-center">
                <div className="p-1 border rounded-full w-14 h-14 font-inter border-primary">
                  <div className="flex items-center justify-center w-full h-full rounded-full bg-primarylight text-primary">
                    {formatString.getLastFirst(resource._resource.title)}
                  </div>
                </div>
                <div className="mt-2 text-[13px]">
                  {resource._resource.title}
                </div>
              </Link>
            )
          },
          dateClick: ({ date, resource, jsEvent, ...args }) => {
            if (!jsEvent.target.classList.contains('fc-no-event')) {
              navigate(`/appointments/new`, {
                state: {
                  previousPath: pathname + search,
                  formState: {
                    MemberIDs: '',
                    AtHome: false,
                    Desc: '',
                    booking: [
                      {
                        BookDate: moment(date).toDate(),
                        Time: moment(date).toDate(),
                        Desc: '',
                        IsAnonymous: false,
                        MemberID: '',
                        RootIdS: '',
                        Status: 'XAC_NHAN',
                        StockID: CrStocks.ID,
                        UserServiceIDs: [
                          {
                            label: resource._resource.title,
                            value: resource._resource.id
                          }
                        ]
                      }
                    ]
                  }
                }
              })
            }
          },
          slotMinTime: TimeOpen,
          slotMaxTime: TimeClose
        }
      }}
      eventContent={arg => {
        const { event, view } = arg
        const { extendedProps } = event._def
        let italicEl = document.createElement('div')
        italicEl.classList.add('fc-content')
        if (
          typeof extendedProps !== 'object' ||
          Object.keys(extendedProps).length > 0
        ) {
          if (view.type !== 'listWeek') {
            if (!extendedProps.noEvent) {
              italicEl.innerHTML = `
              <div class="fc-title">
                <div class="flex">
                  ${
                    extendedProps?.AtHome
                      ? `<div class="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>`
                      : ''
                  }
                  <div class="truncate max-w-2/4 capitalize">
                    ${
                      extendedProps?.Star
                        ? `<span class="pr-[2px]">(${extendedProps?.Star})</span>`
                        : ''
                    }
                    ${
                      extendedProps?.MemberCurrent?.FullName ||
                      'Chưa xác định tên'
                    }
                  </div>
                  <div class="px-[3px]">-</div>
                  <div class="truncate">${
                    extendedProps?.MemberCurrent?.MobilePhone ||
                    'Chưa xác định số'
                  }</div>
                </div>
                <div class="flex items-center">
                  <div>
                    ${moment(extendedProps?.BookDate).format('HH:mm')}
                  </div>
                  <div class="px-[3px]">-</div>
                  <div class="truncate capitalize pr-1">${
                    extendedProps.RootTitles || 'Chưa chọn dịch vụ'
                  }</div>
                  <div class="flex text-xs">
                    (<span>${extendedProps?.BookCount?.Done || 0}</span>
                    <span class="px2">/</span>
                    <span>${extendedProps?.BookCount?.Total || 0}</span>)
                  </div>
                </div>
              </div>`
            }
          } else {
            italicEl.innerHTML = `<div class="fc-title">
                    <div><span class="fullname">${
                      extendedProps?.AtHome
                        ? `<i class="fas fa-home font-size-xs"></i>`
                        : ''
                    } ${
              extendedProps?.Star ? `(${extendedProps?.Star})` : ''
            } ${
              extendedProps?.MemberCurrent?.FullName || 'Chưa xác định tên'
            }</span><span class="d-none d-md-inline"> - ${
              extendedProps?.MemberCurrent?.MobilePhone || 'Chưa xác định số'
            }</span> 
              <div class="flex">
                <div class="truncate capitalize">${
                  extendedProps.RootTitles || 'Chưa chọn dịch vụ'
                }</div>
              <span class="${!extendedProps?.isBook && 'd-none'} pl-1">- ${
              extendedProps?.BookCount?.Done || 0
            }/${extendedProps?.BookCount?.Total || 0}</span>
              </div>
            </div>
            </div>`
          }
        } else {
          italicEl.innerHTML = `<div>Chưa có lịch.</div>`
        }
        let arrayOfDomNodes = [italicEl]
        return {
          domNodes: arrayOfDomNodes
        }
      }}
      eventClick={({ event, el }) => {
        const { _def } = event
        const { extendedProps } = _def
        if (extendedProps?.os) {
          navigate(`/appointments/os/${extendedProps.os.ID}`, {
            state: {
              previousPath: pathname + search,
              formState: null
            }
          })
        } else {
          if (!extendedProps.noEvent) {
            let formState = {
              MemberIDs: extendedProps.Member,
              AtHome: extendedProps.AtHome,
              Desc: extendedProps.Desc,
              Status: extendedProps.Status,
              FullName: extendedProps?.FullName || '',
              Phone: extendedProps.Phone || '',
              UserName: extendedProps.UserName,
              ID: extendedProps.ID || 0,
              BookCount: extendedProps?.BookCount || null,
              MemberPhone: extendedProps?.MemberPhone,
              booking: [
                {
                  ID: extendedProps.ID,
                  BookDate: new Date(extendedProps.BookDate),
                  Time: new Date(extendedProps.BookDate),
                  Desc: '',
                  IsAnonymous: false,
                  MemberID: '',
                  RootIdS:
                    extendedProps.Roots && extendedProps.Roots.length > 0
                      ? extendedProps.Roots.map(x => ({
                          ...x,
                          value: x.ID,
                          label: x.Title
                        }))
                      : [],
                  Status: extendedProps.Status,
                  StockID: extendedProps?.Stock?.ID,
                  UserServiceIDs:
                    extendedProps.UserServices &&
                    extendedProps.UserServices.length > 0
                      ? extendedProps.UserServices.map(x => ({
                          ...x,
                          value: x.ID,
                          label: x.FullName
                        }))
                      : []
                }
              ]
            }
            navigate(`/appointments/edit/${extendedProps.ID}`, {
              state: {
                previousPath: pathname + search,
                formState
              }
            })
          }
        }
      }}
      datesSet={({ view, start, ...arg }) => {
        if (view.type !== queryConfig.view) {
          let newView = view.type
          if (view.type === 'dayGridDay') {
            newView = 'timeGridDay'
          }
          navigate({
            pathname: pathname,
            search: createSearchParams(
              omitBy(
                {
                  ...queryConfig,
                  view: newView,
                  day: moment(start).format('YYYY-MM-DD')
                },
                isEmpty
              )
            ).toString()
          })
        }
      }}
      noEventsContent={() => !MemberBookings.isLoading && 'Không có dữ liệu'}
    />
  )
}

export { CalendarBody }
