import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { FiSearch, FiEye } from 'react-icons/fi'
import { cn } from '../../lib/utils'

interface Order {
  id: string
  customer: string
  date: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

const orders: Order[] = [
  { id: 'ORD-048', customer: 'Alice Wilson', date: 'Jan 25, 2025', items: 2, total: 249.98, status: 'processing' },
  { id: 'ORD-047', customer: 'Bob Martinez', date: 'Jan 24, 2025', items: 1, total: 89.99, status: 'shipped' },
  { id: 'ORD-046', customer: 'Carol Smith', date: 'Jan 23, 2025', items: 3, total: 159.97, status: 'delivered' },
  { id: 'ORD-045', customer: 'David Reed', date: 'Jan 22, 2025', items: 1, total: 24.99, status: 'delivered' },
  { id: 'ORD-044', customer: 'Eve Liu', date: 'Jan 21, 2025', items: 2, total: 219.98, status: 'cancelled' },
  { id: 'ORD-043', customer: 'Frank Brown', date: 'Jan 20, 2025', items: 1, total: 129.99, status: 'pending' },
]

const statusMap: Record<Order['status'], 'warning' | 'primary' | 'secondary' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
}

export default function OrderManagement() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Orders</h1>
        <p className="text-surface-500">{orders.length} total orders</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className={cn(
              'pl-9 pr-4 py-2.5 rounded-xl text-sm',
              'glass border border-white/10',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none w-56'
            )}
          />
        </div>
        <div className="flex gap-1 p-1 glass rounded-2xl">
          {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all',
                filter === s
                  ? 'bg-gradient-mesh text-white neon-glow'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light/30">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-surface-200">{order.id}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-400">{order.customer}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-500">{order.date}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-400">{order.items}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-surface-200">${order.total.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusMap[order.status]} dot>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg text-surface-500 hover:text-primary hover:bg-primary/10 transition-colors">
                        <FiEye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-surface-500">No orders found.</div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
