import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'

interface DashboardLayoutProps {
  role: 'vendor' | 'admin'
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-surface dark:bg-darkbg overflow-hidden">
      <DashboardSidebar role={role} />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
