import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const EInvoice = lazy(() => import('./pages/EInvoice'))

function PublicPage(props) {
  return (
    <Routes>
      {/* <Route
        index
        element={
          <SuspensedView>
            <Home />
          </SuspensedView>
        }
      /> */}
      <Route
        path="einvoice/:id/:timestamp"
        element={
          <SuspensedView>
            <EInvoice />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

export default PublicPage
