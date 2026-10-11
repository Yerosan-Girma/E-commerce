import { Link } from 'react-router-dom'
import { FiTwitter, FiInstagram, FiFacebook, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'

const links = {
  Shop: [
    { label: 'All Products',  to: '/products' },
    { label: 'New Arrivals',  to: '/products?sort=new' },
    { label: 'Best Sellers',  to: '/products?sort=popular' },
    { label: 'Deals & Offers',to: '/products?filter=deals' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders',  to: '/orders' },
    { label: 'Wishlist',   to: '/wishlist' },
    { label: 'Addresses',  to: '/addresses' },
  ],
  Sellers: [
    { label: 'Become a Seller',  to: '/register' },
    { label: 'Seller Dashboard', to: '/vendor' },
    { label: 'Seller Guidelines',to: '/' },
  ],
  Support: [
    { label: 'Help Center',    to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service',to: '/' },
    { label: 'Contact Us',     to: '/' },
  ],
}

const socials = [
  { Icon: FiTwitter,  href: '#', label: 'Twitter'  },
  { Icon: FiInstagram,href: '#', label: 'Instagram' },
  { Icon: FiFacebook, href: '#', label: 'Facebook'  },
  { Icon: FiLinkedin, href: '#', label: 'LinkedIn'  },
]

export default function Footer() {
  const [email, setEmail]       = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-gray-950 dark:bg-darkbg text-gray-400 mt-12 sm:mt-20 mb-16 sm:mb-0 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-8 sm:gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl text-white tracking-wide">
                Market<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your trusted multi-vendor marketplace. Discover thousands of products from verified sellers worldwide.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">Stay in the loop</p>
              {subscribed ? (
                <p className="text-sm text-emerald-400 font-medium">✓ You're subscribed!</p>
              ) : (
                <div className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-gray-900 border border-gray-800 text-white placeholder:text-gray-600 outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                  >
                    <FiArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{category}</h3>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-150 hover:pl-0.5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="col-span-2 lg:col-span-6 mt-2 sm:mt-4 pt-6 sm:pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} MarketHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
