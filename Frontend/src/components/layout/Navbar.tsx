import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store'
import { logout } from '../../store/slices/authSlice'
import { useTheme } from '../../hooks/useTheme'
import { FiSearch, FiShoppingCart, FiUser, FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiSettings, FiPackage, FiHeart, FiBell } from 'react-icons/fi'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const user = useSelector((state: RootState) => state.auth.user)
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((s, i) => s + i.quantity, 0))

  const [isScrolled, setIsScrolled] = useState(false)
  const [search, setSearch] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 py-3 shadow-2xl shadow-primary/10'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-5 border-b border-gray-100 dark:border-gray-800'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <span className="text-white font-bold text-lg">M</span>
              </motion.div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block"
              >
                MarketHub
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <motion.div key={link.to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={link.to}
                    className={cn(
                      'text-sm font-semibold transition-colors relative group px-4 py-2 rounded-xl',
                      location.pathname === link.to
                        ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30'
                        : 'text-gray-700 dark:text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden md:flex items-center relative">
              <FiSearch className="absolute left-3 text-gray-400 dark:text-gray-500" size={16} />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 outline-none',
                  'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700',
                  'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
                  'focus:ring-2 focus:ring-primary/50 focus:border-primary focus:shadow-lg focus:shadow-primary/20'
                )}
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <FiHeart size={18} />
              </motion.button>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative w-10 h-10 rounded-xl items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-secondary rounded-full text-xs text-white font-bold flex items-center justify-center shadow-lg"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 relative"
              >
                <FiBell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
              </motion.button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-mesh flex items-center justify-center shadow-lg shadow-primary/30">
                      <FiUser size={16} className="text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                      {user.name}
                    </span>
                  </motion.button>
                ) : (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-300"
                    >
                      <FiUser size={16} className="text-white" />
                      <span className="hidden sm:block text-sm font-medium">
                        Log in
                      </span>
                    </motion.button>
                  </Link>
                )}

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 glass-card shadow-2xl py-2 z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-white/10 mb-1">
                            <p className="text-sm font-semibold text-surface-100 truncate">{user.name}</p>
                            <p className="text-xs text-surface-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-white/5 transition-colors"
                          >
                            <FiSettings size={15} /> Profile Settings
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-white/5 transition-colors"
                          >
                            <FiPackage size={15} /> My Orders
                          </Link>
                          {user.role === 'vendor' && (
                            <Link
                              to="/vendor"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-white/5 transition-colors"
                            >
                              <FiSettings size={15} /> Vendor Dashboard
                            </Link>
                          )}
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-white/5 transition-colors"
                            >
                              <FiSettings size={15} /> Admin Panel
                            </Link>
                          )}
                          <div className="border-t border-white/10 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-red-500/10 transition-colors"
                            >
                              <FiLogOut size={15} /> Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-white/5 transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary/10 transition-colors"
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-surface-300 hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-background-light border-l border-white/10 p-6"
            >
              <div className="flex flex-col gap-6 mt-16">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-background-light/50 border border-white/10 text-surface-100 placeholder:text-surface-500 outline-none"
                  />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors',
                      location.pathname === link.to
                        ? 'text-primary'
                        : 'text-surface-300 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 pt-6">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-3 rounded-xl bg-gradient-mesh text-white font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
