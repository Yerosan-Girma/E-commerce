import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiHeart, FiBell, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const Navbar = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items.length)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MarketHub
        </Link>
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} className="relative">
            <FiHeart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-error text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">2</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="relative">
            <FiShoppingCart className="text-xl" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartItems}</span>
            )}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="relative">
            <FiBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-accent w-3 h-3 rounded-full border-2 border-white"></span>
          </motion.button>
          <Link to="/profile" className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
            JD
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar