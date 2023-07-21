import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Category = lazy(() => import('./pages/Category'))
const Products = lazy(() => import('./pages/Products'))
const ProductAdd = lazy(() => import('./pages/Products/ProductAdd'))
const CategoryAdd = lazy(() => import('./pages/Category/CategoryAdd'))

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
          <Route path="add" element={<ProductAdd />}>
            <Route path="add-category/:type" element={<CategoryAdd />} />
          </Route>
          <Route path="list-category/:type" element={<Category />} />
          <Route path="add-category/:type" element={<CategoryAdd />} />
          <Route path="edit-category/:type/:id" element={<CategoryAdd />} />
        </Route>
      </Routes>
    </CatalogueLayout>
  )
}

export default CataloguePage
