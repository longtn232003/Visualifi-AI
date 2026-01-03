import { PATH_ROUTES } from '@/constants/path-route'
import { useAuthStore } from '@/stores/auth'
import { Navigate, Outlet } from 'react-router-dom'
interface IProps {
  allowedRoles?: string[]
  children?: React.ReactNode
}

export const ProtectedRoute = ({ allowedRoles, children }: IProps) => {
  const { accessToken } = useAuthStore()
  const user = {
    roles: [] as string[]
  }
  if (!accessToken) {
    return <Navigate to={PATH_ROUTES.home} replace />
  }
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!user?.roles || !allowedRoles.some((role: string) => user.roles.includes(role)))
  ) {
    return <Navigate to={PATH_ROUTES.unauthorized} replace />
  }

  return children ?? <Outlet />
}
