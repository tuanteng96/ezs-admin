import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

// const ClientList = lazy(() => import('./pages/Home'))
const ClientAddEdit = lazy(() => import('./pages/AddEdit'))

function ClientsPage(props) {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/calendar" />} />
        {/* <Route
          path="lists"
          element={
            <SuspensedView>
              <ClientList />
            </SuspensedView>
          }
        /> */}
        <Route
          path="add"
          element={
            <SuspensedView>
              <ClientAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path="edit/:id"
          element={
            <SuspensedView>
              <ClientAddEdit />
            </SuspensedView>
          }
        />
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </>
  )
}

export default ClientsPage
