import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

const Category = lazy(() => import('./pages/Category'))
const Products = lazy(() => import('./pages/Products'))
const ProductAdd = lazy(() => import('./pages/Products/ProductAdd'))
const CategoryAdd = lazy(() => import('./pages/Category/CategoryAdd'))
const Inventory = lazy(() => import('./pages/Inventory'))
const InventoryFilters = lazy(() => import('./pages/Inventory/pages/Filters'))
const ImportExport = lazy(() => import('./pages/ImportExport'))
const ImportExportFilters = lazy(() =>
  import('./pages/ImportExport/pages/Filters')
)
const Supplier = lazy(() => import('./pages/Supplier'))

function CataloguePage(props) {
  return (
    <Routes>
      <Route
        element={
          <CatalogueLayout
            paths={[
              {
                to: '/catalogue/products',
                name: 'Sản phẩm'
              },
              {
                to: '/catalogue/services',
                name: 'Dịch vụ & thẻ liệu trình'
              },
              {
                to: '/catalogue/money-cards',
                name: 'Thẻ tiền'
              },
              {
                to: '/catalogue/surcharges',
                name: 'Phụ phí'
              },
              {
                to: '/catalogue/materials',
                name: 'Nguyên vật liệu'
              }
            ]}
          />
        }
      >
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
        element={
          <CatalogueLayout
            paths={[
              {
                to: '/catalogue/inventory',
                name: 'Kho và hàng tồn'
              },
              {
                to: '/catalogue/import-export',
                name: 'Đơn nhập xuất'
              },
              {
                to: '/catalogue/supplier',
                name: 'Nhà cung cấp, đại lý'
              }
            ]}
          />
        }
      >
        <Route index element={<Navigate to="inventory" />} />
        <Route
          path="inventory"
          element={
            <SuspensedView>
              <Inventory />
            </SuspensedView>
          }
        >
          <Route path="filters" element={<InventoryFilters />}></Route>
        </Route>
        <Route
          path="import-export"
          element={
            <SuspensedView>
              <ImportExport />
            </SuspensedView>
          }
        >
          <Route path="filters" element={<ImportExportFilters />}></Route>
        </Route>
        <Route
          path="supplier"
          element={
            <SuspensedView>
              <Supplier />
            </SuspensedView>
          }
        ></Route>
      </Route>
    </Routes>
  )
}

export default CataloguePage
