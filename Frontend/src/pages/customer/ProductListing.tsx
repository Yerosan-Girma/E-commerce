import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiFilter, FiChevronDown, FiX, FiSearch, FiGrid, FiList, FiStar, FiShoppingCart } from 'react-icons/fi'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import type { RootState } from '../../store'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  vendor: string
  badge?: string
  image: string
}

const allProducts: Product[] = [
  { id: '1', name: 'Wireless Noise Cancelling Headphones Pro', price: 199.99, originalPrice: 299.99, rating: 4.7, reviewCount: 1243, vendor: 'TechStore', badge: 'Best Seller', image: '🎧' },
  { id: '2', name: 'Premium Leather Crossbody Bag', price: 89.99, rating: 4.5, reviewCount: 567, vendor: 'FashionHub', image: '👜' },
  { id: '3', name: 'Smart Home Security Camera 4K', price: 129.99, originalPrice: 179.99, rating: 4.8, reviewCount: 892, vendor: 'SmartGadgets', badge: 'New', image: '📷' },
  { id: '4', name: 'Ergonomic Office Chair with Lumbar Support', price: 349.99, rating: 4.6, reviewCount: 234, vendor: 'ComfortLiving', image: '🪑' },
  { id: '5', name: 'Stainless Steel Water Bottle 1L', price: 24.99, originalPrice: 39.99, rating: 4.9, reviewCount: 2100, vendor: 'EcoGoods', image: '💧' },
  { id: '6', name: 'Mechanical Gaming Keyboard RGB', price: 79.99, originalPrice: 119.99, rating: 4.4, reviewCount: 678, vendor: 'GamersZone', image: '⌨️' },
  { id: '7', name: 'Organic Matcha Green Tea Set', price: 34.99, rating: 4.7, reviewCount: 445, vendor: 'TeaHouse', image: '🍵' },
  { id: '8', name: 'Yoga Mat Non-Slip Premium', price: 42.99, originalPrice: 59.99, rating: 4.6, reviewCount: 889, vendor: 'FitLife', image: '🧘' },
  { id: '9', name: 'Running Shoes Ultra Boost', price: 149.99, rating: 4.8, reviewCount: 1456, vendor: 'SportZone', badge: 'Trending', image: '👟' },
  { id: '10', name: 'Bluetooth Portable Speaker Waterproof', price: 59.99, originalPrice: 89.99, rating: 4.5, reviewCount: 723, vendor: 'TechStore', image: '🔊' },
  { id: '11', name: 'Cotton T-Shirt Multipack (3 pcs)', price: 29.99, rating: 4.3, reviewCount: 2340, vendor: 'FashionHub', image: '👕' },
  { id: '12', name: 'Smart Fitness Tracker Watch', price: 99.99, originalPrice: 149.99, rating: 4.6, reviewCount: 980, vendor: 'SmartGadgets', image: '⌚' },
]

const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']
const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Food']
const priceRanges = ['All', 'Under $25', '$25–$50', '$50–$100', '$100–$200', 'Over $200']

export default function ProductListing() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)
  const [sort, setSort] = useState('Relevance')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const perPage = 8

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'error')
      navigate('/login')
      return
    }
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: undefined }))
    showToast(`${product.name} added to cart!`, 'success')
  }

  const filtered = allProducts.filter(p => {
    if (minRating > 0 && p.rating < minRating) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price
    if (sort === 'Price: High to Low') return b.price - a.price
    if (sort === 'Best Rating') return b.rating - a.rating
    return 0
  })

  const totalPages = Math.ceil(sorted.length / perPage)
  const paginated = sorted.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">Discover Products</h1>
          <p className="text-surface-500">{sorted.length} products found</p>
        </motion.div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search products..."
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl text-sm',
                'bg-background-light/50 backdrop-blur-sm border border-white/10',
                'text-surface-100 placeholder:text-surface-500',
                'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
              )}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setFilterOpen(!filterOpen)}
              variant="outline"
              className="lg:hidden"
            >
              <FiFilter size={16} /> Filters
            </Button>
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className={cn(
                  'appearance-none pl-4 pr-10 py-3 rounded-xl text-sm',
                  'bg-background-light/50 backdrop-blur-sm border border-white/10',
                  'text-surface-100 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer'
                )}
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
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

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={cn('w-64 shrink-0 space-y-6', filterOpen ? 'hidden' : 'hidden lg:block')}>
            <Card glass padding="lg">
              <h3 className="text-sm font-bold text-surface-200 mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setPage(1) }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors',
                      category === c
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Card>

            <Card glass padding="lg">
              <h3 className="text-sm font-bold text-surface-200 mb-4">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(r => (
                  <button
                    key={r}
                    onClick={() => { setPriceRange(r); setPage(1) }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors',
                      priceRange === r
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Card>

            <Card glass padding="lg">
              <h3 className="text-sm font-bold text-surface-200 mb-4">Min Rating</h3>
              <div className="space-y-2">
                {[0, 3, 4, 4.5].map(r => (
                  <button
                    key={r}
                    onClick={() => { setMinRating(r); setPage(1) }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2',
                      minRating === r
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
                    )}
                  >
                    {r === 0 ? 'All' : (
                      <>
                        <FiStar className="fill-current" size={14} /> {r}+
                      </>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {(category !== 'All' || priceRange !== 'All' || minRating > 0) && (
              <button
                onClick={() => { setCategory('All'); setPriceRange('All'); setMinRating(0); setPage(1) }}
                className="flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <FiX size={14} /> Clear all filters
              </button>
            )}
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-6 glass-card p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-surface-200">Filters</span>
                    <button onClick={() => setFilterOpen(false)}><FiX size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-colors', category === c ? 'bg-primary text-white' : 'glass text-surface-300')}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
            )}>
              {paginated.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card hover glass padding="md" className="group">
                    <div className={cn('relative rounded-xl flex items-center justify-center mb-4 overflow-hidden', viewMode === 'list' ? 'h-32 w-32' : 'h-48 bg-background-light/50')}>
                      <span className={cn('group-hover:scale-110 transition-transform duration-300', viewMode === 'list' ? 'text-4xl' : 'text-6xl')}>{product.image}</span>
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-xs px-3 py-1 rounded-full font-semibold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className={cn(viewMode === 'list' ? 'flex-1 ml-4' : '')}>
                      <h3 className="font-semibold text-surface-200 mb-2 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-surface-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <FiStar className="fill-current" />
                          <span className="text-surface-400 ml-1">{product.rating}</span>
                          <span className="text-surface-500 text-xs">({product.reviewCount})</span>
                        </div>
                        <span className="text-xs text-surface-500">{product.vendor}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="w-full mt-3 gap-2"
                      >
                        <FiShoppingCart size={16} /> Add to Cart
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-sm font-medium transition-colors',
                      p === page ? 'bg-primary text-white neon-glow' : 'glass text-surface-400 hover:text-surface-200'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
