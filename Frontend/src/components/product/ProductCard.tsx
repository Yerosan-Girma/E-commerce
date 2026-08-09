import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../ui/Toast'
import RatingStars from './RatingStars'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useState } from 'react'

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

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const [wishlist, setWishlist] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAdd = () => {
    setAdding(true)
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }))
    showToast(`${product.name} added to cart`, 'success')
    setTimeout(() => setAdding(false), 600)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="group relative bg-white dark:bg-darksurface border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-gray-200 dark:text-gray-700">🛍️</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {product.badge && (
          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setWishlist(!wishlist)}
          className={[
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm',
            'transition-all duration-200 hover:scale-110',
            product.badge ? 'top-12' : 'top-3',
          ].join(' ')}
        >
          <FiHeart
            size={14}
            className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.vendor && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.vendor}</p>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>
        {product.rating !== undefined && (
          <div className="mb-3">
            <RatingStars
              rating={product.rating}
              showValue
              count={product.reviewCount}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={[
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold',
              'bg-primary text-white hover:bg-blue-700 transition-all duration-200',
              'disabled:opacity-60 hover:shadow-md',
            ].join(' ')}
          >
            <FiShoppingCart size={13} />
            {adding ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
