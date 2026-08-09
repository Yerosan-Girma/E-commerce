import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { FiUpload, FiDollarSign, FiInfo, FiImage, FiArrowLeft } from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

interface Category {
  _id: string
  name: string
}

export default function AddProduct() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [dbCategories, setDbCategories] = useState<Category[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    imageUrl: '',
  })

  // Load actual categories from the database on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await api.getCategories()
        setDbCategories((response || []) as Category[])
      } catch (err: any) {
        console.error('Failed to load categories:', err)
        showToast('Failed to load product categories', 'error')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCats()
  }, [])

  const handle = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.category) {
      showToast('Please select a category', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        category: form.category,
        brand: form.brand.trim() || undefined,
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      }

      await api.createProduct(payload)
      showToast('Product successfully saved to MongoDB Atlas!', 'success')
      navigate('/vendor/products')
    } catch (err: any) {
      console.error('[AddProduct] Error:', err)
      showToast(err.message || 'Failed to save product to Atlas', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/vendor/products')}
            className="flex items-center gap-1 text-sm text-surface-400 hover:text-primary mb-3 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to products
          </button>
          <h1 className="text-4xl font-extrabold text-gradient mb-2">Create Product</h1>
          <p className="text-surface-500 text-sm">List a new product directly in your storefront</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass padding="lg" className="border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FiInfo size={20} />
              </div>
              <h2 className="text-xl font-bold text-gradient">Basic Specifications</h2>
            </div>

            <div className="space-y-5">
              <Input
                label="Product title *"
                value={form.title}
                onChange={handle('title')}
                placeholder="e.g. Wireless Noise Cancelling Headphones Pro"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-surface-600 focus:border-primary/50"
              />

              <div>
                <label className="text-sm font-semibold text-surface-300 block mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={handle('description')}
                  rows={4}
                  required
                  placeholder="Tell customers about the features, specs, and details of this product..."
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm transition-all',
                    'glass border border-white/10',
                    'text-surface-200 placeholder:text-surface-600',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none'
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-surface-300 block mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={handle('category')}
                    required
                    disabled={loadingCategories}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm transition-all cursor-pointer',
                      'glass border border-white/10',
                      'text-surface-200',
                      'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                    )}
                  >
                    <option value="">
                      {loadingCategories ? 'Loading categories...' : 'Select product category'}
                    </option>
                    {dbCategories.map(c => (
                      <option key={c._id} value={c._id} className="bg-background-dark text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Brand"
                  value={form.brand}
                  onChange={handle('brand')}
                  placeholder="e.g. Sony, Apple, Bose"
                  className="bg-white/5 border-white/10 text-white placeholder:text-surface-600 focus:border-primary/50"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pricing & Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass padding="lg" className="border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <FiDollarSign size={20} />
              </div>
              <h2 className="text-xl font-bold text-gradient">Pricing & Inventory</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Price ($) *"
                type="number"
                value={form.price}
                onChange={handle('price')}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-surface-600 focus:border-secondary/50"
              />
              <Input
                label="Initial stock quantity *"
                type="number"
                value={form.stock}
                onChange={handle('stock')}
                placeholder="0"
                min="0"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-surface-600 focus:border-secondary/50"
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
          <Card glass padding="lg" className="border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <FiImage size={20} />
              </div>
              <h2 className="text-xl font-bold text-gradient">Product Image</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Image URL"
                type="url"
                value={form.imageUrl}
                onChange={handle('imageUrl')}
                placeholder="Paste external image address (e.g., https://images.unsplash.com/...)"
                className="bg-white/5 border-white/10 text-white placeholder:text-surface-600 focus:border-accent/50"
              />

              {form.imageUrl.trim() ? (
                <div className="mt-4 flex flex-col items-center justify-center p-4 border border-white/10 rounded-2xl bg-white/5 max-w-sm mx-auto">
                  <span className="text-xs text-surface-400 mb-2">Image Preview</span>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="max-h-48 rounded-xl object-contain border border-white/10"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      showToast('Unable to load image from URL preview', 'warning');
                    }}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-3 bg-background-light/30">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-surface-400">
                    <FiUpload size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-surface-400">Provide an image URL above to preview and attach it.</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-end"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/vendor/products')}
            className="border-white/10 text-surface-300 hover:bg-white/5 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving}
            size="lg"
            className="neon-glow bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 shadow-lg shadow-primary/20"
          >
            Add Product to Atlas
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
