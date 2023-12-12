import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))
const AddEdit = lazy(() => import('./pages/AddEdit'))

function NotificationsPage(props) {
  return (
    <Routes>
      <Route index element={<Navigate to="danh-sach" />} />
      <Route
        path="danh-sach"
        element={
          <SuspensedView>
            <Home />
          </SuspensedView>
        }
      >
        <Route
          path="them-moi"
          element={
            <SuspensedView>
              <AddEdit />
            </SuspensedView>
          }
        ></Route>
      </Route>
    </Routes>
  )
}

export default NotificationsPage
