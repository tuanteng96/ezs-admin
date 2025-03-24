import React, { lazy, useEffect } from 'react'
import { ProdsLayout } from './ProdsLayout'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Navigate, Route, Routes } from 'react-router'
import SuspensedView from 'src/app/routing/SuspensedView'

const ProductsPage = lazy(() => import('./pages/Products'))
const MaterialsPage = lazy(() => import('./pages/Materials'))
const FeesPage = lazy(() => import('./pages/Fees'))
const MoneyCardPage = lazy(() => import('./pages/MoneyCard'))

function ProdsPage(props) {
  const { updateLoadingContent } = useLayout()

  useEffect(() => {
    updateLoadingContent(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Routes>
      <Route element={<ProdsLayout />}>
        <Route index element={<Navigate to="san-pham/794" />} />
        <Route
          path="san-pham/:CateID"
          element={
            <SuspensedView>
              <ProductsPage />
            </SuspensedView>
          }
        >
          <Route
            path=":CateSubID"
            element={
              <SuspensedView>
                <ProductsPage />
              </SuspensedView>
            }
          />
        </Route>
        <Route
          path="the-tien/:CateID"
          element={
            <SuspensedView>
              <MoneyCardPage />
            </SuspensedView>
          }
        >
          <Route
            path=":CateSubID"
            element={
              <SuspensedView>
                <MoneyCardPage />
              </SuspensedView>
            }
          />
        </Route>
        <Route
          path="phu-phi/:CateID"
          element={
            <SuspensedView>
              <FeesPage />
            </SuspensedView>
          }
        >
          <Route
            path=":CateSubID"
            element={
              <SuspensedView>
                <FeesPage />
              </SuspensedView>
            }
          />
        </Route>
        <Route
          path="nvl/:CateID"
          element={
            <SuspensedView>
              <MaterialsPage />
            </SuspensedView>
          }
        >
          <Route
            path=":CateSubID"
            element={
              <SuspensedView>
                <MaterialsPage />
              </SuspensedView>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default ProdsPage
