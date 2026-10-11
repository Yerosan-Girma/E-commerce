import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiDollarSign, FiPackage, FiShoppingBag, FiStar, FiArrowUp, FiArrowDown, FiRefreshCw, FiCalendar, FiClock, FiSettings } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

const statusMap: Record<string, 'primary' | 'secondary' | 'success' | 'error'> = {
  Processing: 'primary',
  Shipped: 'secondary',
  Delivered: 'success',
  Cancelled: 'error',
  Pending: 'secondary',
  Paid: 'primary',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface AnalyticsData {
  totalRevenue: number
  monthlyRevenue: { month: number; year: number; revenue: number }[]
  ordersCount: number
  topProducts: { title: string; totalSold: number; revenue: number }[]
  topCustomers: { name: string; email: string; totalOrders: number; totalSpent: number }[]
  storeSetupRequired?: boolean
}

const emptyAnalytics: AnalyticsData = {
  totalRevenue: 0,
  monthlyRevenue: [],
  ordersCount: 0,
  topProducts: [],
  topCustomers: [],
  storeSetupRequired: true,
}

interface OrderItem {
  _id: string
  user: { name: string; email: string }
  orderItems: { title: string }[]
  totalPrice: number
  status: string
  createdAt: string
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-44 bg-white/5 rounded-3xl" />
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5" />
        ))}
      </div>
      
      {/* Split Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-80 bg-white/5 rounded-2xl border border-white/5" />
      </div>
    </div>
  )
}

export default function VendorDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todayDate, setTodayDate] = useState('')

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    setTodayDate(new Date().toLocaleDateString('en-US', options))
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [analyticsResult, ordersResult] = await Promise.allSettled([
        api.getVendorAnalytics(),
        api.getVendorOrders(1, 5),
      ])

      if (analyticsResult.status === 'fulfilled') {
        setAnalytics(analyticsResult.value as unknown as AnalyticsData)
      } else {
        const err = analyticsResult.reason
        const status = err && typeof err === 'object' && 'status' in err ? (err as { status: number }).status : 0
        if (status === 404) {
          setAnalytics(emptyAnalytics)
        } else {
          throw err instanceof Error ? err : new Error('Failed to load analytics')
        }
      }

      if (ordersResult.status === 'fulfilled') {
        setRecentOrders((ordersResult.value.data ?? []) as OrderItem[])
      } else {
        setRecentOrders([])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
      console.error('[Dashboard] Error loading analytics:', err)
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
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-primary/20"
        >
          <FiRefreshCw size={16} /> Retry
        </button>
      </div>
    )
  }

  const needsStoreSetup = analytics?.storeSetupRequired

  // Build chart bars from monthly revenue data (normalise to %)
  const monthlyData = Array(12).fill(0)
  analytics?.monthlyRevenue?.forEach(({ month, revenue }) => {
    monthlyData[month - 1] = revenue
  })
  const maxRevenue = Math.max(...monthlyData, 1)
  const chartBars = monthlyData.map(v => Math.round((v / maxRevenue) * 100))

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${(analytics?.totalRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Earnings',
      up: true,
      color: 'from-emerald-500/20 to-teal-500/5',
      glow: 'shadow-emerald-500/5',
      textColor: 'text-emerald-400',
      icon: FiDollarSign,
    },
    {
      label: 'Total Orders',
      value: String(analytics?.ordersCount ?? 0),
      change: 'Volume',
      up: (analytics?.ordersCount ?? 0) > 0,
      color: 'from-blue-500/20 to-indigo-500/5',
      glow: 'shadow-blue-500/5',
      textColor: 'text-blue-400',
      icon: FiShoppingBag,
    },
    {
      label: 'Top Products',
      value: String(analytics?.topProducts?.length ?? 0),
      change: 'Active Items',
      up: true,
      color: 'from-purple-500/20 to-pink-500/5',
      glow: 'shadow-purple-500/5',
      textColor: 'text-purple-400',
      icon: FiPackage,
    },
    {
      label: 'Top Customers',
      value: String(analytics?.topCustomers?.length ?? 0),
      change: 'VIP clients',
      up: true,
      color: 'from-amber-500/20 to-orange-500/5',
      glow: 'shadow-amber-500/5',
      textColor: 'text-amber-400',
      icon: FiStar,
    },
  ]

  return (
    <div className="space-y-8">
      {needsStoreSetup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10"
        >
          <div>
            <p className="text-amber-300 font-semibold">Complete your store setup</p>
            <p className="text-sm text-surface-400 mt-1">
              Create your store profile before adding products and receiving orders.
            </p>
          </div>
          <Link
            to="/vendor/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <FiSettings size={16} /> Set Up Store
          </Link>
        </motion.div>
      )}

      {/* Welcome Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-8 border border-white/10 shadow-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-pink-900/20 backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-primary-300 font-bold uppercase tracking-wider bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
              <FiClock /> Store Status: {needsStoreSetup ? 'Setup Required' : 'Open'}
            </div>
            <h1 className="text-4xl font-extrabold text-white">Hello, Partner!</h1>
            <p className="text-surface-400 text-sm max-w-md">
              Here is what is happening with your storefront today. Review orders, products, and insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass border border-white/5 bg-white/5 text-sm text-surface-200">
              <FiCalendar className="text-primary" />
              <span>{todayDate}</span>
            </div>
            <button
              onClick={loadData}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-primary/20"
            >
              <FiRefreshCw size={16} /> Sync Data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, change, up, color, glow, textColor, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              glass
              padding="lg"
              animated={false}
              className={cn(
                'h-full border border-white/5 shadow-xl hover:border-white/10 transition-all duration-300',
                glow
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br', color)}>
                  <Icon size={24} className={textColor} />
                </div>
                <span className={cn('flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider', up ? 'text-emerald-400' : 'text-accent')}>
                  {up ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                  {change}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-surface-400 font-semibold mt-1.5">{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Analytics & Top Products side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card glass padding="lg" animated={false} className="border border-white/5 shadow-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Revenue Trends</h2>
                <p className="text-sm text-surface-400">Sales performance over the last 12 months</p>
              </div>
              <span className="text-2xl font-extrabold text-primary">
                Total: ${(analytics?.totalRevenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
            {/* Chart Area */}
            <div className="flex items-end gap-3 h-52 mt-auto">
              {chartBars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-background-light/95 border border-white/10 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold shadow-xl">
                    ${monthlyData[i].toFixed(2)}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(h, 4)}%` }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/30 to-secondary opacity-75 hover:opacity-100 transition-all cursor-pointer shadow-lg shadow-secondary/10 hover:shadow-secondary/20"
                  />
                  <span className="text-[10px] text-surface-400 font-semibold">{months[i]}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass padding="lg" animated={false} className="border border-white/5 shadow-2xl h-full flex flex-col">
            <h2 className="text-lg font-bold text-white mb-1">Top Products</h2>
            <p className="text-sm text-surface-400 mb-6">Highest performing catalog items</p>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-semibold text-surface-200 truncate">{p.title}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{p.totalSold} units sold</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-primary">${p.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-surface-500 text-sm">No items sold yet.</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card glass padding="none" animated={false} className="overflow-hidden border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-surface-400 mt-0.5">Manage and view recent transactions</p>
            </div>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 text-surface-400">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/2">
                  <tr>
                    {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-surface-400 uppercase tracking-wider border-b border-white/10">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order, i) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.04 }}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-300">
                        {order.user?.name ?? 'Unknown Customer'}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-300 max-w-[200px] truncate">
                        {order.orderItems?.[0]?.title ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-white">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusMap[order.status] ?? 'secondary'} dot>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
