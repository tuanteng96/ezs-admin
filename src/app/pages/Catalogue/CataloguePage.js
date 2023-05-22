import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Products = lazy(() => import('./pages/Products'))

function CataloguePage(props) {
  return (
    <CatalogueLayout>
      <Routes>
        <Route index element={<Navigate to="products" />} />
        <Route
          path="products"
          element={
            <SuspensedView>
              <Products />
            </SuspensedView>
          }
        />
      </Routes>
    </CatalogueLayout>
  )
}

export default CataloguePage
