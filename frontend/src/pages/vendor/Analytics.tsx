import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart2, FiTrendingUp, FiUsers, FiPackage, FiRefreshCw, FiDownload } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

interface AnalyticsData {
  totalRevenue: number
  monthlyRevenue: { month: number; year: number; revenue: number }[]
  ordersCount: number
  topProducts: { title: string; totalSold: number; revenue: number }[]
  topCustomers: { name: string; email: string; totalOrders: number; totalSpent: number }[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getVendorAnalytics() as unknown as AnalyticsData
      setAnalytics(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const monthlyData = Array(12).fill(0)
  analytics?.monthlyRevenue?.forEach(({ month, revenue }) => {
    monthlyData[month - 1] = revenue
  })
  const maxRevenue = Math.max(...monthlyData, 1)

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-xl" />
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <Button onClick={loadData} className="gap-2">
          <FiRefreshCw size={16} /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gradient">Analytics</h1>
          <p className="text-surface-500 text-sm mt-1">Detailed insights into your store performance</p>
        </div>
        <Button variant="outline" className="gap-2 border-white/10 text-surface-300">
          <FiDownload size={16} /> Export Report
        </Button>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `$${(analytics?.totalRevenue ?? 0).toLocaleString()}`, icon: FiTrendingUp, color: 'text-emerald-400' },
          { label: 'Total Orders', value: String(analytics?.ordersCount ?? 0), icon: FiBarChart2, color: 'text-blue-400' },
          { label: 'Top Products', value: String(analytics?.topProducts?.length ?? 0), icon: FiPackage, color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card glass padding="lg" animated={false} className="border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-xs text-surface-500 font-semibold">{label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card glass padding="lg" animated={false} className="border border-white/5 h-full">
            <h3 className="text-lg font-bold text-gradient mb-1">Revenue</h3>
            <p className="text-sm text-surface-500 mb-6">Monthly revenue breakdown</p>
            <div className="flex items-end gap-2 h-48">
              {monthlyData.map((val, i) => {
                const h = Math.round((val / maxRevenue) * 100)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className="absolute bottom-full mb-1 bg-background-light/95 border border-white/10 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                      ${val.toFixed(0)}
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-secondary/60 opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${Math.max(h, 4)}%` }}
                    />
                    <span className="text-[9px] text-surface-500">{months[i]}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Orders trend placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card glass padding="lg" animated={false} className="border border-white/5 h-full">
            <h3 className="text-lg font-bold text-gradient mb-1">Orders Trend</h3>
            <p className="text-sm text-surface-500 mb-6">Order volume over time</p>
            <div className="h-48 flex items-center justify-center rounded-xl bg-white/5 border border-white/5">
              <div className="text-center text-surface-500">
                <FiBarChart2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{analytics?.ordersCount ?? 0} total orders</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card glass padding="lg" animated={false} className="border border-white/5">
            <h3 className="text-lg font-bold text-gradient mb-1">Top Products</h3>
            <p className="text-sm text-surface-500 mb-6">Best sellers by revenue</p>
            <ul className="space-y-3">
              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((p, i) => (
                  <li key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                        i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-surface-400',
                      )}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-surface-200 truncate">{p.title}</span>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0 ml-2">${p.revenue.toFixed(2)}</span>
                  </li>
                ))
              ) : (
                <li className="text-center py-8 text-surface-500 text-sm">No sales data yet</li>
              )}
            </ul>
          </Card>
        </motion.div>

        {/* Top Customers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card glass padding="lg" animated={false} className="border border-white/5">
            <h3 className="text-lg font-bold text-gradient mb-1">Top Customers</h3>
            <p className="text-sm text-surface-500 mb-6">Your most valuable buyers</p>
            <ul className="space-y-3">
              {analytics?.topCustomers && analytics.topCustomers.length > 0 ? (
                analytics.topCustomers.map((c, i) => (
                  <li key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FiUsers size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-200 truncate">{c.name}</p>
                        <p className="text-[11px] text-surface-500">{c.totalOrders} orders</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0 ml-2">${c.totalSpent.toFixed(2)}</span>
                  </li>
                ))
              ) : (
                <li className="text-center py-8 text-surface-500 text-sm">No customer data yet</li>
              )}
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
