import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))
const ShiftWork = lazy(() => import('./pages/ShiftWork'))
const ShiftWorkPreview = lazy(() => import('./pages/ShiftWorkPreview'))
const ExtraSalary = lazy(() => import('./pages/ExtraSalary'))
const SalesKPI = lazy(() => import('./pages/SalesKPI'))
const PointVoucher = lazy(() => import('./pages/PointVoucher'))
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
      <Route
        path="shift-work/:month"
        element={
          <SuspensedView>
            <ShiftWorkPreview />
          </SuspensedView>
        }
      />
      <Route
        path="shift-work"
        element={
          <SuspensedView>
            <ShiftWork />
          </SuspensedView>
        }
      />
      <Route
        path="extra-salary"
        element={
          <SuspensedView>
            <ExtraSalary />
          </SuspensedView>
        }
      />
      <Route
        path="point-voucher"
        element={
          <SuspensedView>
            <PointVoucher />
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
