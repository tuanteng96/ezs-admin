import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import { CalendarLayout } from './CalendarLayout'

const Home = lazy(() => import('./pages/Home'))

export default function CalendarPage() {
  return (
    <Routes>
      <Route element={<CalendarLayout />}>
        <Route
          index
          element={
            <SuspensedView>
              <Home />
            </SuspensedView>
          }
        />
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Route>
    </Routes>
  )
}
