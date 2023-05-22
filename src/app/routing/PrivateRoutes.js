import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from 'src/_ezs/layout/MasterLayout'
import SuspensedView from './SuspensedView'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const ProfilePage = lazy(() => import('../pages/Profile'))
const DashboardPage = lazy(() => import('../pages/Dashboard'))
const CalendarPage = lazy(() => import('../pages/Calendar'))
const ClientsPage = lazy(() => import('../pages/Clients'))
const AppointmentsPage = lazy(() => import('../pages/Appointments'))
const CataloguePage = lazy(() => import('../pages/Catalogue'))
const SettingsPage = lazy(() => import('../pages/Settings'))
const SearchPage = lazy(() => import('../pages/Search'))
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized'))

function PrivateRoutes(props) {
  const { pos_mng } = useRoles(['pos_mng'])
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
        <Route element={<RoleAccess roles={pos_mng.hasRight} />}>
          <Route
            path="calendar/*"
            element={
              <SuspensedView>
                <CalendarPage />
              </SuspensedView>
            }
          />
        </Route>

        <Route
          path="clients/*"
          element={
            <SuspensedView>
              <ClientsPage />
            </SuspensedView>
          }
        />
        <Route element={<RoleAccess roles={pos_mng.hasRight} />}>
          <Route
            path="appointments/*"
            element={
              <SuspensedView>
                <AppointmentsPage />
              </SuspensedView>
            }
          />
        </Route>
        <Route
          path="catalogue/*"
          element={
            <SuspensedView>
              <CataloguePage />
            </SuspensedView>
          }
        />
        <Route
          path="settings/*"
          element={
            <SuspensedView>
              <SettingsPage />
            </SuspensedView>
          }
        />
        <Route
          path="search"
          element={
            <SuspensedView>
              <SearchPage />
            </SuspensedView>
          }
        />
        <Route
          path="unauthorized"
          element={
            <SuspensedView>
              <UnauthorizedPage />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes
