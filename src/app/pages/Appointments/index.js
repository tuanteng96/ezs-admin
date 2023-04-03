import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const AppointmentsAddEdit = lazy(() => import('./pages/AddEdit'))
const AppointmentsOsAddEdit = lazy(() => import('./pages/OsAddEdit'))

function AppointmentsPage(props) {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/calendar" />} />
        <Route
          path="new"
          element={
            <SuspensedView>
              <AppointmentsAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path="edit/:id"
          element={
            <SuspensedView>
              <AppointmentsAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path="os/:id"
          element={
            <SuspensedView>
              <AppointmentsOsAddEdit />
            </SuspensedView>
          }
        />
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </>
  )
}

export default AppointmentsPage
