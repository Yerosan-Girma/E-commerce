import { motion } from 'framer-motion'
import { FiDollarSign, FiUsers, FiShoppingBag, FiGrid, FiArrowUp } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { cn } from '../../lib/utils'

const stats = [
  { label: 'Platform Revenue', value: '$142,380', change: '+18.2%', icon: FiDollarSign },
  { label: 'Total Users', value: '52,840', change: '+6.4%', icon: FiUsers },
  { label: 'Active Vendors', value: '1,284', change: '+12.1%', icon: FiShoppingBag },
  { label: 'Total Orders', value: '38,921', change: '+9.8%', icon: FiGrid },
]

const recentActivity = [
  { type: 'vendor', message: 'New vendor "StyleHouse" applied for registration', time: '2 min ago', dot: 'bg-violet-400' },
  { type: 'order', message: 'Order #ORD-5821 escalated by customer', time: '15 min ago', dot: 'bg-amber-400' },
  { type: 'user', message: '47 new users registered today', time: '1 hr ago', dot: 'bg-blue-400' },
  { type: 'vendor', message: 'Vendor "TechPro" account suspended', time: '2 hr ago', dot: 'bg-red-400' },
  { type: 'revenue', message: 'Revenue milestone: $100k this month', time: '3 hr ago', dot: 'bg-green-400' },
]

const chartBars = [55, 70, 60, 85, 75, 90, 80, 95, 88, 100, 92, 98]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
        <p className="text-surface-500">Platform overview and key metrics</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, change, icon: Icon }, i) => (
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
                <span className="flex items-center gap-1 text-xs font-semibold text-success">
                  <FiArrowUp size={12} /> {change}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-gradient">{value}</p>
              <p className="text-xs text-surface-500 mt-1">{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-1">Platform Revenue</h2>
            <p className="text-sm text-surface-500 mb-6">Monthly revenue 2025</p>
            <div className="flex items-end gap-2 h-48">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity neon-glow" />
                  <span className="text-[10px] text-surface-500">{months[i]}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-5">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0 neon-glow', item.dot.replace('bg-', 'bg-'))} />
                  <div>
                    <p className="text-sm text-surface-200">{item.message}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
