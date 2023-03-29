import React, { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'

import moment from 'moment'
import 'moment/locale/vi'
import { useWindowSize } from 'src/_ezs/hooks/useWindowSize'

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
          dateClick: ({ date }) => {},
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
                <span className="font-size-min gird-time font-number">
                  {text} {moment(date).format('A')}
                </span>
                <span className="font-size-min font-number w-55px d-block"></span>
              </>
            )
          },
          dayHeaderContent: ({ date, isToday, ...arg }) => {
            return (
              <div className="font-number">
                <div className={`date-mm ${isToday && 'text-primary'}`}>
                  {moment(date).format('ddd')}
                </div>
                <div
                  className={`w-40px h-40px d-flex align-items-center justify-content-center rounded-circle date-dd ${
                    isToday && 'bg-primary text-white'
                  }`}
                >
                  {moment(date).format('DD')}
                </div>
              </div>
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
          eventMaxStack: 8,
          slotLabelContent: ({ date, text }) => {
            return (
              <>
                <span className="font-size-min gird-time font-number">
                  {text} {moment(date).format('A')}
                </span>
                <span className="font-size-min font-number w-55px d-block"></span>
              </>
            )
          },
          dayHeaderContent: ({ date, isToday, ...arg }) => {
            return (
              <div className="font-number">
                <div className={`date-mm text-center`}>
                  {moment(date).format('ddd')}
                </div>
                <div
                  className={`w-40px h-40px d-flex align-items-center justify-content-center rounded-circle date-dd`}
                >
                  {moment(date).format('DD')}
                </div>
              </div>
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
                  <div class="truncate max-w-2/4 capitalize">${
                    extendedProps.MemberCurrent.FullName
                  }</div>
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
    />
  )
}

export { CalendarBody }
