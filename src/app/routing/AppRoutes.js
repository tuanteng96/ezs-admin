import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from 'src/_ezs/core/Auth'
import App from '../App'
import AuthRoutes from './AuthRoutes'
import PrivateRoutes from './PrivateRoutes'

const { PUBLIC_URL } = process.env

export default function AppRoutes() {
  const { accessToken } = useAuth()
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          {accessToken ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthRoutes />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
