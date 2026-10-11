import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import {
  FiShoppingBag, FiUsers, FiAward, FiShield,
  FiTruck, FiHeadphones, FiStar, FiArrowRight,
} from 'react-icons/fi'

const features = [
  { icon: FiShield,     title: 'Secure Payments',  desc: '100% protected transactions with advanced encryption and fraud detection.' },
  { icon: FiTruck,      title: 'Fast Delivery',     desc: 'Free shipping on orders over $50 with real-time tracking included.' },
  { icon: FiHeadphones, title: '24/7 Support',      desc: 'Dedicated customer care team always ready to help you anytime.' },
  { icon: FiAward,      title: 'Quality Assurance', desc: 'Verified vendors and quality-checked products you can always trust.' },
]

const stats = [
  { value: '50K+',  label: 'Products',       icon: FiShoppingBag },
  { value: '2K+',   label: 'Vendors',         icon: FiUsers       },
  { value: '500K+', label: 'Happy Customers', icon: FiStar        },
  { value: '4.9★',  label: 'Average Rating',  icon: FiAward       },
]

const team = [
  { name: 'Yerosan Girma ',    role: 'CEO & Founder',      avatar: '👨‍💼' },
  { name: 'Chala Hailu', role: 'CTO',                avatar: '👩‍💻' },
  { name: 'Aster Abebe',     role: 'Head of Operations', avatar: '👨‍🔧' },
  { name: 'Emen Kebede',   role: 'Head of Marketing',  avatar: '👩‍💼' },
]

const storyCards = [
  { value: '2020', label: 'Founded',      accent: '#6366F1' },
  { value: '50+',  label: 'Countries',    accent: '#8B5CF6' },
  { value: '99%',  label: 'Satisfaction', accent: '#EC4899' },
  { value: '24/7', label: 'Support',      accent: '#10B981' },
]

// Reusable section wrapper — always neutral background
const Section = ({ children, tinted = false, className = '' }: {
  children: React.ReactNode
  tinted?: boolean
  className?: string
}) => (
  <section className={`py-20 px-4 sm:px-6 lg:px-8 ${tinted ? 'bg-gray-50 dark:bg-background-light/60' : ''} ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
)

export default function About() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-background dark:to-background-light overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-40"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.3), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.2), transparent 50%)' }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            About MarketHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            We're revolutionizing e-commerce by connecting millions of customers with
            thousands of trusted vendors worldwide. Our mission is to make online
            shopping seamless, secure, and enjoyable for everyone.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-background-light border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <stat.icon className="w-7 h-7 mx-auto mb-3 text-primary" />
              <p className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── Our Story ────────────────────────────────── */}
      <Section tinted>
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Body text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Our Story
            </h2>
            {[
              'Founded in 2020, MarketHub started with a simple vision: to create a marketplace where buyers and sellers could connect with trust and transparency. What began as a small startup has grown into a global platform serving millions of customers.',
              'We believe that everyone deserves access to quality products from trusted sellers. Our platform empowers small businesses and independent vendors to reach a global audience while providing customers with a seamless shopping experience.',
              'Today, we\'re proud to host over 50,000 products from 2,000+ verified vendors, serving 500,000+ happy customers worldwide. Our commitment to innovation and customer satisfaction drives everything we do.',
            ].map((para, i) => (
              <p key={i} className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed mb-5 last:mb-0">
                {para}
              </p>
            ))}
          </motion.div>

          {/* Mini stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-background-light border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-md"
          >
            <div className="grid grid-cols-2 gap-4">
              {storyCards.map(card => (
                <div
                  key={card.label}
                  className="rounded-2xl p-6 text-center border border-gray-100 dark:border-white/8"
                  style={{ background: `${card.accent}18` }}
                >
                  <p
                    className="text-4xl font-extrabold mb-2"
                    style={{ color: card.accent }}
                  >
                    {card.value}
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </Section>

      {/* ── Why Choose Us ────────────────────────────── */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Why Choose Us?
          </h2>
          <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with features
            that matter most to you.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-background-light border border-gray-200 dark:border-white/10 rounded-2xl p-7 text-center shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <feature.icon className="text-white" size={26} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Team ─────────────────────────────────────── */}
      <Section tinted>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
          <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The passionate people behind MarketHub who work tirelessly to make your
            shopping experience exceptional.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-background-light border border-gray-200 dark:border-white/10 rounded-2xl p-7 text-center shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-5xl shadow-lg shadow-violet-500/25">
                {member.avatar}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────── */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-background-light dark:to-background border border-violet-200 dark:border-white/10 rounded-3xl p-10 sm:p-14 text-center shadow-md"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-5">
            Ready to Join Us?
          </h2>
          <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you're a customer looking for great deals or a vendor ready to
            grow your business, MarketHub is the perfect platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="xl" className="gap-2">
                Start Shopping <FiArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="xl" variant="outline">
                Become a Vendor
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>

    </div>
  )
}
