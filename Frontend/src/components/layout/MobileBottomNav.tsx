import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { FiHome, FiGrid, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi'

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/products', icon: FiGrid, label: 'Products' },
  { to: '/cart', icon: FiShoppingCart, label: 'Cart' },
  { to: '/wishlist', icon: FiHeart, label: 'Wishlist' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((s, i) => s + i.quantity, 0)
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden glass border-t border-white/20 dark:border-gray-700/30">
      <div className="flex items-center justify-around px-2 py-2 max-w-sm mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={[
                'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                active
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400',
              ].join(' ')}
            >
              <div className="relative">
                <Icon size={22} />
                {label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : ''}`}>
                {label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
