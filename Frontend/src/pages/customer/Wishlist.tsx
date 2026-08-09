import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiTrash2 } from 'react-icons/fi'

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

const initialWishlist: Product[] = [
  { id: '1', name: 'Wireless Noise Cancelling Headphones Pro', price: 199.99, originalPrice: 299.99, rating: 4.7, reviewCount: 1243, vendor: 'TechStore', badge: 'Best Seller', image: '🎧' },
  { id: '3', name: 'Smart Home Security Camera 4K', price: 129.99, originalPrice: 179.99, rating: 4.8, reviewCount: 892, vendor: 'SmartGadgets', badge: 'New', image: '📷' },
  { id: '5', name: 'Stainless Steel Water Bottle 1L', price: 24.99, originalPrice: 39.99, rating: 4.9, reviewCount: 2100, vendor: 'EcoGoods', image: '💧' },
  { id: '6', name: 'Mechanical Gaming Keyboard RGB', price: 79.99, originalPrice: 119.99, rating: 4.4, reviewCount: 678, vendor: 'GamersZone', image: '⌨️' },
]

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>(initialWishlist)

  const remove = (id: string) => {
    setWishlist(w => w.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">My Wishlist</h1>
            <p className="text-surface-500">{wishlist.length} items saved</p>
          </div>
          {wishlist.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWishlist([])}
              className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              <FiTrash2 size={16} /> Clear all
            </motion.button>
          )}
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 rounded-full glass flex items-center justify-center mx-auto mb-8 neon-glow-purple">
              <FiHeart className="text-accent" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gradient mb-4">Your wishlist is empty</h3>
            <p className="text-surface-500 mb-8 text-lg">Save products you love for later!</p>
            <Link to="/products">
              <Button size="lg" className="neon-glow gap-2">
                <FiArrowLeft size={18} /> Discover Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group"
                  >
                    <Card hover glass padding="md" className="h-full">
                      <div className="relative h-48 bg-background-light/50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-accent text-white text-xs px-3 py-1 rounded-full font-semibold">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-surface-200 mb-2 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-surface-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-surface-500">{product.vendor}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(product.id)}
                          className="p-2 rounded-xl text-surface-500 hover:text-accent hover:bg-accent/10 transition-all"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
