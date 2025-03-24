import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))
// const SalesKPI = lazy(() => import('./pages/SalesKPI'))
// const SalesKPIClassify = lazy(() => import('./pages/SalesKPI/SalesKPIClassify'))
// const BusinessEstablishment = lazy(() =>
//   import('./pages/BusinessEstablishment')
// )

function UsersPage(props) {
  const { usrmng } = useRoles(['usrmng'])
  return (
    <Routes>
      <Route element={<RoleAccess roles={usrmng.hasRight} />}>
        <Route
          index
          element={
            <SuspensedView>
              <Home />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default UsersPage
