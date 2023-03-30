import React, { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useWindowSize } from 'src/_ezs/hooks/useWindowSize'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { isEmpty, omitBy } from 'lodash'
import clsx from 'clsx'

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
  noEventsText: 'Không có dịch vụ'
}

function CalendarBody({ queryConfig, MemberBookings }) {
  const calendarRef = useRef('')
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { width } = useWindowSize()
  useEffect(() => {
    if (calendarRef?.current?.getApi()) {
      let calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(queryConfig.view)
    }
  }, [calendarRef, queryConfig.view])

  return (
    <FullCalendar
      themeSystem="unthemed"
      locale={viLocales}
      headerToolbar={false}
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
      initialView={queryConfig.view}
      handleWindowResize={true}
      aspectRatio="3"
      editable={false}
      navLinks={true}
      ref={calendarRef}
      events={MemberBookings?.data?.data}
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
          }
          // slotMinTime: TimeOpen,
          // slotMaxTime: TimeClose
        },
        timeGridWeek: {
          allDaySlot: false,
          eventMaxStack: 2,
          duration: { days: width > 991 ? 6 : 3 },
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
                <div className="text-sm mb-1">{moment(date).format('ddd')}</div>
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
          dateClick: ({ date }) => {}
          // slotMinTime: TimeOpen,
          // slotMaxTime: TimeClose
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
                <div className="text-sm mb-1">{moment(date).format('ddd')}</div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white">
                  {moment(date).format('DD')}
                </div>
              </>
            )
          },
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          slotMinWidth: '50',
          dateClick: ({ date }) => {}
          // slotMinTime: TimeOpen,
          // slotMaxTime: TimeClose
        },
        resourceTimeGridDay: {
          type: 'resourceTimeline',
          buttonText: 'Nhân viên',
          resourceAreaHeaderContent: () => 'Nhân viên',
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          resourceAreaWidth: '300px',
          stickyHeaderDates: true
          // slotMinTime: TimeOpen,
          // slotMaxTime: TimeClose
        },
        resourceTimelineDay: {
          type: 'resourceTimeline',
          buttonText: 'Nhân viên',
          resourceAreaHeaderContent: () =>
            width > 1200 ? 'Nhân viên' : 'N.Viên',
          nowIndicator: true,
          now: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          scrollTime: moment(new Date()).format('HH:mm'),
          resourceAreaWidth: width > 767 ? '180px' : '70px',
          slotMinWidth: width > 767 ? '60' : '35',
          dateClick: ({ date }) => {}
          // resourceLabelDidMount: ({ el, fieldValue, ...arg }) => {
          //   el.querySelector(
          //     '.fc-datagrid-cell-main'
          //   ).innerHTML = `${GenerateName(fieldValue)}`
          // },
          // slotLabelDidMount: ({ text, date, el, ...arg }) => {
          //   el.querySelector(
          //     '.fc-timeline-slot-cushion'
          //   ).innerHTML = `<span class="gird-time font-number">
          //               ${text} ${moment(date).format('A')}
          //             </span>`
          // },
          // slotMinTime: TimeOpen,
          // slotMaxTime: TimeClose
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
            italicEl.innerHTML = `
              <div class="fc-title">
                <div class="flex">
                  ${
                    extendedProps.AtHome
                      ? `<div class="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>`
                      : ''
                  }
                  <div class="truncate max-w-2/4 capitalize">
                    ${
                      extendedProps.Star
                        ? `<span class="pr-[2px]">${extendedProps.Star}</span>`
                        : ''
                    }
                    ${extendedProps.MemberCurrent.FullName}
                  </div>
                  <div class="px-[3px]">-</div>
                  <div>${extendedProps.MemberCurrent.MobilePhone}</div>
                </div>
                <div class="flex">
                  <div>
                    ${moment(extendedProps.BookDate).format('HH:mm')}
                  </div>
                  <div class="px-[3px]">-</div>
                  <div>
                    ${
                      extendedProps.RootTitles
                        ? extendedProps.RootMinutes ??
                          extendedProps?.os?.RootMinutes ??
                          60
                        : 30
                    }p
                  </div>
                  <div class="px-[3px]">-</div>
                  <div class="flex">
                    <span>${extendedProps?.BookCount?.Done || 0}</span>
                    <span class="px2">/</span>
                    <span>${extendedProps?.BookCount?.Total || 0}</span>
                  </div>
                </div>
                <div class="truncate">${
                  extendedProps.RootTitles || 'Không xác định'
                }</div>
              </div>`
          } else {
            italicEl.innerHTML = `<div class="fc-title">
                    <div><span class="fullname">${
                      extendedProps.AtHome
                        ? `<i class="fas fa-home font-size-xs"></i>`
                        : ''
                    } ${extendedProps.Star ? `(${extendedProps.Star})` : ''} ${
              extendedProps.MemberCurrent.FullName
            }</span><span class="d-none d-md-inline"> - ${
              extendedProps.MemberCurrent?.MobilePhone
            }</span><span> - ${
              extendedProps.RootTitles
                ? extendedProps.RootMinutes ??
                  extendedProps?.os?.RootMinutes ??
                  60
                : 30
            }p - ${
              extendedProps.RootTitles || 'Không xác định'
            }</span> <span class="${!extendedProps.isBook && 'd-none'}">- ${
              extendedProps?.BookCount?.Done || 0
            }/${extendedProps?.BookCount?.Total || 0}</span></div>
                  </div>`
          }
        } else {
          italicEl.innerHTML = `<div class="fc-title">
                    Không có lịch
                  </div>`
        }
        let arrayOfDomNodes = [italicEl]
        return {
          domNodes: arrayOfDomNodes
        }
      }}
      eventClick={({ event, el }) => {
        const { _def } = event
        const { extendedProps } = _def
        if (_def.extendedProps.os) {
          return
        }
        let formState = {
          MemberIDs: extendedProps.Member,
          AtHome: extendedProps.AtHome,
          Desc: extendedProps.Desc,
          Status: extendedProps.Status,
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
    />
  )
}

export { CalendarBody }
