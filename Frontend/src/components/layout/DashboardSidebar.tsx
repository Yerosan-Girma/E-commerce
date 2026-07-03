import { NavLink } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiSettings, FiUsers, FiFolder, FiTrendingUp, FiFileText } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  role: 'vendor' | 'admin'
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const vendorLinks = [
  { to: '/vendor', icon: FiGrid, label: 'Dashboard' },
  { to: '/vendor/store', icon: FiSettings, label: 'Store Profile' },
  { to: '/vendor/products', icon: FiPackage, label: 'Products' },
  { to: '/vendor/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/vendor/analytics', icon: FiBarChart2, label: 'Analytics' },
]

const adminLinks = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/vendors', icon: FiFolder, label: 'Vendors' },
  { to: '/admin/categories', icon: FiFolder, label: 'Categories' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics' },
]

const DashboardSidebar = ({ role, isOpen, setIsOpen }: SidebarProps) => {
  const links = role === 'vendor' ? vendorLinks : adminLinks

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-darksurface border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {role === 'vendor' ? 'Vendor Hub' : 'Admin Panel'}
            </h2>
          </div>
          <nav className="px-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <link.icon className="text-lg" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default DashboardSidebar