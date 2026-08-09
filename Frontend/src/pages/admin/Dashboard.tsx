import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiDollarSign, FiUsers, FiShoppingBag, FiArrowUp,
  FiRefreshCw, FiTrendingUp, FiAward, FiActivity, FiGrid
} from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface AdminData {
  usersCount: number
  vendorsCount: number
  productsCount: number
  ordersCount: number
  salesRevenue: number
  monthlySales: { month: number; year: number; revenue: number; orders: number }[]
  ordersByStatus: { _id: string; count: number }[]
}

const statusColors: Record<string, string> = {
  Delivered: 'from-emerald-500 to-teal-500',
  Processing: 'from-blue-500 to-indigo-500',
  Shipped:    'from-violet-500 to-purple-500',
  Cancelled:  'from-red-500 to-rose-500',
  Pending:    'from-amber-500 to-orange-500',
  Paid:       'from-cyan-500 to-sky-500',
}

interface StatCardProps {
  label: string
  value: string
  sub: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  colorClass: string
  delay: number
}

function StatCard({ label, value, sub, icon: Icon, colorClass, delay }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className="relative h-full rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 shadow-xl hover:border-white/15 hover:bg-white/5 transition-all duration-300 group overflow-hidden">
        {/* glow blob */}
        <div className={cn('absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity pointer-events-none', colorClass)} />

        <div className="flex items-start justify-between mb-5">
          <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', colorClass)}>
            <Icon size={22} className="text-white" />
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
            <FiArrowUp size={10} /> {sub}
          </span>
        </div>

        <p className="text-3xl font-extrabold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-1">{value}</p>
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-48 bg-white/5 rounded-3xl" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-white/5 rounded-2xl border border-white/5" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-white/5 rounded-2xl border border-white/5" />
        <div className="h-72 bg-white/5 rounded-2xl border border-white/5" />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await api.getAdminAnalytics() as unknown as AdminData
      setData(d)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load admin analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-accent text-lg font-semibold">{error}</p>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-primary/20"
        >
          <FiRefreshCw size={16} /> Retry
        </button>
      </div>
    )
  }

  // Monthly chart
  const monthlyRevArr = Array(12).fill(0)
  data?.monthlySales?.forEach(({ month, revenue }) => { monthlyRevArr[month - 1] = revenue })
  const maxRev = Math.max(...monthlyRevArr, 1)

  const aov = data?.ordersCount ? ((data.salesRevenue ?? 0) / data.ordersCount) : 0

  interface StatItem { label: string; value: string; sub: string; icon: React.ComponentType<{ size?: number; className?: string }>; colorClass: string; delay: number }
  const stats: StatItem[] = [
    { label: 'Gross Revenue',   value: `$${(data?.salesRevenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, sub: 'Platform',   icon: FiDollarSign,  colorClass: 'from-emerald-500 to-teal-600',  delay: 0.1  },
    { label: 'Total Customers', value: (data?.usersCount ?? 0).toLocaleString(),                                                sub: 'Registered', icon: FiUsers,       colorClass: 'from-blue-500 to-indigo-600',   delay: 0.15 },
    { label: 'Total Orders',    value: (data?.ordersCount ?? 0).toLocaleString(),                                               sub: 'All time',   icon: FiShoppingBag, colorClass: 'from-violet-500 to-purple-600', delay: 0.2  },
    { label: 'Avg Order Value', value: `$${aov.toFixed(2)}`,                                                                    sub: 'Per order',  icon: FiTrendingUp,  colorClass: 'from-amber-500 to-orange-600',  delay: 0.25 },
  ]

  return (
    <div className="space-y-8">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden px-8 py-10 border border-white/8 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,.25) 0%, rgba(79,70,229,.15) 40%, rgba(219,39,119,.15) 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-64 h-64 bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <FiActivity size={10} /> System Status · Live
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              Admin Control Centre
            </h1>
            <p className="text-surface-400 text-sm max-w-lg">
              Real-time platform metrics pulled directly from MongoDB Atlas. Everything you need to manage the marketplace in one view.
            </p>
          </div>

          {/* Quick KPI pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Vendors', value: data?.vendorsCount ?? 0, icon: FiAward },
              { label: 'Products', value: data?.productsCount ?? 0, icon: FiGrid },
            ].map(({ label, value, icon: Ic }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Ic size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-surface-400 font-medium">{label}</p>
                  <p className="text-xl font-extrabold text-white leading-tight">{value.toLocaleString()}</p>
                </div>
              </div>
            ))}
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-primary/20 text-sm"
            >
              <FiRefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Revenue Chart + Order Status side-by-side ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gradient">Monthly Revenue</h2>
                <p className="text-xs text-surface-500 mt-0.5">All paid orders — 12-month window</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-gradient">${(data?.salesRevenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-surface-500">Total revenue</p>
              </div>
            </div>

            <div className="flex items-end gap-2 h-52 mt-auto">
              {monthlyRevArr.map((rev, i) => {
                const pct = Math.round((rev / maxRev) * 100)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute bottom-8 bg-background-dark/95 border border-white/10 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold shadow-2xl whitespace-nowrap z-10">
                      {months[i]}: ${rev.toFixed(0)}
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct, 4)}%` }}
                      transition={{ delay: 0.35 + i * 0.04, type: 'spring', stiffness: 60 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 via-violet-500/60 to-secondary opacity-80 hover:opacity-100 cursor-pointer transition-opacity shadow-lg shadow-purple-500/10"
                    />
                    <span className="text-[9px] font-semibold text-surface-500 uppercase">{months[i].slice(0, 1)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-lg font-bold text-gradient mb-1">Order Status</h2>
            <p className="text-xs text-surface-500 mb-6">Breakdown across all orders</p>

            <div className="space-y-4 flex-1">
              {data?.ordersByStatus && data.ordersByStatus.length > 0 ? (
                data.ordersByStatus.map((item, i) => {
                  const total = data.ordersByStatus.reduce((s, x) => s + x.count, 0)
                  const pct   = total > 0 ? Math.round((item.count / total) * 100) : 0
                  const grad  = statusColors[item._id] ?? 'from-slate-500 to-gray-500'
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                    >
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-semibold text-surface-200">{item._id}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-surface-100">{item.count}</span>
                          <span className="text-[10px] font-bold text-surface-500 w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 50 }}
                          className={cn('h-full rounded-full bg-gradient-to-r shadow-sm', grad)}
                        />
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <p className="text-surface-500 text-sm text-center py-8">No order data yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
