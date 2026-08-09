import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiShoppingBag, FiTrendingUp, FiStar } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { cn } from '../../lib/utils'

const categories = [
  { name: 'Electronics', icon: '💻', count: '1.2k products', color: 'from-primary to-blue-500' },
  { name: 'Fashion', icon: '👗', count: '3.5k products', color: 'from-secondary to-violet-500' },
  { name: 'Home & Living', icon: '🏠', count: '890 products', color: 'from-accent to-orange-500' },
  { name: 'Sports', icon: '⚽', count: '620 products', color: 'from-success to-green-500' },
  { name: 'Books', icon: '📚', count: '450 products', color: 'from-primary to-purple-500' },
  { name: 'Beauty', icon: '💄', count: '720 products', color: 'from-secondary to-pink-500' },
  { name: 'Toys', icon: '🧸', count: '340 products', color: 'from-accent to-yellow-500' },
  { name: 'Food', icon: '🍕', count: '210 products', color: 'from-success to-teal-500' },
]

const featuredProducts = [
  { id: '1', name: 'Wireless Noise Cancelling Headphones Pro', price: 199.99, originalPrice: 299.99, rating: 4.7, reviewCount: 1243, vendor: 'TechStore', badge: 'Best Seller', image: '🎧' },
  { id: '2', name: 'Premium Leather Crossbody Bag', price: 89.99, rating: 4.5, reviewCount: 567, vendor: 'FashionHub', image: '👜' },
  { id: '3', name: 'Smart Home Security Camera 4K', price: 129.99, originalPrice: 179.99, rating: 4.8, reviewCount: 892, vendor: 'SmartGadgets', badge: 'New', image: '📷' },
  { id: '4', name: 'Ergonomic Office Chair with Lumbar Support', price: 349.99, rating: 4.6, reviewCount: 234, vendor: 'ComfortLiving', image: '🪑' },
]

const vendors = [
  { name: 'TechStore', sales: '12.4k', rating: 4.9, category: 'Electronics', color: 'from-primary to-blue-500' },
  { name: 'FashionHub', sales: '8.7k', rating: 4.8, category: 'Fashion', color: 'from-secondary to-violet-500' },
  { name: 'SmartGadgets', sales: '6.2k', rating: 4.7, category: 'Gadgets', color: 'from-accent to-orange-500' },
  { name: 'ComfortLiving', sales: '4.8k', rating: 4.8, category: 'Home', color: 'from-success to-green-500' },
]

const features = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care' },
]

const stats = [
  { value: '50K+', label: 'Products', icon: FiShoppingBag },
  { value: '2K+', label: 'Vendors', icon: FiStar },
  { value: '500K+', label: 'Happy Customers', icon: FiTrendingUp },
  { value: '4.9★', label: 'Avg Rating', icon: FiStar },
]

const heroSlides = [
  {
    title: 'Discover Amazing Products',
    subtitle: 'Shop from thousands of verified vendors worldwide',
    cta: 'Start Shopping',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Fashion That Speaks',
    subtitle: 'Express yourself with trending styles',
    cta: 'Explore Fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    gradient: 'from-pink-600 to-orange-500'
  },
  {
    title: 'Tech Innovation',
    subtitle: 'Latest gadgets and electronics',
    cta: 'Shop Tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e4236e66?w=1920',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    title: 'Home Essentials',
    subtitle: 'Transform your living space',
    cta: 'Shop Home',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1920',
    gradient: 'from-green-600 to-teal-600'
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background with Changing Product Images */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Section - Static Text */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 text-white">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="xl"
              className="neon-glow"
              onClick={() => navigate('/products')}
            >
              {heroSlides[currentSlide].cta}
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="bg-white/20 text-white border-white hover:bg-white/30"
              onClick={() => navigate('/categories')}
            >
              Browse Categories
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  i === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70'
                )}
              />
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat) => (
              <Card key={stat.label} glass padding="lg" className="text-center bg-white/10 backdrop-blur-md border-white/20">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-white" />
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-gray-200 font-medium mt-1">{stat.label}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass-card p-6 flex items-center gap-4 hover:neon-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-mesh flex items-center justify-center shrink-0">
                <Icon className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-100">{title}</p>
                <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gradient">Shop by Category</h2>
              <p className="text-surface-500 mt-2">Find what you're looking for</p>
            </div>
            <Link to="/categories" className="flex items-center gap-2 text-primary font-semibold hover:underline">
              View all <FiArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <Link
                  to={`/products?category=${cat.name.toLowerCase()}`}
                  className="group flex flex-col items-center gap-3 p-6 glass-card hover:neon-glow transition-all duration-300"
                >
                  <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center', cat.color)}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-200 text-center">{cat.name}</span>
                  <span className="text-xs text-surface-500">{cat.count}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gradient">Featured Products</h2>
              <p className="text-surface-500 mt-2">Hand-picked by our team</p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-primary font-semibold hover:underline">
              View all <FiArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card hover glass padding="md" className="group">
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
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      <FiStar className="fill-current" />
                      <span className="text-surface-400 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-surface-500">{product.vendor}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gradient">Top Vendors</h2>
            <p className="text-surface-500 mt-2">Trusted sellers with amazing products</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor, i) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card hover glass padding="lg" className="text-center">
                  <div className={cn('w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl mb-4', vendor.color)}>
                    {vendor.name[0]}
                  </div>
                  <h3 className="font-bold text-surface-200 mb-1">{vendor.name}</h3>
                  <p className="text-sm text-surface-500 mb-4">{vendor.category}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-surface-400">{vendor.sales} sales</span>
                    <span className="text-yellow-500 font-semibold flex items-center gap-1">
                      <FiStar className="fill-current" /> {vendor.rating}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card glass gradient padding="lg" className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gradient mb-4">
                Ready to Start Selling?
              </h2>
              <p className="text-surface-400 mb-8 max-w-xl mx-auto">
                Join thousands of vendors and reach millions of customers on MarketHub. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="neon-glow"
                  onClick={() => navigate('/register')}
                >
                  <FiStar className="w-5 h-5" />
                  Become a Vendor
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  )
}
