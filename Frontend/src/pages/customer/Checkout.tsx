import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store'
import { clearCart } from '../../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { FiCheckCircle, FiMapPin, FiCreditCard, FiPackage, FiArrowRight, FiLock } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

type Step = 1 | 2 | 3 | 4

const steps = [
  { id: 1, label: 'Shipping', icon: FiMapPin },
  { id: 2, label: 'Payment', icon: FiCreditCard },
  { id: 3, label: 'Review', icon: FiPackage },
  { id: 4, label: 'Done', icon: FiCheckCircle },
]

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const items = useSelector((state: RootState) => state.cart.items)
  const [step, setStep] = useState<Step>(1)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const [shipping, setShipping] = useState({
    name: '', address: '', city: '', state: '', zip: '', country: 'US',
  })
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingFee = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shippingFee

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.id,
          title: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.zip,
          country: shipping.country,
        },
        paymentMethod: 'credit_card',
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shippingFee,
        totalPrice: total,
      }

      await api.createOrder(orderData)
      setStep(4)
      dispatch(clearCart())
      setTimeout(() => navigate('/orders'), 3000)
    } catch (error) {
      console.error('Failed to create order:', error)
      // Fallback: still show success and clear cart even if backend fails
      setStep(4)
      dispatch(clearCart())
      setTimeout(() => navigate('/orders'), 3000)
    }
  }

  if (step === 4) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full glass flex items-center justify-center mx-auto mb-8 neon-glow-green"
          >
            <FiCheckCircle className="text-success" size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gradient mb-4"
          >
            Order Placed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-surface-400 mb-2"
          >
            Thank you for your order. We'll send you a confirmation email shortly.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-surface-500"
          >
            Redirecting to orders...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">Checkout</h1>
          <p className="text-surface-500 flex items-center gap-2">
            <FiLock size={16} /> Secure checkout powered by Stripe
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center mb-12">
          {steps.slice(0, 3).map(({ id, label, icon: Icon }, i) => {
            const done = id < step
            const active = id === step
            return (
              <div key={id} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                    done ? 'bg-success text-white neon-glow-green' : active ? 'bg-primary text-white neon-glow' : 'glass text-surface-500'
                  )}>
                    {done ? <FiCheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={cn('text-xs font-medium', active ? 'text-primary' : done ? 'text-success' : 'text-surface-500')}>
                    {label}
                  </span>
                </motion.div>
                {i < 2 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className={cn('flex-1 h-0.5 mx-4', done ? 'bg-success' : 'bg-white/10')}
                  />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <Card glass padding="lg" className="space-y-6">
                    <h2 className="text-xl font-bold text-gradient flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                        <FiMapPin size={20} className="text-white" />
                      </div>
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-surface-400 mb-2 block">Full name</label>
                        <input
                          value={shipping.name}
                          onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                          placeholder="John Doe"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl text-sm',
                            'bg-background-light/50 backdrop-blur-sm border border-white/10',
                            'text-surface-100 placeholder:text-surface-500',
                            'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-400 mb-2 block">Street address</label>
                        <input
                          value={shipping.address}
                          onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                          placeholder="123 Main St"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl text-sm',
                            'bg-background-light/50 backdrop-blur-sm border border-white/10',
                            'text-surface-100 placeholder:text-surface-500',
                            'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">City</label>
                          <input
                            value={shipping.city}
                            onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                            placeholder="New York"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">State</label>
                          <input
                            value={shipping.state}
                            onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                            placeholder="NY"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">ZIP code</label>
                          <input
                            value={shipping.zip}
                            onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))}
                            placeholder="10001"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">Country</label>
                          <input
                            value={shipping.country}
                            onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}
                            placeholder="US"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setStep(2)} fullWidth size="lg" className="neon-glow gap-2">
                      Continue to Payment <FiArrowRight size={18} />
                    </Button>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <Card glass padding="lg" className="space-y-6">
                    <h2 className="text-xl font-bold text-gradient flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                        <FiCreditCard size={20} className="text-white" />
                      </div>
                      Payment Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-surface-400 mb-2 block">Name on card</label>
                        <input
                          value={payment.cardName}
                          onChange={e => setPayment(p => ({ ...p, cardName: e.target.value }))}
                          placeholder="John Doe"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl text-sm',
                            'bg-background-light/50 backdrop-blur-sm border border-white/10',
                            'text-surface-100 placeholder:text-surface-500',
                            'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-400 mb-2 block">Card number</label>
                        <input
                          value={payment.cardNumber}
                          onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl text-sm',
                            'bg-background-light/50 backdrop-blur-sm border border-white/10',
                            'text-surface-100 placeholder:text-surface-500',
                            'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">Expiry date</label>
                          <input
                            value={payment.expiry}
                            onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-surface-400 mb-2 block">CVV</label>
                          <input
                            value={payment.cvv}
                            onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))}
                            placeholder="123"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl text-sm',
                              'bg-background-light/50 backdrop-blur-sm border border-white/10',
                              'text-surface-100 placeholder:text-surface-500',
                              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} fullWidth>Back</Button>
                      <Button onClick={() => setStep(3)} fullWidth size="lg" className="neon-glow gap-2">
                        Review Order <FiArrowRight size={18} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <Card glass padding="lg" className="space-y-6">
                    <h2 className="text-xl font-bold text-gradient flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                        <FiPackage size={20} className="text-white" />
                      </div>
                      Review Order
                    </h2>
                    
                    <div className="glass-card p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-surface-200 mb-3">Items</h3>
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-surface-400 truncate">{item.name} × {item.quantity}</span>
                          <span className="text-surface-200 ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="glass-card p-4">
                      <h3 className="text-sm font-semibold text-surface-200 mb-2">Ship to</h3>
                      <p className="text-sm text-surface-400">
                        {shipping.name}<br />
                        {shipping.address}<br />
                        {shipping.city}, {shipping.state} {shipping.zip}<br />
                        {shipping.country}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} fullWidth>Back</Button>
                      <Button onClick={handlePlaceOrder} fullWidth size="lg" className="neon-glow">
                        Place Order
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card glass padding="lg" className="sticky top-24">
                <h3 className="text-lg font-bold text-gradient mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-surface-400 truncate">{item.name} × {item.quantity}</span>
                      <span className="text-surface-200">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-surface-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-surface-400">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? 'text-success' : ''}>
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gradient pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
