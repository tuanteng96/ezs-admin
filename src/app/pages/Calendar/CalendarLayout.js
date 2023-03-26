import React, { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router'

const CalendarContext = createContext()

const useCalendar = () => {
  return useContext(CalendarContext)
}

const CalendarLayout = ({ children }) => {
  const [addEditCalendar, setAddEditCalendar] = useState({
    isShowing: false,
    initialValues: null
  })

  const openAddEditCalendar = values => {
    setAddEditCalendar(prevState => ({
      ...prevState,
      isShowing: true,
      initialValues: values || null
    }))
  }

  const hideAddEditCalendar = () => {
    setAddEditCalendar(prevState => ({
      ...prevState,
      isShowing: false,
      initialValues: null
    }))
  }
  return (
    <CalendarContext.Provider
      value={{ addEditCalendar, openAddEditCalendar, hideAddEditCalendar }}
    >
      <Outlet />
    </CalendarContext.Provider>
  )
}

export { CalendarLayout, useCalendar }
