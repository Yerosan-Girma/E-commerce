import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiShield, FiTruck, FiRefreshCw as FiRetry, FiStar, FiMinus, FiPlus, FiPackage } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import type { RootState } from '../../store'
import { api } from '../../services/api'

interface Review {
  author: string
  rating: number
  date: string
  comment: string
}

interface Product {
  _id: string
  title: string
  description: string
  price: number
  stock: number
  images: string[]
  rating: number
  numReviews: number
  brand?: string
  category?: { _id: string; name: string }
  store?: { _id: string; storeName: string; logo: string }
  seller?: { _id: string; name: string; email: string }
  reviews?: Review[]
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-4 w-48 bg-white/10 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white/10 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 bg-white/10 rounded-xl" />
            <div className="h-6 w-32 bg-white/10 rounded-xl" />
            <div className="h-14 w-40 bg-white/10 rounded-xl" />
            <div className="h-24 bg-white/10 rounded-xl" />
            <div className="h-12 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [tab, setTab] = useState<'description' | 'reviews'>('description')
  const [selectedImage, setSelectedImage] = useState(0)

  const fetchProduct = async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProduct(id) as unknown as Product
      setProduct(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load product'
      setError(message)
      console.error('[ProductDetail] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProduct() }, [id])

  const handleAddToCart = () => {
    if (!product) return
    if (!user) {
      showToast('Please login to add items to cart', 'error')
      navigate('/login')
      return
    }
    dispatch(addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      quantity,
      image: product.images?.[0],
    }))
    showToast(`${product.title} added to cart!`, 'success')
  }

  if (loading) return <LoadingSkeleton />

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-accent text-xl font-semibold">{error ?? 'Product not found'}</p>
        <div className="flex gap-3">
          <Button onClick={fetchProduct} variant="outline">
            <FiRetry size={16} className="mr-2" /> Retry
          </Button>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    )
  }

  const displayImages = product.images?.length > 0 ? product.images : []
  const currentImage = displayImages[selectedImage]

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-surface-500 mb-8"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <FiChevronRight size={14} />
          {product.category && (
            <>
              <span className="hover:text-primary transition-colors">{product.category.name}</span>
              <FiChevronRight size={14} />
            </>
          )}
          <span className="text-surface-300 truncate max-w-[200px]">{product.title}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <Card glass padding="none" className="relative aspect-square rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
              <div className="relative h-full flex items-center justify-center">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-[180px] group-hover:scale-110 transition-transform duration-500"
                  >
                    <FiPackage size={120} className="text-surface-600" />
                  </motion.span>
                )}
              </div>

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <span className={cn(
                  'text-white text-sm px-4 py-2 rounded-full font-semibold',
                  product.stock > 0 ? 'bg-success' : 'bg-accent',
                )}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </Card>

            {/* Image thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3">
                {displayImages.slice(0, 4).map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-20 h-20 rounded-xl glass flex items-center justify-center overflow-hidden transition-all',
                      selectedImage === i ? 'ring-2 ring-primary neon-glow' : '',
                    )}
                  >
                    <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="glass px-3 py-1 rounded-full text-sm text-surface-400">
                  {product.category?.name ?? 'Uncategorized'}
                </span>
                {product.brand && (
                  <span className="glass px-3 py-1 rounded-full text-sm text-surface-400">{product.brand}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient mb-4 leading-tight tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={cn(i < Math.floor(product.rating) ? 'fill-current' : '')}
                    />
                  ))}
                  <span className="text-surface-400 ml-2">{product.rating?.toFixed(1) ?? '0.0'}</span>
                  <span className="text-surface-500 text-sm">({product.numReviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-extrabold text-white tracking-tight">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Vendor */}
            {product.store && (
              <Card glass padding="md" className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-mesh flex items-center justify-center text-white font-bold text-xl">
                  {product.store.storeName?.[0] ?? 'S'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-surface-200">{product.store.storeName}</p>
                  <p className="text-sm text-surface-500">Verified Seller</p>
                </div>
              </Card>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-surface-300">Quantity</span>
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/5 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={18} />
                </motion.button>
                <span className="w-16 text-center text-lg font-bold text-surface-200">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-12 h-12 flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/5 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus size={18} />
                </motion.button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 gap-2 neon-glow"
                disabled={product.stock === 0}
              >
                <FiShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWishlist(!wishlist)}
                className={cn(
                  'w-14 h-14 rounded-xl glass flex items-center justify-center transition-all',
                  wishlist ? 'text-accent neon-glow-purple' : 'text-surface-400 hover:text-surface-200',
                )}
              >
                <FiHeart size={24} className={wishlist ? 'fill-current' : ''} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-xl glass flex items-center justify-center text-surface-400 hover:text-surface-200 transition-all"
              >
                <FiShare2 size={24} />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiShield, label: 'Secure Payment', color: 'from-blue-500/20 to-indigo-500/10' },
                { icon: FiTruck, label: 'Fast Delivery', color: 'from-emerald-500/20 to-teal-500/10' },
                { icon: FiRetry, label: 'Easy Returns', color: 'from-purple-500/20 to-violet-500/10' },
              ].map(({ icon: Icon, label, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center border border-white/8"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-surface-300 leading-tight">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Card glass padding="none" className="overflow-hidden">
          <div className="flex border-b border-white/10">
            {(['description', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-4 text-sm font-semibold capitalize transition-all relative',
                  tab === t ? 'text-primary' : 'text-surface-500 hover:text-surface-300',
                )}
              >
                {t} {t === 'reviews' && `(${product.numReviews})`}
                {tab === t && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-mesh" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-surface-300 leading-relaxed text-lg"
              >
                {product.description}
              </motion.div>
            )}
            {tab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-mesh flex items-center justify-center text-white font-bold">
                            {r.author?.[0] ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-surface-200">{r.author}</p>
                            <p className="text-sm text-surface-500">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, j) => (
                            <FiStar key={j} size={16} className={cn(j < r.rating ? 'fill-current' : '')} />
                          ))}
                        </div>
                      </div>
                      <p className="text-surface-300 leading-relaxed">{r.comment}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-surface-500">No reviews yet. Be the first to review!</p>
                )}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
