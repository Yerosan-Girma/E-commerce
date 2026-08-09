import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { FiShoppingBag, FiUsers, FiAward, FiShield, FiTruck, FiHeadphones, FiStar, FiArrowRight } from 'react-icons/fi'
import { cn } from '../../lib/utils'

const features = [
  { icon: FiShield, title: 'Secure Payments', desc: '100% protected transactions with advanced encryption' },
  { icon: FiTruck, title: 'Fast Delivery', desc: 'Free shipping on orders over $50 with tracking' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care team always ready to help' },
  { icon: FiAward, title: 'Quality Assurance', desc: 'Verified vendors and quality-checked products' },
]

const stats = [
  { value: '50K+', label: 'Products', icon: FiShoppingBag },
  { value: '2K+', label: 'Vendors', icon: FiUsers },
  { value: '500K+', label: 'Happy Customers', icon: FiStar },
  { value: '4.9★', label: 'Average Rating', icon: FiAward },
]

const team = [
  { name: 'John Smith', role: 'CEO & Founder', image: '👨‍💼' },
  { name: 'Sarah Johnson', role: 'CTO', image: '👩‍💻' },
  { name: 'Mike Chen', role: 'Head of Operations', image: '👨‍🔧' },
  { name: 'Emily Davis', role: 'Head of Marketing', image: '👩‍💼' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="text-gradient">About MarketHub</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-400 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing e-commerce by connecting millions of customers with thousands of trusted vendors worldwide. Our mission is to make online shopping seamless, secure, and enjoyable for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <Card key={stat.label} glass padding="lg" className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-4xl font-extrabold text-gradient">{stat.value}</p>
                <p className="text-sm text-surface-400 font-medium mt-1">{stat.label}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gradient mb-6">Our Story</h2>
              <p className="text-surface-300 leading-relaxed mb-6">
                Founded in 2020, MarketHub started with a simple vision: to create a marketplace where buyers and sellers could connect with trust and transparency. What began as a small startup has grown into a global platform serving millions of customers.
              </p>
              <p className="text-surface-300 leading-relaxed mb-6">
                We believe that everyone deserves access to quality products from trusted sellers. Our platform empowers small businesses and independent vendors to reach a global audience while providing customers with a seamless shopping experience.
              </p>
              <p className="text-surface-300 leading-relaxed">
                Today, we're proud to host over 50,000 products from 2,000+ verified vendors, serving 500,000+ happy customers worldwide. Our commitment to innovation and customer satisfaction drives everything we do.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-2">2020</p>
                  <p className="text-sm text-surface-400">Founded</p>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-secondary mb-2">50+</p>
                  <p className="text-sm text-surface-400">Countries</p>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-success/20 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-accent mb-2">99%</p>
                  <p className="text-sm text-surface-400">Satisfaction</p>
                </div>
                <div className="bg-gradient-to-br from-success/20 to-primary/20 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-success mb-2">24/7</p>
                  <p className="text-sm text-surface-400">Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient mb-4">Why Choose Us?</h2>
            <p className="text-surface-400 max-w-2xl mx-auto">We're committed to providing the best shopping experience with features that matter most to you.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass padding="lg" className="text-center hover:neon-glow transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-mesh flex items-center justify-center">
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-surface-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-400">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient mb-4">Meet Our Team</h2>
            <p className="text-surface-400 max-w-2xl mx-auto">The passionate people behind MarketHub who work tirelessly to make your shopping experience exceptional.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass padding="lg" className="text-center hover:neon-glow transition-all duration-300">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-mesh flex items-center justify-center text-5xl">
                    {member.image}
                  </div>
                  <h3 className="text-lg font-bold text-surface-100 mb-1">{member.name}</h3>
                  <p className="text-sm text-surface-400">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card glass gradient padding="lg" className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gradient mb-4">
                Ready to Join Us?
              </h2>
              <p className="text-surface-400 mb-8 max-w-xl mx-auto">
                Whether you're a customer looking for great deals or a vendor ready to grow your business, MarketHub is the perfect platform for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="xl" className="neon-glow">
                    Start Shopping
                    <FiArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="xl" variant="outline">
                    Become a Vendor
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  )
}
