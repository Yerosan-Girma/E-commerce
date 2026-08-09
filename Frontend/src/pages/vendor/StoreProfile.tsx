import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { FiCamera, FiGlobe, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { cn } from '../../lib/utils'

export default function StoreProfile() {
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [store, setStore] = useState({
    name: 'TechStore Official',
    description: 'Your go-to destination for premium electronics and tech accessories.',
    email: 'store@techstore.com',
    phone: '+1 (555) 123-4567',
    website: 'https://techstore.com',
    address: '123 Tech Ave, Silicon Valley, CA 94025',
    category: 'Electronics',
  })

  const handle = (field: keyof typeof store) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStore(s => ({ ...s, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    showToast('Store profile saved!', 'success')
    setSaving(false)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Store Profile</h1>
        <p className="text-surface-500">Manage how your store appears to customers</p>
      </motion.div>

      {/* Store Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card glass padding="none" className="overflow-hidden">
          <div className="h-40 bg-gradient-mesh relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors neon-glow"
            >
              <FiCamera size={16} className="text-white" />
            </motion.button>
          </div>
          <div className="px-6 pb-6">
            <div className="relative -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-mesh flex items-center justify-center text-white text-3xl font-bold neon-glow border-4 border-background">
                T
              </div>
            </div>
            <p className="text-xl font-bold text-gradient">{store.name}</p>
            <p className="text-sm text-surface-500">{store.category}</p>
          </div>
        </Card>
      </motion.div>

      {/* Store Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass padding="lg" className="space-y-5">
          <h2 className="text-lg font-bold text-gradient">Store Information</h2>
          <Input label="Store name" value={store.name} onChange={handle('name')} />
          <div>
            <label className="text-sm font-medium text-surface-300 block mb-1.5">Description</label>
            <textarea
              value={store.description}
              onChange={handle('description')}
              rows={3}
              className={cn(
                'w-full px-4 py-2.5 rounded-xl text-sm',
                'glass border border-white/10',
                'text-surface-200 placeholder:text-surface-500',
                'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none'
              )}
            />
          </div>
          <Input label="Category" value={store.category} onChange={handle('category')} />
        </Card>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card glass padding="lg" className="space-y-5">
          <h2 className="text-lg font-bold text-gradient">Contact Details</h2>
          <Input label="Email" type="email" value={store.email} onChange={handle('email')} icon={<FiMail size={15} />} />
          <Input label="Phone" type="tel" value={store.phone} onChange={handle('phone')} icon={<FiPhone size={15} />} />
          <Input label="Website" type="url" value={store.website} onChange={handle('website')} icon={<FiGlobe size={15} />} />
          <Input label="Address" value={store.address} onChange={handle('address')} icon={<FiMapPin size={15} />} />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button onClick={handleSave} loading={saving} size="lg" className="neon-glow">Save Changes</Button>
      </motion.div>
    </div>
  )
}
