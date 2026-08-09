import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '../../components/ui/Button'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw,
  FiPackage, FiAlertCircle, FiCheckCircle, FiXCircle
} from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'
import type { RootState } from '../../store'

interface Product {
  _id: string
  title: string
  price: number
  stock: number
  category?: { name: string }
  brand?: string
  images?: string[]
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
      <FiXCircle size={11} /> Out of Stock
    </span>
  )
  if (stock < 10) return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <FiAlertCircle size={11} /> Low: {stock}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <FiCheckCircle size={11} /> {stock} in stock
    </span>
  )
}

export default function ProductManagement() {
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!user?._id) return
    setLoading(true)
    setError(null)
    try {
      const response = await api.getProducts({ seller: user._id, limit: 100 })
      setProducts((response.data ?? []) as Product[])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [user?._id])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await api.deleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-7">
      {/* ── Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gradient">My Products</h1>
          <p className="text-surface-500 text-sm mt-1">
            {filtered.length > 0
              ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} listed in your store`
              : 'Your storefront product catalogue'}
          </p>
        </div>
        <Button onClick={() => navigate('/vendor/products/add')} className="neon-glow gap-2 shadow-lg shadow-primary/20">
          <FiPlus size={17} /> New Product
        </Button>
      </motion.div>

      {/* ── Search + Stats Bar ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="relative w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or brand…"
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm',
              'bg-white/5 border border-white/10 backdrop-blur-sm',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none transition-all'
            )}
          />
        </div>

        {/* Mini summary pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Total', val: products.length, color: 'bg-white/5 text-surface-300 border-white/10' },
            { label: 'In Stock', val: products.filter(p => p.stock > 10).length, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { label: 'Low Stock', val: products.filter(p => p.stock > 0 && p.stock <= 10).length, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { label: 'Out of Stock', val: products.filter(p => p.stock === 0).length, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
          ].map(pill => (
            <span key={pill.label} className={cn('px-3 py-1.5 rounded-xl text-xs font-bold border', pill.color)}>
              {pill.val} {pill.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Error ─────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          <span className="flex items-center gap-2"><FiAlertCircle /> {error}</span>
          <button onClick={fetchProducts} className="flex items-center gap-1.5 hover:text-red-300 transition-colors font-semibold">
            <FiRefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ── Loading skeleton ──────────────────────────────── */}
      {loading && !error && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────── */}
      {!loading && !error && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    {['Product', 'Brand', 'Category', 'Price', 'Inventory', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-extrabold text-surface-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((product, i) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden shrink-0">
                            {product.images?.[0]
                              ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                              : <FiPackage size={18} className="text-surface-500" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-surface-100 truncate max-w-[200px]">{product.title}</p>
                            <p className="text-[10px] text-surface-500 font-mono mt-0.5">ID: …{product._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-surface-400">{product.brand || '—'}</span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/15">
                          {product.category?.name ?? 'Uncategorized'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="text-base font-extrabold text-white">${product.price.toFixed(2)}</span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <StockBadge stock={product.stock} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/vendor/products/edit/${product._id}`}>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                              <FiEdit2 size={12} /> Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            disabled={deletingId === product._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === product._id
                              ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                              : <FiTrash2 size={12} />
                            }
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-surface-500">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <FiPackage size={28} />
                </div>
                <div className="text-center">
                  <p className="font-semibold">
                    {search ? `No products match "${search}"` : 'No products yet'}
                  </p>
                  <p className="text-xs mt-1">
                    {search ? 'Try a different search term.' : 'Click "New Product" to add your first item.'}
                  </p>
                </div>
                {!search && (
                  <Button onClick={() => navigate('/vendor/products/add')} size="sm" className="mt-2">
                    <FiPlus size={14} /> Add Product
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
