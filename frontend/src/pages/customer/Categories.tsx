import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPackage, FiRefreshCw, FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
}

interface RichCategory extends Category {
  image: string
  color: string
  tags: string[]
  count: string
  icon: string
}

// Fallback / enrichment assets for categories
const RICH_METADATA: Record<string, {
  image: string
  color: string
  tags: string[]
  count: string
  icon: string
}> = {
  electronics: {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e4236e66?auto=format&fit=crop&w=600&q=80',
    color: 'from-blue-500 to-indigo-600 shadow-blue-500/20',
    tags: ['Phones', 'Laptops', 'Audio', 'Smart Home'],
    count: '150+ Products',
    icon: '💻',
  },
  fashion: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    color: 'from-pink-500 to-rose-600 shadow-pink-500/20',
    tags: ['Clothing', 'Shoes', 'Accessories', 'Watches'],
    count: '240+ Products',
    icon: '👗',
  },
  'home-living': {
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-400 to-amber-600 shadow-orange-500/20',
    tags: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
    count: '98+ Products',
    icon: '🏠',
  },
  'home & living': {
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-400 to-amber-600 shadow-orange-500/20',
    tags: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
    count: '98+ Products',
    icon: '🏠',
  },
  sports: {
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
    color: 'from-green-500 to-emerald-600 shadow-green-500/20',
    tags: ['Fitness', 'Outdoor', 'Footwear', 'Gear'],
    count: '75+ Products',
    icon: '⚽',
  },
  books: {
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-500 to-violet-600 shadow-purple-500/20',
    tags: ['Fiction', 'Science', 'Biography', 'Self-Help'],
    count: '110+ Products',
    icon: '📚',
  },
  beauty: {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-400 to-pink-600 shadow-rose-500/20',
    tags: ['Skincare', 'Makeup', 'Fragrances', 'Haircare'],
    count: '85+ Products',
    icon: '💄',
  },
  toys: {
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80',
    color: 'from-yellow-400 to-amber-500 shadow-yellow-500/20',
    tags: ['Board Games', 'Action Figures', 'Puzzles', 'Dolls'],
    count: '60+ Products',
    icon: '🧸',
  },
  food: {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    color: 'from-teal-400 to-cyan-600 shadow-teal-500/20',
    tags: ['Groceries', 'Snacks', 'Beverages', 'Organic'],
    count: '120+ Products',
    icon: '🍕',
  },
}

// Full offline backup catalog to display when backend cannot be reached
const FALLBACK_CATEGORIES: Category[] = [
  { _id: 'electronics', name: 'Electronics', slug: 'electronics', description: 'Explore state-of-the-art gadgets, smart home appliances, high-performance laptops, and audio systems.' },
  { _id: 'fashion', name: 'Fashion', slug: 'fashion', description: 'Stay ahead of the curve with our collection of seasonal apparel, footwear, designer items, and lifestyle accessories.' },
  { _id: 'home-living', name: 'Home & Living', slug: 'home-living', description: 'Elevate your daily environment with premium furniture, lighting solutions, kitchenware, and modern decor pieces.' },
  { _id: 'sports', name: 'Sports', slug: 'sports', description: 'Gear up for performance with professional athletic wear, outdoor camping equipment, and fitness accessories.' },
  { _id: 'books', name: 'Books', slug: 'books', description: 'Immerse yourself in literature ranging from bestseller fiction and biography to scientific guides and kids stories.' },
  { _id: 'beauty', name: 'Beauty', slug: 'beauty', description: 'Pamper your skin and body with natural cosmetics, luxury fragrances, specialized haircare, and skin serums.' },
  { _id: 'toys', name: 'Toys', slug: 'toys', description: 'Nurture creativity and motor skills with interactive building blocks, board games, and fun educational toys.' },
  { _id: 'food', name: 'Food', slug: 'food', description: 'Savor organic food supplies, fresh daily groceries, artisanal coffee beans, and premium healthy snacks.' }
]

// Framer Motion staggered animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 85,
      damping: 14
    }
  }
}

export default function Categories() {
  const [categories, setCategories] = useState<RichCategory[]>([])
  const [loading, setLoading]       = useState(true)
  const [isOffline, setIsOffline]   = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid')

  const useFallbackCatalog = (errorMessage: string) => {
    console.warn(`Falling back to offline catalog: ${errorMessage}`)
    const enriched = FALLBACK_CATEGORIES.map((cat) => {
      const key = cat.slug?.toLowerCase() || cat.name?.toLowerCase() || 'default'
      const meta = RICH_METADATA[key] || {
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        color: 'from-surface-300 to-surface-500 shadow-surface-500/20',
        tags: ['General', 'Products'],
        count: 'Check Shop',
        icon: '🛍️'
      }
      return { ...cat, ...meta }
    })
    setCategories(enriched)
    setIsOffline(true)
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getCategories() as unknown as Category[]
      if (Array.isArray(data) && data.length > 0) {
        const enriched = data.map((cat) => {
          const key = cat.slug?.toLowerCase() || cat.name?.toLowerCase() || 'default'
          const meta = RICH_METADATA[key] || {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
            color: 'from-surface-300 to-surface-500 shadow-surface-500/20',
            tags: ['General', 'Products'],
            count: 'Check Shop',
            icon: '🛍️'
          }
          return { ...cat, ...meta }
        })
        setCategories(enriched)
        setIsOffline(false)
      } else {
        useFallbackCatalog('No categories returned from server')
      }
    } catch (err) {
      useFallbackCatalog(err instanceof Error ? err.message : 'API failure')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Filter logic based on searchTerm
  const filteredCategories = categories.filter((cat) => {
    const search = searchTerm.toLowerCase().trim()
    if (!search) return true
    return (
      cat.name.toLowerCase().includes(search) ||
      cat.slug.toLowerCase().includes(search) ||
      (cat.description && cat.description.toLowerCase().includes(search)) ||
      cat.tags.some((tag) => tag.toLowerCase().includes(search))
    )
  })

  // Dynamic statistics
  const totalSubNiches = Array.from(new Set(categories.flatMap((c) => c.tags))).length
  const estimatedProductCount = categories.length * 120

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0F19] via-[#0E1527] to-[#0B0F19] overflow-hidden">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient mb-3 sm:mb-4 tracking-tight">
            Browse Categories
          </h1>
          <p className="text-surface-400 max-w-xl mx-auto text-base">
            Explore our wide range of premium categories and find exactly what you're looking for with speed.
          </p>
        </motion.div>

        {/* Dashboard Stats Panel */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-10 max-w-3xl mx-auto"
          >
            <div className="glass-card p-4 text-center border border-white/5 bg-white/2">
              <div className="text-2xl sm:text-3xl font-extrabold text-gradient">{categories.length}</div>
              <div className="text-[10px] sm:text-xs text-surface-400 mt-1 uppercase tracking-wider font-semibold">Categories</div>
            </div>
            <div className="glass-card p-4 text-center border border-white/5 bg-white/2">
              <div className="text-2xl sm:text-3xl font-extrabold text-gradient">{totalSubNiches}</div>
              <div className="text-[10px] sm:text-xs text-surface-400 mt-1 uppercase tracking-wider font-semibold">Sub-Niches</div>
            </div>
            <div className="glass-card p-4 text-center border border-white/5 bg-white/2">
              <div className="text-2xl sm:text-3xl font-extrabold text-gradient">{estimatedProductCount}+</div>
              <div className="text-[10px] sm:text-xs text-surface-400 mt-1 uppercase tracking-wider font-semibold">Estimated Items</div>
            </div>
          </motion.div>
        )}

        {/* Search and Layout Controls */}
        {!loading && categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-stretch md:items-center mb-8 max-w-5xl mx-auto w-full"
          >
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Search categories, sub-niches or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 focus:bg-white/10 focus:outline-none rounded-2xl text-white placeholder-surface-400 transition-all shadow-inner text-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-surface-400 hover:text-white text-lg font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Offline Badge & View Toggle */}
            <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
              {isOffline && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold shadow-lg shadow-amber-500/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Offline Demo Catalog
                </div>
              )}
              
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all cursor-pointer",
                    viewMode === 'grid' ? "bg-primary/20 text-primary" : "text-surface-400 hover:text-white"
                  )}
                  title="Grid View"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all cursor-pointer",
                    viewMode === 'list' ? "bg-primary/20 text-primary" : "text-surface-400 hover:text-white"
                  )}
                  title="List View"
                >
                  <FiList size={18} />
                </button>
              </div>

              <button
                onClick={load}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-surface-300 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer"
                title="Sync Catalog"
              >
                <FiRefreshCw size={15} className={cn(loading && "animate-spin")} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="h-[360px] glass-card animate-pulse rounded-3xl p-6 flex flex-col justify-between border border-white/10"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5" />
                    <div className="w-20 h-6 rounded-full bg-white/5" />
                  </div>
                  <div className="h-6 w-2/3 bg-white/5 rounded-md mb-3" />
                  <div className="h-4 w-full bg-white/5 rounded-md mb-2" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-md mb-2" />
                </div>
                <div>
                  <div className="flex gap-1.5 mb-5">
                    <div className="w-12 h-4 bg-white/5 rounded" />
                    <div className="w-16 h-4 bg-white/5 rounded" />
                    <div className="w-14 h-4 bg-white/5 rounded" />
                  </div>
                  <div className="h-10 w-full bg-white/5 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Cards Display */}
        {!loading && filteredCategories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={cn(
              "max-w-6xl mx-auto",
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                : "flex flex-col gap-6"
            )}
          >
            {filteredCategories.map((cat) => {
              if (viewMode === 'grid') {
                return (
                  <motion.div
                    key={cat._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative group flex flex-col justify-between min-h-[340px] sm:h-[370px] rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl hover:shadow-primary/5"
                  >
                    {/* Background Cover Image with overlay */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
                    </div>

                    {/* Ambient glow highlight overlay on hover */}
                    <div className={cn(
                      "absolute inset-0 -z-10 bg-gradient-to-tr opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500",
                      cat.color
                    )} />

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
                      {/* Top section info */}
                      <div>
                        {/* Icon and product count */}
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg",
                            cat.color
                          )}>
                            {cat.icon}
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 border border-white/10 text-surface-300 rounded-full">
                            {cat.count}
                          </span>
                        </div>

                        {/* Title and description */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-surface-400 line-clamp-3 leading-relaxed mb-4">
                          {cat.description || `Explore products in our curated ${cat.name} category.`}
                        </p>
                      </div>

                      {/* Bottom section (tags and cta) */}
                      <div>
                        {/* Sub-tags */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {cat.tags.map((tag) => (
                            <span 
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSearchTerm(tag);
                              }}
                              className="text-[9px] font-semibold px-2 py-0.5 bg-white/5 hover:bg-primary/20 hover:text-white rounded-md border border-white/5 transition-all cursor-pointer text-surface-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Shop link */}
                        <Link
                          to={`/products?category=${encodeURIComponent(cat._id)}`}
                          className="flex items-center justify-center w-full py-3 bg-white/5 group-hover:bg-primary/20 border border-white/5 group-hover:border-primary/30 rounded-2xl text-xs font-bold text-white group-hover:text-primary-light transition-all duration-300 cursor-pointer"
                        >
                          Explore Catalog
                          <FiArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              } else {
                // List View Card Layout
                return (
                  <motion.div
                    key={cat._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.005, y: -2 }}
                    className="relative group rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col sm:flex-row h-auto sm:h-56"
                  >
                    {/* Left: Image banner */}
                    <div className="relative w-full sm:w-1/3 h-44 sm:h-full overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B0F19]/40 to-[#0B0F19] hidden sm:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent sm:hidden" />
                      
                      {/* Floating icon */}
                      <div className={cn(
                        "absolute top-4 left-4 w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg",
                        cat.color
                      )}>
                        {cat.icon}
                      </div>
                    </div>

                    {/* Right: Content details */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-2xl font-bold text-white group-hover:text-primary-light transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs font-bold px-2.5 py-1 bg-white/5 border border-white/10 text-surface-300 rounded-full">
                            {cat.count}
                          </span>
                        </div>
                        <p className="text-sm text-surface-400 line-clamp-2 leading-relaxed mb-4">
                          {cat.description || `Explore products in our curated ${cat.name} category.`}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Sub-tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {cat.tags.map((tag) => (
                            <span 
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSearchTerm(tag);
                              }}
                              className="text-[10px] font-semibold px-2.5 py-1 bg-white/5 hover:bg-primary/20 hover:text-white rounded-md border border-white/5 transition-all cursor-pointer text-surface-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* CTA button */}
                        <Link
                          to={`/products?category=${encodeURIComponent(cat._id)}`}
                          className="flex items-center justify-center px-6 py-2.5 bg-white/5 group-hover:bg-primary/20 border border-white/5 group-hover:border-primary/30 rounded-xl text-xs font-bold text-white group-hover:text-primary-light transition-all duration-300 whitespace-nowrap cursor-pointer"
                        >
                          Explore Catalog
                          <FiArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              }
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/2 border border-white/5 rounded-3xl max-w-xl mx-auto p-6"
          >
            <FiPackage size={48} className="mx-auto mb-4 text-surface-500 opacity-50" />
            <h3 className="text-lg font-semibold text-white">No categories match your search</h3>
            <p className="text-sm text-surface-400 mt-2">
              Try checking your spelling or search other tags (e.g. #Phones, #Clothing, #Decor).
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 px-5 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              Clear Search
            </button>
          </motion.div>
        )}

      </div>
    </div>
  )
}
