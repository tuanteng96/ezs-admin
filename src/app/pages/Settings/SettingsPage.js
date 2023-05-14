import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))
const SalesKPI = lazy(() => import('./pages/SalesKPI'))

function SettingsPage(props) {
  return (
    <Routes>
      <Route
        index
        element={
          <SuspensedView>
            <Home />
          </SuspensedView>
        }
      />
      <Route
        path="sales-kpi"
        element={
          <SuspensedView>
            <SalesKPI />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

export default SettingsPage
