import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import { useAuth } from 'src/_ezs/core/Auth'
import App from '../App'
import AuthRoutes from './AuthRoutes'
import PrivateRoutes from './PrivateRoutes'

const { PUBLIC_URL } = process.env

const AppBrowserRouter = () => {
  const { accessToken } = useAuth()

  let { pathname } = useLocation()

  return (
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
            <Route
              path="*"
              element={<Navigate to={`/auth/login?prev=${pathname}`} />}
            />
          </>
        )}
      </Route>
    </Routes>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <AppBrowserRouter />
    </BrowserRouter>
  )
}
