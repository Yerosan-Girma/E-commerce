import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { FiHome, FiGrid, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/',        icon: FiHome,         label: 'Home'     },
  { to: '/products',icon: FiGrid,         label: 'Products' },
  { to: '/cart',    icon: FiShoppingCart, label: 'Cart'     },
  { to: '/wishlist',icon: FiHeart,        label: 'Wishlist' },
  { to: '/profile', icon: FiUser,         label: 'Profile'  },
]

export default function MobileBottomNav() {
  const location  = useLocation()
  const cartCount = useSelector((s: RootState) =>
    s.cart.items.reduce((acc, i) => acc + i.quantity, 0)
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-background-light/95 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-1 py-1.5 max-w-sm mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 min-w-12 px-2 py-1.5 rounded-xl transition-all duration-200"
            >
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="mobileNavPill"
                    className="absolute inset-0 -m-1.5 rounded-xl bg-primary/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={active ? 'text-primary relative z-10' : 'text-surface-500 relative z-10'}
                />
                {label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold flex items-center justify-center z-20 shadow-lg shadow-primary/50 ring-2 ring-white dark:ring-gray-900 animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-surface-500'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
