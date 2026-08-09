import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiFilter, FiChevronDown, FiSearch, FiGrid, FiList, FiStar, FiShoppingCart, FiRefreshCw } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import type { RootState } from '../../store'
import { api } from '../../services/api'

interface Product {
  _id: string
  title: string
  price: number
  rating: number
  numReviews: number
  store?: { storeName: string }
  images: string[]
}

const sortOptions = ['latest', 'priceAsc', 'priceDesc', 'topRated'] as const
const sortLabels: Record<string, string> = {
  latest: 'Newest',
  priceAsc: 'Price: Low to High',
  priceDesc: 'Price: High to Low',
  topRated: 'Best Rating',
}

export default function ProductListing() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { showToast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sort, setSort] = useState<string>(searchParams.get('sortBy') ?? 'latest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState(searchParams.get('keyword') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.getProducts({
        keyword: debouncedSearch || undefined,
        sortBy: sort as 'latest' | 'priceAsc' | 'priceDesc' | 'topRated',
        page,
        limit: 12,
      })
      setProducts((result.data ?? []) as Product[])
      setPagination(result.pagination as typeof pagination)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load products'
      setError(message)
      console.error('[ProductListing] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, sort, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {}
    if (debouncedSearch) params.keyword = debouncedSearch
    if (sort !== 'latest') params.sortBy = sort
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, sort, setSearchParams])

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'error')
      navigate('/login')
      return
    }
    dispatch(addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    }))
    showToast(`${product.title} added to cart!`, 'success')
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Discover Products</h1>
          <p className="text-surface-500">
            {loading ? 'Loading...' : `${pagination.total} products found`}
          </p>
        </motion.div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl text-sm',
                'bg-background-light/50 backdrop-blur-sm border border-white/10',
                'text-surface-100 placeholder:text-surface-500',
                'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none',
              )}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setFilterOpen(!filterOpen)} variant="outline" className="lg:hidden">
              <FiFilter size={16} /> Filters
            </Button>
            <div className="relative">
              <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
                className={cn(
                  'appearance-none pl-4 pr-10 py-3 rounded-xl text-sm',
                  'bg-background-light/50 backdrop-blur-sm border border-white/10',
                  'text-surface-100 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer',
                )}
              >
                {sortOptions.map(o => <option key={o} value={o}>{sortLabels[o]}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" size={16} />
            </div>
            <div className="flex gap-1 glass rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-surface-400 hover:text-surface-200')}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-surface-400 hover:text-surface-200')}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center py-16 gap-4">
            <p className="text-accent font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors"
            >
              <FiRefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <AnimatePresence>
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-surface-500"
              >
                No products found{debouncedSearch ? ` for "${debouncedSearch}"` : ''}.
              </motion.div>
            ) : (
              <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="cursor-pointer"
                  >
                    <Card hover glass padding="md" className="group h-full flex flex-col">
                      <div className={cn('relative rounded-xl flex items-center justify-center mb-4 overflow-hidden bg-background-light/50', viewMode === 'list' ? 'h-32' : 'h-48')}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <span className={cn('text-gray-400 group-hover:scale-110 transition-transform duration-300', viewMode === 'list' ? 'text-4xl' : 'text-6xl')}>📦</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-semibold text-surface-200 mb-2 truncate">{product.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <FiStar className="fill-current" />
                            <span className="text-surface-400 ml-1">{product.rating?.toFixed(1) ?? '0.0'}</span>
                            {product.numReviews > 0 && (
                              <span className="text-surface-500 text-xs">({product.numReviews})</span>
                            )}
                          </div>
                          <span className="text-xs text-surface-500">{product.store?.storeName ?? ''}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={e => { e.stopPropagation(); handleAddToCart(product) }}
                          className="w-full mt-3 gap-2"
                        >
                          <FiShoppingCart size={16} /> Add to Cart
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm">
              Previous
            </Button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-medium transition-colors',
                  p === page ? 'bg-primary text-white neon-glow' : 'glass text-surface-400 hover:text-surface-200',
                )}
              >
                {p}
              </button>
            ))}
            <Button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} variant="outline" size="sm">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
