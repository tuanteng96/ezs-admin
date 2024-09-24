import React, { lazy } from 'react'
import { CatalogueLayout } from './CatalogueLayout'
import { Route, Routes, Navigate } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import { useRoles } from 'src/_ezs/hooks/useRoles'

const Category = lazy(() => import('./pages/Category'))
const Products = lazy(() => import('./pages/Products'))
const ProductAdd = lazy(() => import('./pages/Products/ProductAdd'))
const CategoryAdd = lazy(() => import('./pages/Category/CategoryAdd'))

const ConsultingCommission = lazy(() => import('./pages/ConsultingCommission'))
const TourSalary = lazy(() => import('./pages/TourSalary'))
const ToolsImages = lazy(() => import('./pages/ToolsImages'))

const Inventory = lazy(() => import('./pages/Inventory'))
const InventoryFilters = lazy(() => import('./pages/Inventory/pages/Filters'))
const ImportExport = lazy(() => import('./pages/ImportExport'))

const ImportExportFilters = lazy(() =>
  import('./pages/ImportExport/pages/Filters')
)
const WareHouseDate = lazy(() =>
  import('./pages/ImportExport/pages/WareHouseDate')
)
const WareHouseImport = lazy(() =>
  import('./pages/ImportExport/pages/WareHouseImport')
)
const WareHouseExport = lazy(() =>
  import('./pages/ImportExport/pages/WareHouseExport')
)
const WareHouseExportStock = lazy(() =>
  import('./pages/ImportExport/pages/WareHouseExportStock')
)
const WareHouseToPay = lazy(() =>
  import('./pages/ImportExport/pages/WareHouseToPay')
)
const ImportExportMaterial = lazy(() =>
  import('./pages/ImportExport/pages/MaterialConversion')
)
const Supplier = lazy(() => import('./pages/Supplier'))
const IeProcessed = lazy(() => import('./pages/IeProcessed'))
const IeProcessedImport = lazy(() =>
  import('./pages/IeProcessed/pages/IeProcessedImport')
)

function CataloguePage(props) {
  const { xuat_nhap_diem, xuat_nhap_ten_slg } = useRoles([
    'xuat_nhap_diem',
    'xuat_nhap_ten_slg'
  ])
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
              },
              {
                to: '/catalogue/consulting-commission',
                name: 'Hoa hồng tư vấn'
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
        <Route
          path="consulting-commission"
          element={
            <SuspensedView>
              <ConsultingCommission />
            </SuspensedView>
          }
        ></Route>
        <Route
          path="tour-salary"
          element={
            <SuspensedView>
              <TourSalary />
            </SuspensedView>
          }
        ></Route>
        <Route
          path="prod-image"
          element={
            <SuspensedView>
              <ToolsImages />
            </SuspensedView>
          }
        ></Route>
      </Route>
      <Route
        element={
          <RoleAccess
            roles={xuat_nhap_diem.hasRight || xuat_nhap_ten_slg.hasRight}
          />
        }
      >
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
              isReceive
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
            <Route path="change-date/:id" element={<WareHouseDate />}></Route>
            <Route
              path="material-conversion"
              element={<ImportExportMaterial />}
            ></Route>
            <Route path="import" element={<WareHouseImport />}>
              <Route index element={<Navigate to="inventory" />} />
              <Route path=":id" element={<Navigate to="inventory" />} />
            </Route>
            <Route path="export" element={<WareHouseExport />}>
              <Route index element={<Navigate to="inventory" />} />
              <Route path=":id" element={<Navigate to="inventory" />} />
            </Route>
            <Route path="export-stock" element={<WareHouseExportStock />}>
              <Route index element={<Navigate to="inventory" />} />
              <Route path=":id" element={<Navigate to="inventory" />} />
            </Route>
            <Route path="topay" element={<WareHouseToPay />}>
              <Route index element={<Navigate to="inventory" />} />
              <Route path=":id" element={<Navigate to="inventory" />} />
            </Route>
          </Route>
          <Route
            path="supplier"
            element={
              <SuspensedView>
                <Supplier />
              </SuspensedView>
            }
          ></Route>
          <Route
            path="ie-processed"
            element={
              <SuspensedView>
                <IeProcessed />
              </SuspensedView>
            }
          >
            <Route path="import" element={<IeProcessedImport />}>
              <Route index element={<Navigate to="inventory" />} />
              <Route path=":id" element={<Navigate to="inventory" />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default CataloguePage
