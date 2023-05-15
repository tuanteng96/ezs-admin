import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from 'src/_ezs/layout/AuthLayout'
import Forgot from '../pages/Forgot'
import ForgotChange from '../pages/Forgot-Change'
import Login from '../pages/Login'
import SuspensedView from './SuspensedView'

function AuthRoutes(props) {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <SuspensedView>
              <Login />
            </SuspensedView>
          }
        />
        <Route
          path="forgot"
          element={
            <SuspensedView>
              <Forgot />
            </SuspensedView>
          }
        />
        <Route
          path="forgot-change"
          element={
            <SuspensedView>
              <ForgotChange />
            </SuspensedView>
          }
        />
        <Route index element={<Navigate to="login" />} />
        <Route path="*" element={<Navigate to="login" />} />
      </Route>
    </Routes>
  )
}

export default AuthRoutes
