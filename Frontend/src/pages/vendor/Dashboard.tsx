import { motion } from 'framer-motion'
import { FiDollarSign, FiPackage, FiShoppingBag, FiStar, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { cn } from '../../lib/utils'

const stats = [
  { label: 'Total Revenue', value: '$12,456', change: '+12.5%', up: true, icon: FiDollarSign },
  { label: 'Total Orders', value: '348', change: '+8.2%', up: true, icon: FiShoppingBag },
  { label: 'Products', value: '64', change: '+3', up: true, icon: FiPackage },
  { label: 'Avg Rating', value: '4.8', change: '-0.1', up: false, icon: FiStar },
]

const recentOrders = [
  { id: 'ORD-048', customer: 'Alice W.', product: 'Headphones Pro', amount: '$199.99', status: 'processing', date: 'Jan 25' },
  { id: 'ORD-047', customer: 'Bob M.', product: 'Smart Speaker', amount: '$89.99', status: 'shipped', date: 'Jan 24' },
  { id: 'ORD-046', customer: 'Carol S.', product: 'USB-C Hub', amount: '$49.99', status: 'delivered', date: 'Jan 23' },
  { id: 'ORD-045', customer: 'David R.', product: 'Phone Stand', amount: '$24.99', status: 'delivered', date: 'Jan 22' },
  { id: 'ORD-044', customer: 'Eve L.', product: 'Cable Set', amount: '$19.99', status: 'cancelled', date: 'Jan 21' },
]

const statusMap: Record<string, 'primary' | 'secondary' | 'success' | 'error'> = {
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
}

const chartBars = [40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 92]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function VendorDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-surface-500">Welcome back! Here's what's happening with your store.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, change, up, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card glass padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-mesh flex items-center justify-center neon-glow">
                  <Icon size={24} className="text-white" />
                </div>
                <span className={cn('flex items-center gap-1 text-xs font-semibold', up ? 'text-success' : 'text-accent')}>
                  {up ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                  {change}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-gradient">{value}</p>
              <p className="text-xs text-surface-500 mt-1">{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card glass padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gradient">Revenue Overview</h2>
              <p className="text-sm text-surface-500">Last 12 months</p>
            </div>
            <span className="text-3xl font-extrabold text-gradient">$12,456</span>
          </div>
          {/* Chart */}
          <div className="flex items-end gap-2 h-48">
            {chartBars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity cursor-pointer neon-glow" />
                <span className="text-[10px] text-surface-500">{months[i]}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card glass padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-gradient">Recent Orders</h2>
            <button className="text-sm text-primary hover:underline font-semibold">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light/30">
                <tr>
                  {['Order', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-surface-200">{order.id}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-400">{order.customer}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-400 max-w-[140px] truncate">{order.product}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-surface-200">{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusMap[order.status]} dot>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-500">{order.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
