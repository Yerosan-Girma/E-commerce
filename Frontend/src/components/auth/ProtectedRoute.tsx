import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { ReactNode } from 'react'
import type { RootState } from '../../store'

interface ProtectedRouteProps {
  role: 'vendor' | 'admin'
  children: ReactNode
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const location = useLocation()
  const { user, token } = useSelector((state: RootState) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location.pathname, requiredRole: role }} replace />
  }

  if (user.role !== role) {
    const fallback = user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
