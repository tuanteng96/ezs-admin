import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import Category from './pages/Category'
import CategoryAdd from './pages/Category/CategoryAdd'

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
        >
          <Route path="list-category/:type" element={<Category />} />
          <Route path="add-category/:type" element={<CategoryAdd />} />
          <Route path="edit-category/:type/:id" element={<CategoryAdd />} />
        </Route>
      </Routes>
    </CatalogueLayout>
  )
}

export default CataloguePage
