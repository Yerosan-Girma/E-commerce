import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiRefreshCw, FiChevronDown, FiAlertCircle, FiShoppingBag } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'
import { useToast } from '../../components/ui/Toast'

interface Order {
  _id: string
  user: { name: string; email: string }
  createdAt: string
  orderItems: Array<{ product: string; title: string; quantity: number; price: number }>
  totalPrice: number
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:    { bg: 'bg-amber-500/10 border-amber-500/20',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  Paid:       { bg: 'bg-cyan-500/10 border-cyan-500/20',     text: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  Processing: { bg: 'bg-blue-500/10 border-blue-500/20',     text: 'text-blue-400',    dot: 'bg-blue-400'    },
  Shipped:    { bg: 'bg-violet-500/10 border-violet-500/20', text: 'text-violet-400',  dot: 'bg-violet-400'  },
  Delivered:  { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400'},
  Cancelled:  { bg: 'bg-red-500/10 border-red-500/20',       text: 'text-red-400',     dot: 'bg-red-400'     },
}

function StatusBadge({ status }: { status: string }) {
  const s = statusStyles[status] ?? statusStyles.Pending
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border', s.bg, s.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', s.dot)} />
      {status}
    </span>
  )
}

const ALL_STATUSES = ['all', 'Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

export default function OrderManagement() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getVendorOrders(1, 100)
      setOrders((res.data ?? []) as Order[])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendor orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      await api.updateVendorOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o))
      showToast(`Order updated to ${newStatus}`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = o._id.toLowerCase().includes(q) || (o.user?.name ?? '').toLowerCase().includes(q)
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const counts: Record<string, number> = { all: orders.length }
  orders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1 })

  return (
    <div className="space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gradient">Order Management</h1>
          <p className="text-surface-500 text-sm mt-1">
            {orders.length > 0 ? `${orders.length} orders across your store` : 'Manage and update customer orders'}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold glass border border-white/10 text-surface-300 rounded-xl hover:bg-white/10 hover:text-white transition-all"
        >
          <FiRefreshCw size={14} /> Sync Orders
        </button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm',
              'bg-white/5 border border-white/10 backdrop-blur-sm',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none transition-all'
            )}
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 p-1.5 bg-white/5 border border-white/8 rounded-2xl overflow-x-auto">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap',
                filter === s
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'
              )}
            >
              {s} {counts[s] !== undefined && <span className="opacity-60 ml-0.5">({counts[s]})</span>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          <span className="flex items-center gap-2"><FiAlertCircle /> {error}</span>
          <button onClick={fetchOrders} className="flex items-center gap-1.5 hover:text-red-300 transition-colors font-semibold">
            <FiRefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-extrabold text-surface-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((order, i) => {
                    const canUpdate = ['Paid', 'Processing', 'Shipped'].includes(order.status)
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-extrabold text-primary font-mono">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-surface-200">{order.user?.name ?? 'Unknown'}</p>
                          <p className="text-[11px] text-surface-500">{order.user?.email ?? ''}</p>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <div className="min-w-0">
                            <p className="text-sm text-surface-300 truncate max-w-[160px]">
                              {order.orderItems?.[0]?.title ?? '—'}
                            </p>
                            {order.orderItems.length > 1 && (
                              <p className="text-[11px] text-surface-500">+{order.orderItems.length - 1} more items</p>
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <span className="text-base font-extrabold text-white">${order.totalPrice.toFixed(2)}</span>
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-surface-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Update Status */}
                        <td className="px-6 py-4">
                          {updatingId === order._id ? (
                            <span className="text-xs text-surface-500 flex items-center gap-1.5">
                              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              Updating…
                            </span>
                          ) : canUpdate ? (
                            <div className="relative inline-flex items-center">
                              <select
                                defaultValue={order.status === 'Paid' ? 'Processing' : order.status}
                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                className={cn(
                                  'appearance-none pl-3.5 pr-9 py-2 rounded-xl text-xs font-bold cursor-pointer',
                                  'bg-white/8 border border-white/12 backdrop-blur-sm',
                                  'text-surface-200 outline-none',
                                  'focus:ring-2 focus:ring-primary/40 transition-all hover:bg-white/12'
                                )}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" size={13} />
                            </div>
                          ) : (
                            <span className="text-xs text-surface-600 italic">—</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-surface-500">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <FiShoppingBag size={28} />
                </div>
                <div className="text-center">
                  <p className="font-semibold">
                    {search ? `No orders match "${search}"` : filter !== 'all' ? `No ${filter} orders` : 'No orders yet'}
                  </p>
                  <p className="text-xs mt-1">Orders appear here when customers purchase from your store.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
