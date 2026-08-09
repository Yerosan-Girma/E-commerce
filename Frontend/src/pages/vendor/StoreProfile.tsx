import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import {
  FiGlobe, FiMail, FiPhone, FiMapPin, FiRefreshCw,
  FiEdit3, FiSave, FiTag, FiAlignLeft, FiAlertCircle
} from 'react-icons/fi'
import { cn } from '../../lib/utils'
import { api } from '../../services/api'

interface StoreData {
  _id?: string
  storeName: string
  description: string
  logo?: string
  address: string
  email?: string
  phone?: string
  website?: string
  category?: string
}

const inputCls = cn(
  'w-full px-4 py-3 rounded-xl text-sm transition-all',
  'bg-white/5 border border-white/10 backdrop-blur-sm',
  'text-surface-200 placeholder:text-surface-600',
  'focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none'
)

export default function StoreProfile() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storeExists, setStoreExists] = useState(false)

  const [store, setStore] = useState<StoreData>({
    storeName: '',
    description: '',
    logo: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    category: '',
  })

  const fetchStore = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMyStore() as unknown as StoreData
      if (data) {
        setStore({
          _id:         data._id,
          storeName:   data.storeName   || '',
          description: data.description || '',
          logo:        data.logo        || '',
          address:     data.address     || '',
          email:       data.email       || '',
          phone:       data.phone       || '',
          website:     data.website     || '',
          category:    data.category    || '',
        })
        setStoreExists(true)
      }
    } catch (err: any) {
      if (err.status === 404) {
        setStoreExists(false)
      } else {
        setError(err.message || 'Failed to load store profile')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStore() }, [])

  const handle = (field: keyof StoreData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setStore(s => ({ ...s, [field]: e.target.value }))

  const handleSave = async () => {
    if (!store.storeName.trim()) { showToast('Store name is required', 'error'); return }
    if (!store.address.trim())   { showToast('Store address is required', 'error'); return }
    setSaving(true)
    try {
      const payload = {
        storeName:   store.storeName.trim(),
        description: store.description.trim(),
        logo:        store.logo?.trim(),
        address:     store.address.trim(),
        email:       store.email?.trim(),
        phone:       store.phone?.trim(),
        website:     store.website?.trim(),
        category:    store.category?.trim(),
      }
      if (storeExists && store._id) {
        await api.updateStore(store._id, payload)
        showToast('Store profile updated!', 'success')
      } else {
        const created = await api.createStore(payload) as unknown as StoreData
        setStore(s => ({ ...s, _id: created._id }))
        setStoreExists(true)
        showToast('Store created and live!', 'success')
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  /* ── Loading ─────────────────────────────────────────── */
  if (loading) return (
    <div className="space-y-7 animate-pulse max-w-4xl">
      <div className="h-10 w-52 bg-white/10 rounded-xl" />
      <div className="h-52 bg-white/5 rounded-3xl border border-white/5" />
      <div className="h-64 bg-white/5 rounded-2xl border border-white/5" />
    </div>
  )

  /* ── Error ───────────────────────────────────────────── */
  if (error) return (
    <div className="flex flex-col items-center py-20 gap-4">
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
        <FiAlertCircle /> {error}
      </div>
      <button
        onClick={fetchStore}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-all"
      >
        <FiRefreshCw size={15} /> Retry
      </button>
    </div>
  )

  const initial = store.storeName ? store.storeName[0].toUpperCase() : 'S'

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ── Header ───────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <FiEdit3 size={20} />
          </div>
          <h1 className="text-4xl font-extrabold text-gradient">Store Profile</h1>
        </div>
        <p className="text-surface-500 text-sm">
          {storeExists ? 'Edit how your store appears to customers across the marketplace' : 'Set up your store to start selling'}
        </p>
      </motion.div>

      {/* ── Store Banner & Avatar ─────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-3xl border border-white/8 overflow-hidden shadow-2xl">
          {/* Banner */}
          <div className="relative h-44"
            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,.5) 0%, rgba(79,70,229,.3) 50%, rgba(219,39,119,.4) 100%)' }}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            {/* Decorative blobs */}
            <div className="absolute top-4 right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-20 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Avatar + store identity */}
          <div className="relative px-8 pb-7 bg-white/3 backdrop-blur-sm border-t border-white/8">
            {/* Avatar overlapping banner */}
            <div className="-mt-8 mb-4 flex items-end gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-3xl font-extrabold border-4 border-background shadow-2xl shadow-primary/30">
                {initial}
              </div>
              <div className="pb-1">
                <p className="text-xl font-extrabold text-gradient">{store.storeName || 'Your Store Name'}</p>
                <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-1.5">
                  <FiTag size={11} /> {store.category || 'No category set'}
                </p>
              </div>
            </div>

            {/* Store description preview */}
            {store.description && (
              <p className="text-sm text-surface-400 border-t border-white/8 pt-4 italic leading-relaxed">
                "{store.description}"
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Form Sections ────────────────────────────────── */}
      {/* Basic Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FiEdit3 size={17} />
            </div>
            <h2 className="text-lg font-bold text-gradient">Store Information</h2>
          </div>

          <Input
            label="Store name *"
            value={store.storeName}
            onChange={handle('storeName')}
            placeholder="e.g. GadgetHub Pro"
          />

          <div>
            <label className="text-sm font-semibold text-surface-300 flex items-center gap-2 mb-2">
              <FiAlignLeft size={13} className="text-surface-400" /> Description
            </label>
            <textarea
              value={store.description}
              onChange={handle('description')}
              rows={3}
              placeholder="Tell customers what makes your store special…"
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          <Input
            label="Category"
            value={store.category || ''}
            onChange={handle('category')}
            placeholder="e.g. Electronics, Fashion, Home Decor"
            icon={<FiTag size={14} />}
          />
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <FiMail size={17} />
            </div>
            <h2 className="text-lg font-bold text-gradient">Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Business Email" type="email" value={store.email || ''} onChange={handle('email')} icon={<FiMail size={14} />} placeholder="store@example.com" />
            <Input label="Phone" type="tel" value={store.phone || ''} onChange={handle('phone')} icon={<FiPhone size={14} />} placeholder="+1 (555) 000-0000" />
            <Input label="Website" type="url" value={store.website || ''} onChange={handle('website')} icon={<FiGlobe size={14} />} placeholder="https://yourstore.com" />
            <Input label="Address *" value={store.address} onChange={handle('address')} icon={<FiMapPin size={14} />} placeholder="123 Market Street, City" />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          loading={saving}
          size="lg"
          className="gap-2 shadow-xl shadow-primary/20 neon-glow font-extrabold"
        >
          <FiSave size={17} />
          {storeExists ? 'Save Changes' : 'Create Store'}
        </Button>
        {storeExists && (
          <span className="text-xs text-surface-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Store is live
          </span>
        )}
      </motion.div>
    </div>
  )
}
