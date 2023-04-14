import { Navigate, Outlet } from 'react-router-dom'

const RoleAccess = ({ roles = [] }) => {
  return roles ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

export { RoleAccess }
