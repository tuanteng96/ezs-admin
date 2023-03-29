import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const AppointmentAddEdit = lazy(() => import('./pages/AddEdit'))

function AppointmentsPage(props) {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/calendar" />} />
        <Route
          path="new"
          element={
            <SuspensedView>
              <AppointmentAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path="edit/:id"
          element={
            <SuspensedView>
              <AppointmentAddEdit />
            </SuspensedView>
          }
        />
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </>
  )
}

export default AppointmentsPage
