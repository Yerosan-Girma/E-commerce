import { Link } from 'react-router-dom'
import { FiTwitter, FiInstagram, FiFacebook, FiLinkedin, FiMail } from 'react-icons/fi'
import { useState } from 'react'

const links = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'New Arrivals', to: '/products?sort=new' },
    { label: 'Best Sellers', to: '/products?sort=popular' },
    { label: 'Deals & Offers', to: '/products?filter=deals' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Addresses', to: '/addresses' },
  ],
  Sellers: [
    { label: 'Become a Seller', to: '/register' },
    { label: 'Seller Dashboard', to: '/vendor' },
    { label: 'Seller Guidelines', to: '/' },
  ],
  Support: [
    { label: 'Help Center', to: '/' },
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
    { label: 'Contact Us', to: '/' },
  ],
}

const socials = [
  { Icon: FiTwitter, href: '#', label: 'Twitter' },
  { Icon: FiInstagram, href: '#', label: 'Instagram' },
  { Icon: FiFacebook, href: '#', label: 'Facebook' },
  { Icon: FiLinkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-gray-900 dark:bg-darkbg text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl text-white">
                Market<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your trusted multi-vendor marketplace. Discover thousands of products from verified sellers worldwide.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-white mb-2">Stay in the loop</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <button
                  onClick={() => setEmail('')}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
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
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MarketHub. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
