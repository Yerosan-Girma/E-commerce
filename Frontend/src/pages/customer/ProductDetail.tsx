import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiShield, FiTruck, FiRefreshCw, FiStar, FiMinus, FiPlus, FiRotateCw, FiZoomIn } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import type { RootState } from '../../store'

const mockProduct = {
  id: '1',
  name: 'Wireless Noise Cancelling Headphones Pro',
  price: 199.99,
  originalPrice: 299.99,
  description: 'Experience premium sound quality with our flagship headphones. Features advanced active noise cancellation, 40-hour battery life, and ultra-comfortable over-ear design. Perfect for music lovers, professionals, and travelers alike.',
  rating: 4.7,
  reviewCount: 1243,
  vendor: 'TechStore',
  category: 'Electronics',
  stock: 15,
  image: '🎧',
  features: ['40-hour battery life', 'Active noise cancellation', 'Multi-device pairing', 'Quick charge (10min = 3hrs)', 'Foldable design', 'Premium memory foam ear cushions'],
  reviews: [
    { author: 'Sarah M.', rating: 5, date: '2 days ago', comment: 'Amazing sound quality! The noise cancellation is incredible. Best headphones I\'ve ever owned.' },
    { author: 'James K.', rating: 4, date: '1 week ago', comment: 'Great headphones, very comfortable for long sessions. Battery life is impressive.' },
    { author: 'Anna L.', rating: 5, date: '2 weeks ago', comment: 'Best purchase I made this year. Worth every penny. The build quality is premium.' },
    { author: 'Mike R.', rating: 5, date: '3 weeks ago', comment: 'The ANC is top-notch. I use them daily for work calls and music.' },
  ],
}

export default function ProductDetail() {
  const { id: _id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const user = useSelector((state: RootState) => state.auth.user)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [tab, setTab] = useState<'description' | 'features' | 'reviews'>('description')
  const [selectedImage, setSelectedImage] = useState(0)

  const product = mockProduct
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add items to cart', 'error')
      navigate('/login')
      return
    }
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, quantity, image: undefined }))
    showToast(`${product.name} added to cart!`, 'success')
  }

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
          <span className="text-surface-300 truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 3D Product Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card glass padding="none" className="relative aspect-square rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
              <div className="relative h-full flex items-center justify-center">
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-[180px] group-hover:scale-110 transition-transform duration-500"
                >
                  {product.image}
                </motion.span>
              </div>
              
              {/* 3D Controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="glass p-3 rounded-xl text-surface-300 hover:text-white transition-colors"
                >
                  <FiRotateCw size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 10.9 }}
                  className="glass p-3 rounded-xl text-surface-300 hover:text-white transition-colors"
                >
                  <FiZoomIn size={20} />
                </motion.button>
              </div>

              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-accent text-white text-sm px-4 py-2 rounded-full font-semibold">
                  {discount}% OFF
                </span>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'w-20 h-20 rounded-xl glass flex items-center justify-center transition-all',
                    selectedImage === i ? 'ring-2 ring-primary neon-glow' : ''
                  )}
                >
                  <span className="text-3xl">{product.image}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="glass px-3 py-1 rounded-full text-sm text-primary font-semibold">
                  In Stock ({product.stock})
                </span>
                <span className="glass px-3 py-1 rounded-full text-sm text-surface-400">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4 leading-tight">
                {product.name}
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
                  <span className="text-surface-400 ml-2">{product.rating}</span>
                  <span className="text-surface-500 text-sm">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-extrabold text-gradient">${product.price}</span>
                <span className="text-2xl text-surface-500 line-through">${product.originalPrice}</span>
              </div>
            </div>

            {/* Vendor */}
            <Card glass padding="md" className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-mesh flex items-center justify-center text-white font-bold text-xl">
                {product.vendor[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-surface-200">{product.vendor}</p>
                <p className="text-sm text-surface-500">Verified Seller</p>
              </div>
              <Link to={`/vendor/${product.vendor.toLowerCase()}`}>
                <Button variant="outline" size="sm">Visit Store</Button>
              </Link>
            </Card>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-surface-300">Quantity</span>
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/5 transition-colors font-bold text-lg"
                >
                  <FiMinus size={18} />
                </motion.button>
                <span className="w-16 text-center text-lg font-bold text-surface-200">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/5 transition-colors font-bold text-lg"
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
              >
                <FiShoppingCart size={20} /> Add to Cart
              </Button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWishlist(!wishlist)}
                className={cn(
                  'w-14 h-14 rounded-xl glass flex items-center justify-center transition-all',
                  wishlist ? 'text-accent neon-glow-purple' : 'text-surface-400 hover:text-surface-200'
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
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FiShield, label: 'Secure Payment' },
                { icon: FiTruck, label: 'Fast Delivery' },
                { icon: FiRefreshCw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -5 }}
                  className="glass-card p-4 flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-surface-400">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Card glass padding="none" className="overflow-hidden">
          <div className="flex border-b border-white/10">
            {(['description', 'features', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-4 text-sm font-semibold capitalize transition-all relative',
                  tab === t
                    ? 'text-primary'
                    : 'text-surface-500 hover:text-surface-300'
                )}
              >
                {t} {t === 'reviews' && `(${product.reviews.length})`}
                {tab === t && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-mesh"
                  />
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
            {tab === 'features' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {product.features.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-4 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-mesh flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <span className="text-surface-200">{f}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {tab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {product.reviews.map((r, i) => (
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
                          {r.author[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-200">{r.author}</p>
                          <p className="text-sm text-surface-500">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, j) => (
                          <FiStar
                            key={j}
                            size={16}
                            className={cn(j < r.rating ? 'fill-current' : '')}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-surface-300 leading-relaxed">{r.comment}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
