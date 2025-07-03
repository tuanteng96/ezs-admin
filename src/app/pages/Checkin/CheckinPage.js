import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Home = lazy(() => import('./pages/Home'))

function CheckinPage(props) {
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
    </Routes>
  )
}

export default CheckinPage
