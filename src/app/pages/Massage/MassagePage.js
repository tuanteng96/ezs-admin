import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const CheckIn = lazy(() => import('./pages/CheckIn'))

function MassagePage(props) {
  return (
    <Routes>
      <Route>
        <Route
          index
          element={
            <SuspensedView>
              <CheckIn />
            </SuspensedView>
          }
        />
        <Route
          path="checkin"
          element={
            <SuspensedView>
              <CheckIn />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default MassagePage
