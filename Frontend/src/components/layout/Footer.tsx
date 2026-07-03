import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-darksurface border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MarketHub</h3>
          <p className="text-sm text-gray-500 mt-2">Your global multi‑vendor marketplace.</p>
          <div className="flex gap-3 mt-4">
            <FiFacebook className="text-gray-400 hover:text-primary cursor-pointer" />
            <FiTwitter className="text-gray-400 hover:text-primary cursor-pointer" />
            <FiInstagram className="text-gray-400 hover:text-primary cursor-pointer" />
            <FiYoutube className="text-gray-400 hover:text-error cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">Help Center</Link></li>
            <li><Link to="/">Returns</Link></li>
            <li><Link to="/">Shipping Info</Link></li>
            <li><Link to="/">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Press</Link></li>
            <li><Link to="/">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm text-gray-500 mb-3">Subscribe for deals and updates.</p>
          <div className="flex">
            <input placeholder="your@email.com" className="flex-1 rounded-l-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
            <button className="bg-primary text-white px-4 rounded-r-xl font-medium text-sm">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-400">
        © 2025 MarketHub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer