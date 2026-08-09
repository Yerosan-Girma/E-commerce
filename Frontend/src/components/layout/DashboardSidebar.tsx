import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiGrid,
  FiTrendingUp,
  FiEye,
  FiPlusSquare,
} from 'react-icons/fi'

const vendorLinks = [
  { to: '/vendor', icon: FiHome, label: 'Dashboard', exact: true },
  { to: '/vendor/products', icon: FiPackage, label: 'Products', exact: false },
  { to: '/vendor/products/add', icon: FiPlusSquare, label: 'Add Product', exact: false },
  { to: '/vendor/orders', icon: FiShoppingBag, label: 'Orders', exact: false },
  { to: '/vendor/analytics', icon: FiBarChart2, label: 'Analytics', exact: false },
  { to: '/vendor/store', icon: FiSettings, label: 'Store Profile', exact: false },
]

const adminLinks = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: FiUsers, label: 'Users', exact: false },
  { to: '/admin/vendors', icon: FiShoppingBag, label: 'Vendors', exact: false },
  { to: '/admin/categories', icon: FiGrid, label: 'Categories', exact: false },
  { to: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics', exact: false },
  { to: '/admin/orders', icon: FiEye, label: 'Order Monitor', exact: false },
]

interface DashboardSidebarProps {
  role: 'vendor' | 'admin'
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const links = role === 'vendor' ? vendorLinks : adminLinks

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to) && (exact || location.pathname === to || location.pathname.startsWith(to + '/') || location.pathname === to)

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-darksurface border-r border-gray-100 dark:border-gray-700/50 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-100 dark:border-gray-700/50 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="font-bold text-base text-gray-900 dark:text-white">
          Market<span className="text-primary">Hub</span>
        </span>
      </div>

      {/* Role Label */}
      <div className="px-6 pt-5 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 pb-6 space-y-1">
        {links.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact)
          return (
            <Link
              key={to}
              to={to}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50',
              ].join(' ')}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-gray-100 dark:border-gray-700/50 pt-4">
        <button
          onClick={() => {
            dispatch(logout())
            navigate('/')
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
