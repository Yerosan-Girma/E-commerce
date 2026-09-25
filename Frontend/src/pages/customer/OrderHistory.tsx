import { useState } from 'react'
import { motion } from 'framer-motion'
import OrderCard from '../../components/order/OrderCard'
import type { OrderSummary } from '../../components/order/OrderCard'
import { FiPackage } from 'react-icons/fi'
import { cn } from '../../lib/utils'

const mockOrders: OrderSummary[] = [
  { id: 'ORD-001', date: 'Jan 15, 2025', status: 'delivered', total: 249.98, items: [{ name: 'Wireless Headphones Pro', qty: 1, price: 199.99 }, { name: 'Phone Case', qty: 2, price: 24.99 }] },
  { id: 'ORD-002', date: 'Jan 20, 2025', status: 'shipped', total: 89.99, items: [{ name: 'Premium Leather Bag', qty: 1, price: 89.99 }] },
  { id: 'ORD-003', date: 'Jan 25, 2025', status: 'processing', total: 129.99, items: [{ name: 'Smart Security Camera', qty: 1, price: 129.99 }] },
  { id: 'ORD-004', date: 'Dec 10, 2024', status: 'delivered', total: 174.98, items: [{ name: 'Gaming Keyboard', qty: 1, price: 79.99 }, { name: 'Mouse Pad XL', qty: 1, price: 29.99 }, { name: 'USB Hub', qty: 1, price: 49.99 }] },
  { id: 'ORD-005', date: 'Dec 5, 2024', status: 'cancelled', total: 349.99, items: [{ name: 'Ergonomic Chair', qty: 1, price: 349.99 }] },
]

type Tab = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered = activeTab === 'all'
    ? mockOrders
    : mockOrders.filter(o => o.status === activeTab)

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-2 tracking-tight">My Orders</h1>
          <p className="text-surface-500">Track and manage your orders</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 p-1.5 glass-card mb-10 overflow-x-auto rounded-2xl"
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/8',
              )}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className={cn(
                  'ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full',
                  activeTab === tab.key ? 'bg-white/20' : 'bg-white/8',
                )}>
                  {mockOrders.filter(o => o.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-surface-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-surface-200 mb-2">No orders found</h3>
            <p className="text-surface-500">You don't have any {activeTab !== 'all' ? activeTab : ''} orders yet.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <OrderCard order={order} onView={id => console.log('View order:', id)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
