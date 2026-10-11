import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { FiX } from 'react-icons/fi'
import {
  FiHome, FiPackage, FiShoppingBag, FiBarChart2, FiSettings,
  FiLogOut, FiUsers, FiGrid, FiTrendingUp, FiEye, FiPlusSquare,
} from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

const vendorLinks = [
  { to: '/vendor',               icon: FiHome,       label: 'Dashboard',   exact: true  },
  { to: '/vendor/products',      icon: FiPackage,    label: 'Products',    exact: false },
  { to: '/vendor/products/add',  icon: FiPlusSquare, label: 'Add Product', exact: false },
  { to: '/vendor/orders',        icon: FiShoppingBag,label: 'Orders',      exact: false },
  { to: '/vendor/analytics',     icon: FiBarChart2,  label: 'Analytics',   exact: false },
  { to: '/vendor/store',         icon: FiSettings,   label: 'Store Profile', exact: false },
]

const adminLinks = [
  { to: '/admin',            icon: FiHome,       label: 'Dashboard',    exact: true  },
  { to: '/admin/users',      icon: FiUsers,      label: 'Users',        exact: false },
  { to: '/admin/vendors',    icon: FiShoppingBag,label: 'Vendors',      exact: false },
  { to: '/admin/categories', icon: FiGrid,       label: 'Categories',   exact: false },
  { to: '/admin/analytics',  icon: FiTrendingUp, label: 'Analytics',    exact: false },
  { to: '/admin/orders',     icon: FiEye,        label: 'Order Monitor',exact: false },
]

interface DashboardSidebarProps {
  role: 'vendor' | 'admin'
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function DashboardSidebar({ role, mobileOpen = false, onMobileClose }: DashboardSidebarProps) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const links     = role === 'vendor' ? vendorLinks : adminLinks

  const isActive = (to: string, exact: boolean) =>
    exact
      ? location.pathname === to
      : location.pathname.startsWith(to) &&
        (location.pathname === to || location.pathname.startsWith(to + '/'))

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-base text-white tracking-wide">
            Market<span className="text-primary">Hub</span>
          </span>
        </div>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Role pill */}
      <div className="px-5 pt-5 pb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact)
          return (
            <Link
              key={to}
              to={to}
              onClick={onMobileClose}
              className={cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                  : 'text-surface-400 hover:bg-white/8 hover:text-surface-100',
              )}
            >
              <span className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200',
                active
                  ? 'bg-white/20'
                  : 'bg-white/5 group-hover:bg-white/10',
              )}>
                <Icon size={15} />
              </span>
              {label}
              {active && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/8">
        <button
          onClick={() => { dispatch(logout()); navigate('/'); onMobileClose?.() }}
          className="group flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 group-hover:bg-red-500/15 transition-all">
            <FiLogOut size={15} />
          </span>
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}
      <aside className="w-60 shrink-0 hidden lg:flex flex-col h-screen sticky top-0 bg-background-light border-r border-white/8 overflow-y-auto">
        {sidebarContent}
      </aside>
      <aside className={cn(
        'lg:hidden fixed top-0 left-0 z-50 flex flex-col h-screen w-72 bg-background-light border-r border-white/8 overflow-y-auto transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
