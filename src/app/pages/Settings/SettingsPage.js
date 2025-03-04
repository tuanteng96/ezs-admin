import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))
const SalesKPI = lazy(() => import('./pages/SalesKPI'))
const SalesKPIClassify = lazy(() => import('./pages/SalesKPI/SalesKPIClassify'))
const BusinessEstablishment = lazy(() =>
  import('./pages/BusinessEstablishment')
)

function SettingsPage(props) {
  const { kpi_doanhso, kho } = useRoles(['kpi_doanhso', 'kho'])
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
      <Route element={<RoleAccess roles={kpi_doanhso.hasRight} />}>
        <Route
          path="sales-kpi"
          element={
            <SuspensedView>
              <SalesKPI />
            </SuspensedView>
          }
        >
          <Route
            path="classify"
            element={
              <SuspensedView>
                <SalesKPIClassify />
              </SuspensedView>
            }
          />
        </Route>
      </Route>
      <Route element={<RoleAccess roles={kho.hasRight} />}>
        <Route
          path="business-establishment"
          element={
            <SuspensedView>
              <BusinessEstablishment />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default SettingsPage
