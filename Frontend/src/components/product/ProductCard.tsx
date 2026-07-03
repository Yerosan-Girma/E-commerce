import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../ui/Toast'

const ProductCard = ({ product }: { product?: any }) => {
  const [liked, setLiked] = useState(false)
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const defaultProduct = {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 49.99,
    originalPrice: 62.00,
    vendor: 'TechGear',
    rating: 4.5,
    reviews: 128,
    image: '📱',
  }

  const item = product || defaultProduct

  const handleAddToCart = () => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 }))
    addToast('Added to cart!', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden group"
    >
      <Link to={`/product/${item.id}`} className="block relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        <span className="text-5xl">{item.image}</span>
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:scale-110 transition"
        >
          <FiHeart className={liked ? 'fill-error text-error' : ''} />
        </button>
        {item.originalPrice && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs px-2 py-1 rounded-full">
            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{item.vendor}</p>
        <Link to={`/product/${item.id}`} className="font-semibold truncate block hover:text-primary transition">{item.name}</Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary">${item.price}</span>
          {item.originalPrice && <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>}
        </div>
        <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
          {'★'.repeat(Math.floor(item.rating))}{item.rating % 1 !== 0 ? '½' : ''}{'☆'.repeat(5 - Math.ceil(item.rating))}
          <span className="text-gray-500 text-xs ml-1">({item.reviews})</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="mt-3 w-full bg-primary text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiShoppingCart /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard