import { motion } from 'framer-motion'
import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { cn } from '../../lib/utils'

const kpis = [
  { label: 'Gross Revenue', value: '$142,380', delta: '+18.2%', icon: FiDollarSign },
  { label: 'Total Users', value: '52,840', delta: '+6.4%', icon: FiUsers },
  { label: 'Platform Orders', value: '38,921', delta: '+9.8%', icon: FiShoppingBag },
  { label: 'Avg Order Value', value: '$76.20', delta: '+3.1%', icon: FiTrendingUp },
]

const topCategories = [
  { name: 'Electronics', percentage: 34, revenue: '$48,490', growth: '+22%' },
  { name: 'Fashion', percentage: 28, revenue: '$39,866', growth: '+15%' },
  { name: 'Home & Living', percentage: 18, revenue: '$25,629', growth: '+8%' },
  { name: 'Sports', percentage: 12, revenue: '$17,086', growth: '+18%' },
  { name: 'Beauty', percentage: 8, revenue: '$11,390', growth: '+11%' },
]

export default function PlatformAnalytics() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Platform Analytics</h1>
        <p className="text-surface-500">Overall marketplace performance</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map(({ label, value, delta, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card glass padding="lg" className="h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-mesh flex items-center justify-center mb-4 neon-glow">
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-3xl font-extrabold text-gradient">{value}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-surface-500">{label}</p>
                <span className="text-xs text-success font-semibold">{delta}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-1">Revenue by Month</h2>
            <p className="text-sm text-surface-500 mb-6">2025</p>
            <div className="flex items-end gap-1.5 h-48">
              {[55, 70, 60, 85, 75, 90, 80, 95, 88, 100, 92, 98].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity neon-glow" />
                  <span className="text-[10px] text-surface-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-1">Orders by Month</h2>
            <p className="text-sm text-surface-500 mb-6">2025</p>
            <div className="flex items-end gap-1.5 h-48">
              {[45, 60, 50, 75, 65, 80, 70, 88, 78, 95, 82, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity neon-glow" />
                  <span className="text-[10px] text-surface-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card glass padding="lg">
          <h2 className="text-lg font-bold text-gradient mb-6">Revenue by Category</h2>
          <div className="space-y-4">
            {topCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-surface-200">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-success font-semibold">{cat.growth}</span>
                    <span className="font-semibold text-surface-200">{cat.revenue}</span>
                    <span className="text-xs text-surface-500 w-8 text-right">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-background-light/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="h-full bg-gradient-mesh rounded-full transition-all neon-glow"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
