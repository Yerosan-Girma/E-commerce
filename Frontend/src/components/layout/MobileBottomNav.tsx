import { NavLink } from 'react-router-dom'
import { FiHome, FiSearch, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const MobileBottomNav = () => {
  const cartCount = useSelector((state: RootState) => state.cart.items.length)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-darksurface border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around py-2">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-primary' : 'text-gray-500'}`}>
          <FiHome className="text-xl" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-primary' : 'text-gray-500'}`}>
          <FiSearch className="text-xl" />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/cart" className="relative flex flex-col items-center text-xs text-gray-500">
          <FiShoppingCart className="text-xl" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
          <span>Cart</span>
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-primary' : 'text-gray-500'}`}>
          <FiHeart className="text-xl" />
          <span>Wishlist</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-primary' : 'text-gray-500'}`}>
          <FiUser className="text-xl" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  )
}

export default MobileBottomNav