import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../../store'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiMinus, FiPlus, FiCheck } from 'react-icons/fi'
import { cn } from '../../lib/utils'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const items = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping
  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 rounded-full glass flex items-center justify-center mx-auto mb-8 neon-glow"
          >
            <FiShoppingBag className="text-surface-400" size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gradient mb-4"
          >
            Your cart is empty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mb-8 text-lg"
          >
            Add some products to get started!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/products">
              <Button size="lg" className="neon-glow gap-2">
                <FiArrowLeft size={18} /> Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Shopping Cart</h1>
            <p className="text-surface-500">{items.length} items in your cart</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(clearCart())}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            <FiTrash2 size={16} /> Clear all
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover glass padding="md" className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl bg-background-light/50 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🛍️</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-200 text-base line-clamp-2 mb-2">{item.name}</h3>
                      <p className="text-xl font-bold text-gradient mb-4">${(item.price * item.quantity).toFixed(2)}</p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Control */}
                        <div className="flex items-center glass rounded-xl overflow-hidden">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (item.quantity <= 1) {
                                dispatch(removeFromCart(item.id))
                              } else {
                                dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                              }
                            }}
                            className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                          >
                            <FiMinus size={16} />
                          </motion.button>
                          <span className="w-12 text-center text-sm font-bold text-surface-200">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                          >
                            <FiPlus size={16} />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 rounded-xl text-surface-500 hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <FiTrash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card glass padding="lg" className="sticky top-24">
                <h2 className="text-xl font-bold text-gradient mb-6">Order Summary</h2>
                
                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-surface-400">Free shipping progress</span>
                      <span className="text-primary font-semibold">${(50 - subtotal).toFixed(2)} away</span>
                    </div>
                    <div className="h-2 bg-background-light rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingProgress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-mesh"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-surface-400">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="text-surface-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-400">
                    <span>Shipping</span>
                    <span className={cn(shipping === 0 ? 'text-success font-semibold' : 'text-surface-200')}>
                      {shipping === 0 ? (
                        <span className="flex items-center gap-1">
                          <FiCheck size={14} /> FREE
                        </span>
                      ) : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-surface-200">Total</span>
                    <span className="text-2xl font-bold text-gradient">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button fullWidth size="lg" className="neon-glow">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/products" className="block text-center mt-4 text-sm text-surface-500 hover:text-primary transition-colors">
                  Continue Shopping
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
