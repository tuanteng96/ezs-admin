import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'

// const ClientList = lazy(() => import('./pages/Home'))
const ClientAddEdit = lazy(() => import('./pages/AddEdit'))
const ClientViews = lazy(() => import('./pages/Views'))
const ClientViewWalletMoney = lazy(() => import('./pages/ViewWalletMoney'))
const ViewPay = lazy(() => import('./pages/ViewPay'))
const ViewOrders = lazy(() => import('./pages/ViewOrders'))
const ViewOrderDetail = lazy(() => import('./pages/ViewOrderDetail'))
const ViewDiaryHistory = lazy(() => import('./pages/ViewDiaryHistory'))

function ClientsPage(props) {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/calendar" />} />
        {/* <Route
          path="lists"
          element={
            <SuspensedView>
              <ClientList />
            </SuspensedView>
          }
        /> */}
        <Route
          path="add"
          element={
            <SuspensedView>
              <ClientAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path="edit/:id"
          element={
            <SuspensedView>
              <ClientAddEdit />
            </SuspensedView>
          }
        />
        <Route
          path=":id"
          element={
            <SuspensedView>
              <ClientViews />
            </SuspensedView>
          }
        >
          <Route
            path="wallet-moneycard"
            element={
              <SuspensedView>
                <ClientViewWalletMoney />
              </SuspensedView>
            }
          />
          <Route
            path="pay"
            element={
              <SuspensedView>
                <ViewPay />
              </SuspensedView>
            }
          />
          <Route
            path="orders"
            element={
              <SuspensedView>
                <ViewOrders />
              </SuspensedView>
            }
          />
          <Route
            path="order/:orderId"
            element={
              <SuspensedView>
                <ViewOrderDetail />
              </SuspensedView>
            }
          />
          <Route
            path="diary-history"
            element={
              <SuspensedView>
                <ViewDiaryHistory />
              </SuspensedView>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </>
  )
}

export default ClientsPage
