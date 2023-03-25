import React from 'react'
import { createSearchParams, Link, useLocation } from 'react-router-dom'
import useQueryString from 'src/_ezs/hooks/useQueryString'
import CalendarHeader from './components/CalendarHeader/CalendarHeader'

export default function CalendarPage() {
  //console.log(useQueryString())
  const { pathname } = useLocation()
  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <div className="bg-white dark:bg-dark-app grow">
        Page Calendar
        <Link
          type="button"
          to={{
            path: pathname,
            search: createSearchParams({
              stockid: 8795,
              name: 'Nguyễn Tuấn'
            }).toString()
          }}
        >
          Click
        </Link>
      </div>
    </div>
  )
}
