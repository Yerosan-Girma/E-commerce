import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign, FiRefreshCw } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import { api } from '../../services/api'

interface AdminData {
  usersCount: number
  vendorsCount: number
  productsCount: number
  ordersCount: number
  salesRevenue: number
  monthlySales: { month: number; year: number; revenue: number; orders: number }[]
  ordersByStatus: { _id: string; count: number }[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthsShort = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-white/10 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-white/10 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 bg-white/10 rounded-2xl" />
        <div className="h-72 bg-white/10 rounded-2xl" />
      </div>
    </div>
  )
}

export default function PlatformAnalytics() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const analytics = await api.getAdminAnalytics() as unknown as AdminData
      setData(analytics)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform analytics')
      console.error('[PlatformAnalytics] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-accent text-lg font-semibold">{error}</p>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors"
        >
          <FiRefreshCw size={16} /> Retry
        </button>
      </div>
    )
  }

  const kpis = [
    {
      label: 'Gross Revenue',
      value: `$${(data?.salesRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      delta: 'live',
      icon: FiDollarSign,
    },
    {
      label: 'Total Users',
      value: (data?.usersCount ?? 0).toLocaleString(),
      delta: 'customers',
      icon: FiUsers,
    },
    {
      label: 'Platform Orders',
      value: (data?.ordersCount ?? 0).toLocaleString(),
      delta: 'orders',
      icon: FiShoppingBag,
    },
    {
      label: 'Avg Order Value',
      value: `$${data?.ordersCount && data.ordersCount > 0 ? ((data.salesRevenue ?? 0) / data.ordersCount).toFixed(2) : '0.00'}`,
      delta: 'AOV',
      icon: FiTrendingUp,
    },
  ]

  // Build revenue and orders charts from monthly sales
  const monthlyRevenue = Array(12).fill(0)
  const monthlyOrders = Array(12).fill(0)
  data?.monthlySales?.forEach(({ month, revenue, orders }) => {
    monthlyRevenue[month - 1] = revenue
    monthlyOrders[month - 1] = orders
  })

  const maxRevenue = Math.max(...monthlyRevenue, 1)
  const maxOrders = Math.max(...monthlyOrders, 1)

  const revenueBars = monthlyRevenue.map(v => Math.round((v / maxRevenue) * 100))
  const orderBars = monthlyOrders.map(v => Math.round((v / maxOrders) * 100))

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Platform Analytics</h1>
        <p className="text-surface-500">Overall marketplace performance — live database metrics</p>
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
            <p className="text-sm text-surface-500 mb-6">Last 12 months</p>
            <div className="flex items-end gap-1.5 h-48">
              {revenueBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(h, 4)}%` }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity neon-glow"
                    title={`${months[i]}: $${monthlyRevenue[i].toFixed(2)}`}
                  />
                  <span className="text-[10px] text-surface-500">{monthsShort[i]}</span>
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
            <p className="text-sm text-surface-500 mb-6">Last 12 months</p>
            <div className="flex items-end gap-1.5 h-48">
              {orderBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(h, 4)}%` }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-lg bg-gradient-mesh opacity-80 hover:opacity-100 transition-opacity neon-glow"
                    title={`${months[i]}: ${monthlyOrders[i]} orders`}
                  />
                  <span className="text-[10px] text-surface-500">{monthsShort[i]}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Orders status distribution */}
      {data?.ordersByStatus && data.ordersByStatus.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-6">Order Status Distribution</h2>
            <div className="space-y-4">
              {data.ordersByStatus.map((item, i) => {
                const total = data.ordersByStatus.reduce((sum, s) => sum + s.count, 0)
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-surface-200">{item._id}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-surface-200">{item.count} orders</span>
                        <span className="text-xs text-surface-500 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-background-light/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="h-full bg-gradient-mesh rounded-full transition-all neon-glow"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
