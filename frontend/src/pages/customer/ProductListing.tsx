import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiFilter, FiChevronDown, FiSearch, FiGrid, FiList, FiStar, FiShoppingCart, FiRefreshCw, FiPackage } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import type { RootState } from '../../store'
import { api, clearCache } from '../../services/api'

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
  latest:   'Newest',
  priceAsc: 'Price: Low to High',
  priceDesc:'Price: High to Low',
  topRated: 'Best Rating',
}

export default function ProductListing() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { showToast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)

  const [products, setProducts]     = useState<Product[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [sort, setSort]             = useState<string>(searchParams.get('sortBy') ?? 'latest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch]         = useState(searchParams.get('keyword') ?? '')
  const [category, setCategory]     = useState(searchParams.get('category') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [page, setPage]             = useState(1)
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      clearCache('products') // Clear cache when search changes
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const result = await api.getProducts({
        keyword: debouncedSearch || undefined,
        category: category || undefined,
        sortBy: sort as 'latest' | 'priceAsc' | 'priceDesc' | 'topRated',
        page, limit: 12,
      })
      setProducts((result.data ?? []) as Product[])
      setPagination(result.pagination as typeof pagination)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, category, sort, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (debouncedSearch) params.keyword = debouncedSearch
    if (sort !== 'latest') params.sortBy = sort
    if (category) params.category = category
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, sort, category, setSearchParams])

  // Sync category when URL changes (e.g. clicking a category card)
  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? ''
    if (urlCategory !== category) {
      setCategory(urlCategory)
      setPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('category')])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) { showToast('Please login to add items to cart', 'error'); navigate('/login'); return }
    dispatch(addToCart({ id: product._id, name: product.title, price: product.price, quantity: 1, image: product.images?.[0] }))
    showToast(`${product.title} added to cart!`, 'success')
  }

  const inputCls = cn(
    'w-full rounded-xl border px-4 py-3 text-sm font-medium',
    'bg-background-light/60 backdrop-blur-sm border-white/12',
    'text-surface-100 placeholder:text-surface-500',
    'focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all',
  )

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient mb-2 tracking-tight">
            Discover Products
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-surface-500 text-base">
              {loading ? 'Loading…' : `${pagination.total} product${pagination.total !== 1 ? 's' : ''} found`}
            </p>
            {category && !loading && (
              <button
                onClick={() => { setCategory(''); setPage(1) }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/25 transition-colors"
              >
                Filtering by category
                <span className="text-primary/60 hover:text-primary ml-0.5">×</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Search + Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={17} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, brands…"
              className={cn(inputCls, 'pl-12')}
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button onClick={() => setFilterOpen(!filterOpen)} variant="outline" className="lg:hidden" size="sm">
              <FiFilter size={15} /> Filters
            </Button>
            <div className="relative flex-1 min-w-0 sm:flex-none">
              <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
                className={cn(inputCls, 'appearance-none pl-4 pr-10 cursor-pointer')}
              >
                {sortOptions.map(o => <option key={o} value={o}>{sortLabels[o]}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" size={15} />
            </div>
            <div className="flex gap-1 glass rounded-xl p-1 shrink-0">
              {[{ mode: 'grid', Icon: FiGrid }, { mode: 'list', Icon: FiList }].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as 'grid' | 'list')}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    viewMode === mode
                      ? 'bg-primary/20 text-primary shadow-sm'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-white/5',
                  )}
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-2">
              <FiRefreshCw className="text-red-400" size={28} />
            </div>
            <p className="text-surface-300 font-semibold text-lg">{error}</p>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 font-semibold transition-colors"
            >
              <FiRefreshCw size={15} /> Retry
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && !error && (
          <div className={cn('grid gap-6', viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1')}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5 animate-pulse">
                <div className="h-56 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-8 bg-white/5 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-24 gap-4 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-2">
                  <FiPackage size={36} className="text-surface-500" />
                </div>
                <p className="text-surface-300 font-semibold text-lg">No products found</p>
                {debouncedSearch && (
                  <p className="text-surface-500 text-sm">for "{debouncedSearch}"</p>
                )}
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-primary text-sm font-semibold hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className={cn('grid gap-6', viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1')}
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28, delay: i * 0.035 }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className={cn(
                      'h-full flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden',
                      'glass-card border-white/10 hover:border-primary/30',
                      'hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1',
                      viewMode === 'list' && 'flex-col sm:flex-row',
                    )}>
                      {/* Image */}
                      <div className={cn(
                        'relative overflow-hidden bg-gradient-to-br from-background-light to-background flex items-center justify-center shrink-0',
                        viewMode === 'list' ? 'w-full h-48 sm:w-40 sm:h-auto sm:rounded-l-2xl' : 'h-52 w-full',
                      )}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={e => {
                              const img = e.target as HTMLImageElement
                              img.style.display = 'none'
                              const next = img.nextElementSibling as HTMLElement | null
                              next?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <span className={cn(
                          'absolute text-surface-600 group-hover:scale-110 transition-transform duration-300',
                          viewMode === 'list' ? 'text-4xl' : 'text-6xl',
                          product.images?.[0] ? 'hidden' : '',
                        )}>📦</span>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col p-5">
                        <h3 className="font-bold text-surface-100 mb-1.5 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating & Store */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <FiStar size={13} className="fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-surface-200">
                              {product.rating?.toFixed(1) ?? '0.0'}
                            </span>
                            {product.numReviews > 0 && (
                              <span className="text-surface-500 text-xs">({product.numReviews})</span>
                            )}
                          </div>
                          {product.store?.storeName && (
                            <span className="text-xs font-medium text-surface-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
                              {product.store.storeName}
                            </span>
                          )}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between mt-auto gap-3">
                          <span className="text-2xl font-extrabold text-white tracking-tight">
                            ${product.price.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            onClick={e => handleAddToCart(product, e)}
                            className="shrink-0 gap-1.5"
                          >
                            <FiShoppingCart size={14} />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline" size="sm"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200',
                  p === page
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                    : 'glass text-surface-400 hover:text-surface-200 hover:bg-white/8',
                )}
              >
                {p}
              </button>
            ))}
            <Button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              variant="outline" size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
