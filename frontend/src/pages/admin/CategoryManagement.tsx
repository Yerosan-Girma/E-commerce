import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  products: number
}

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '💻', products: 1240 },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👗', products: 3520 },
  { id: '3', name: 'Home & Living', slug: 'home-living', icon: '🏠', products: 892 },
  { id: '4', name: 'Sports', slug: 'sports', icon: '⚽', products: 623 },
  { id: '5', name: 'Beauty', slug: 'beauty', icon: '💄', products: 720 },
  { id: '6', name: 'Books', slug: 'books', icon: '📚', products: 453 },
]

const emptyForm = { name: '', slug: '', icon: '' }

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editId) {
      setCategories(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c))
    } else {
      setCategories(prev => [...prev, { id: Date.now().toString(), ...form, products: 0 }])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id))
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
          <h1 className="text-4xl font-bold text-gradient mb-2">Categories</h1>
          <p className="text-surface-500">{categories.length} categories</p>
        </div>
        <Button onClick={openAdd} className="neon-glow gap-2">
          <FiPlus size={16} /> Add Category
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card glass padding="lg" hover className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-mesh flex items-center justify-center text-3xl neon-glow">
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-bold text-surface-200">{cat.name}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{cat.products.toLocaleString()} products</p>
                      <p className="text-xs text-surface-600">{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(cat)}
                      className="p-2 rounded-xl text-surface-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <FiEdit2 size={15} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 rounded-xl text-surface-500 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </motion.div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Electronics" />
          <Input label="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="electronics" />
          <Input label="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="💻" />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button onClick={handleSave} fullWidth>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
