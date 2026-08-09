import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import DashboardSidebar from './DashboardSidebar'

interface DashboardLayoutProps {
  role: 'vendor' | 'admin'
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dark flex h-screen bg-background overflow-hidden relative">
      <div className="absolute inset-0 mesh-gradient pointer-events-none opacity-40" aria-hidden />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 h-14 bg-background-light/95 backdrop-blur-md border-b border-white/10">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
        <span className="font-bold text-white">
          Market<span className="text-primary">Hub</span>
        </span>
        <span className="text-xs text-surface-500 ml-auto capitalize">{role} Panel</span>
      </div>

      <DashboardSidebar
        role={role}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 overflow-y-auto relative z-10 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
