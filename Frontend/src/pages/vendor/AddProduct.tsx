import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { FiUpload } from 'react-icons/fi'
import { cn } from '../../lib/utils'

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Food', 'Accessories', 'Other']

export default function AddProduct() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    sku: '',
    status: 'active',
    brand: '',
    weight: '',
    dimensions: '',
    warranty: '',
    tags: '',
  })

  const handle = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    showToast('Product added successfully!', 'success')
    setSaving(false)
    navigate('/vendor/products')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Add Product</h1>
        <p className="text-surface-500">Fill in the details to list a new product</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass padding="lg" className="space-y-5">
            <h2 className="text-lg font-bold text-gradient">Basic Information</h2>
            <Input label="Product name" value={form.name} onChange={handle('name')} placeholder="Enter product name" required />
            <div>
              <label className="text-sm font-medium text-surface-300 block mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={handle('description')}
                rows={4}
                required
                placeholder="Describe your product..."
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl text-sm',
                  'glass border border-white/10',
                  'text-surface-200 placeholder:text-surface-500',
                  'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none'
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-surface-300 block mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={handle('category')}
                  required
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl text-sm',
                    'glass border border-white/10',
                    'text-surface-200',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all'
                  )}
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="SKU" value={form.sku} onChange={handle('sku')} placeholder="e.g. PROD-001" />
            </div>
          </Card>
        </motion.div>

        {/* Pricing & Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass padding="lg" className="space-y-5">
            <h2 className="text-lg font-bold text-gradient">Pricing & Inventory</h2>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Price ($)" type="number" value={form.price} onChange={handle('price')} placeholder="0.00" min="0" step="0.01" required />
              <Input label="Original price ($)" type="number" value={form.originalPrice} onChange={handle('originalPrice')} placeholder="0.00" min="0" step="0.01" />
              <Input label="Stock quantity" type="number" value={form.stock} onChange={handle('stock')} placeholder="0" min="0" required />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-300 block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={handle('status')}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm',
                  'glass border border-white/10',
                  'text-surface-200',
                  'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all'
                )}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card glass padding="lg" className="space-y-5">
            <h2 className="text-lg font-bold text-gradient">Additional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Brand" value={form.brand} onChange={handle('brand')} placeholder="e.g. Apple, Nike" />
              <Input label="Weight (kg)" type="number" value={form.weight} onChange={handle('weight')} placeholder="0.00" min="0" step="0.01" />
              <Input label="Dimensions (LxWxH cm)" value={form.dimensions} onChange={handle('dimensions')} placeholder="e.g. 10x5x3" />
              <Input label="Warranty" value={form.warranty} onChange={handle('warranty')} placeholder="e.g. 1 year" />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-300 block mb-1.5">Tags (comma separated)</label>
              <input
                value={form.tags}
                onChange={handle('tags')}
                placeholder="e.g. premium, bestseller, new"
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl text-sm',
                  'glass border border-white/10',
                  'text-surface-200 placeholder:text-surface-500',
                  'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all'
                )}
              />
            </div>
          </Card>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass padding="lg">
            <h2 className="text-lg font-bold text-gradient mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors cursor-pointer bg-background-light/30">
              <div className="w-14 h-14 rounded-xl bg-gradient-mesh flex items-center justify-center neon-glow">
                <FiUpload className="text-white" size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-200">Drop images here</p>
                <p className="text-xs text-surface-500 mt-1">PNG, JPG up to 5MB each</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <Button type="button" variant="outline" onClick={() => navigate('/vendor/products')}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} size="lg" className="neon-glow">
            Add Product
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
