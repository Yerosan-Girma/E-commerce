import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { cn } from '../../lib/utils'

const categories = [
  { name: 'Electronics', icon: '💻', count: '1.2k products', color: 'from-primary to-blue-500', description: 'Smartphones, laptops, tablets, and more' },
  { name: 'Fashion', icon: '👗', count: '3.5k products', color: 'from-secondary to-violet-500', description: 'Clothing, shoes, accessories for all styles' },
  { name: 'Home & Living', icon: '🏠', count: '890 products', color: 'from-accent to-orange-500', description: 'Furniture, decor, kitchen essentials' },
  { name: 'Sports', icon: '⚽', count: '620 products', color: 'from-success to-green-500', description: 'Equipment, apparel, outdoor gear' },
  { name: 'Books', icon: '📚', count: '450 products', color: 'from-primary to-purple-500', description: 'Fiction, non-fiction, educational books' },
  { name: 'Beauty', icon: '💄', count: '720 products', color: 'from-secondary to-pink-500', description: 'Skincare, makeup, personal care' },
  { name: 'Toys', icon: '🧸', count: '340 products', color: 'from-accent to-yellow-500', description: 'Games, puzzles, toys for all ages' },
  { name: 'Food', icon: '🍕', count: '210 products', color: 'from-success to-teal-500', description: 'Snacks, beverages, gourmet items' },
]

export default function Categories() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">Browse Categories</h1>
          <p className="text-surface-400 max-w-2xl mx-auto">Explore our wide range of categories and find exactly what you're looking for.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/products?category=${category.name.toLowerCase()}`}>
                <Card hover glass padding="lg" className="group cursor-pointer">
                  <div className={cn('w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center', category.color)}>
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-surface-100 text-center mb-2">{category.name}</h3>
                  <p className="text-sm text-surface-400 text-center mb-3">{category.description}</p>
                  <p className="text-xs text-primary text-center font-medium">{category.count}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
