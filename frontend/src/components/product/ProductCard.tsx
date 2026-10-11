import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../ui/Toast'
import RatingStars from './RatingStars'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  rating?: number
  reviewCount?: number
  vendor?: string
  badge?: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdding(true)
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }))
    showToast(`${product.name} added to cart`, 'success')
    setTimeout(() => {
      setAdding(false)
      navigate('/cart')
    }, 700)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="group relative bg-white dark:bg-darksurface border border-gray-100 dark:border-white/8 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 bg-gray-50 dark:bg-background-light overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🛍️</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute top-3 right-12 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); setWishlist(!wishlist) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-md transition-all duration-200"
        >
          <FiHeart
            size={14}
            className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.vendor && (
          <p className="text-xs font-semibold text-primary/70 dark:text-primary/60 mb-1 truncate uppercase tracking-wide">
            {product.vendor}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-surface-100 text-sm line-clamp-2 mb-2.5 leading-snug">
          {product.name}
        </h3>
        {product.rating !== undefined && (
          <div className="mb-3">
            <RatingStars rating={product.rating} showValue count={product.reviewCount} />
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 transition-all duration-200"
          >
            <FiShoppingCart size={13} />
            {adding ? '✓' : 'Add'}
          </motion.button>
        </div>
      </div>
    </div>
  )
})

export default ProductCard
