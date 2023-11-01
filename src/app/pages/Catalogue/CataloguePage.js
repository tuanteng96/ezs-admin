import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Category = lazy(() => import('./pages/Category'))
const Products = lazy(() => import('./pages/Products'))
const ProductAdd = lazy(() => import('./pages/Products/ProductAdd'))
const CategoryAdd = lazy(() => import('./pages/Category/CategoryAdd'))
const Inventory = lazy(() => import('./pages/Inventory'))

function CataloguePage(props) {
  return (
    <Routes>
      <Route element={<CatalogueLayout />}>
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
          <Route path=":id" element={<ProductAdd />}>
            <Route path="add-category/:type" element={<CategoryAdd />} />
          </Route>
          <Route path="list-category/:type" element={<Category />} />
          <Route path="add-category/:type" element={<CategoryAdd />} />
          <Route path="edit-category/:type/:id" element={<CategoryAdd />} />
        </Route>
        <Route
          path="services"
          element={
            <SuspensedView>
              <div>Dịch vụ</div>
            </SuspensedView>
          }
        ></Route>
        <Route
          path="money-cards"
          element={
            <SuspensedView>
              <div>Thẻ tiền</div>
            </SuspensedView>
          }
        ></Route>
        <Route
          path="surcharges"
          element={
            <SuspensedView>
              <div>Phụ phí</div>
            </SuspensedView>
          }
        ></Route>
        <Route
          path="materials"
          element={
            <SuspensedView>
              <div>Nguyên vật liệu</div>
            </SuspensedView>
          }
        ></Route>
      </Route>
      <Route
        path="inventory"
        element={
          <SuspensedView>
            <Inventory />
          </SuspensedView>
        }
      ></Route>
    </Routes>
  )
}

export default CataloguePage
