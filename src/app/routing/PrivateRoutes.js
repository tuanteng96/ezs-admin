import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from 'src/_ezs/layout/MasterLayout'
import SuspensedView from './SuspensedView'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const ProfilePage = lazy(() => import('../pages/Profile'))
const DashboardPage = lazy(() => import('../pages/Dashboard'))
const CalendarPage = lazy(() => import('../pages/Calendar'))
const BannersPage = lazy(() => import('../pages/Banners'))
const PostsPage = lazy(() => import('../pages/Posts'))
const ClientsPage = lazy(() => import('../pages/Clients'))
const AppointmentsPage = lazy(() => import('../pages/Appointments'))
const CataloguePage = lazy(() => import('../pages/Catalogue'))
const NotificationsPage = lazy(() => import('../pages/Notifications'))
const SettingsPage = lazy(() => import('../pages/Settings'))
const ElectronicInvoicePage = lazy(() => import('../pages/ElectronicInvoice'))
const SearchPage = lazy(() => import('../pages/Search'))
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized'))

function PrivateRoutes(props) {
  const { pos_mng, notification, thu_chi } = useRoles([
    'pos_mng',
    'notification',
    'thu_chi'
  ])

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
        <Route path="banners/*" element={<BannersPage />} />
        <Route path="posts/*" element={<PostsPage />} />
        <Route path="catalogue/*" element={<CataloguePage />} />
        <Route element={<RoleAccess roles={thu_chi.hasRight} />}>
          <Route
            path="electronic-invoice/*"
            element={<ElectronicInvoicePage />}
          />
        </Route>

        <Route element={<RoleAccess roles={notification.hasRight} />}>
          <Route
            path="notifications/*"
            element={
              <SuspensedView>
                <NotificationsPage />
              </SuspensedView>
            }
          />
        </Route>
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
