import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { cn } from '../../lib/utils'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'draft'
  sales: number
  category: string
}

const initialProducts: Product[] = [
  { id: '1', name: 'Wireless Noise Cancelling Headphones Pro', price: 199.99, stock: 45, status: 'active', sales: 238, category: 'Electronics' },
  { id: '2', name: 'Smart Speaker Mini', price: 89.99, stock: 12, status: 'active', sales: 156, category: 'Electronics' },
  { id: '3', name: 'USB-C Hub 7-in-1', price: 49.99, stock: 0, status: 'inactive', sales: 89, category: 'Accessories' },
  { id: '4', name: 'Phone Stand Adjustable', price: 24.99, stock: 200, status: 'active', sales: 312, category: 'Accessories' },
  { id: '5', name: 'Bluetooth Earbuds Pro', price: 129.99, stock: 67, status: 'draft', sales: 0, category: 'Electronics' },
]

const statusMap: Record<Product['status'], 'success' | 'error' | 'gray'> = {
  active: 'success',
  inactive: 'error',
  draft: 'gray',
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Products</h1>
          <p className="text-surface-500">{products.length} total products</p>
        </div>
        <Link to="/vendor/products/add">
          <Button className="neon-glow gap-2"><FiPlus size={16} /> Add Product</Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-xs"
      >
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={15} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm',
            'glass border border-white/10',
            'text-surface-200 placeholder:text-surface-500',
            'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light/30">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Sales', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-surface-200 max-w-[200px] truncate">{product.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-surface-400">{product.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-surface-200">${product.price}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('text-sm font-medium', product.stock === 0 ? 'text-accent' : product.stock < 20 ? 'text-warning' : 'text-surface-300')}>
                        {product.stock === 0 ? 'Out of stock' : product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-surface-400">{product.sales}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusMap[product.status]} dot>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg text-surface-500 hover:text-primary hover:bg-primary/10 transition-colors">
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-surface-500 hover:text-accent hover:bg-accent/10 transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-surface-500">No products found.</div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
