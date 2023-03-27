import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from 'src/_ezs/layout/MasterLayout'
import SuspensedView from './SuspensedView'

const ProfilePage = lazy(() => import('../pages/Profile'))
const DashboardPage = lazy(() => import('../pages/Dashboard'))
const CalendarPage = lazy(() => import('../pages/Calendar'))
const ClientsPage = lazy(() => import('../pages/Clients'))
const AppointmentsPage = lazy(() => import('../pages/Appointments'))

function PrivateRoutes(props) {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="auth/*" element={<Navigate to="/dashboard" />} />
        <Route
          path="profile"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="dashboard"
          element={
            <SuspensedView>
              <DashboardPage />
            </SuspensedView>
          }
        />
        <Route
          path="calendar/*"
          element={
            <SuspensedView>
              <CalendarPage />
            </SuspensedView>
          }
        />
        <Route
          path="clients/*"
          element={
            <SuspensedView>
              <ClientsPage />
            </SuspensedView>
          }
        />
        <Route
          path="appointments/*"
          element={
            <SuspensedView>
              <AppointmentsPage />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes
