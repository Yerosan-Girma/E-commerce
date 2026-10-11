import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store'
import { setCredentials } from '../../store/slices/authSlice'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useToast } from '../../components/ui/Toast'
import { FiUser, FiLock, FiSave, FiCamera, FiShield } from 'react-icons/fi'
import { cn } from '../../lib/utils'

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const { showToast } = useToast()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    dispatch(setCredentials({
      user: { name, email, role: user?.role ?? 'customer' },
      token: localStorage.getItem('token') ?? 'mock-token',
    }))
    showToast('Profile updated successfully!', 'success')
    setSaving(false)
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">Profile Settings</h1>
          <p className="text-surface-500">Manage your account information</p>
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass padding="lg" className="flex items-center gap-6 mb-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-2xl bg-gradient-mesh flex items-center justify-center text-white text-4xl font-bold neon-glow"
              >
                {name ? name[0].toUpperCase() : 'U'}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <FiCamera size={14} className="text-surface-400" />
              </motion.button>
            </div>
            <div>
              <p className="font-bold text-surface-200 text-xl">{user?.name || 'User'}</p>
              <p className="text-sm text-surface-500 mb-2">{user?.email}</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary capitalize">
                <FiShield size={12} /> {user?.role || 'customer'}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass padding="lg" className="mb-6">
            <h2 className="text-lg font-bold text-gradient mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                <FiUser size={20} className="text-white" />
              </div>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-surface-400 mb-2 block">Full name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm',
                    'bg-background-light/50 backdrop-blur-sm border border-white/10',
                    'text-surface-100 placeholder:text-surface-500',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  )}
                />
              </div>
              <div>
                <label className="text-sm text-surface-400 mb-2 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm',
                    'bg-background-light/50 backdrop-blur-sm border border-white/10',
                    'text-surface-100 placeholder:text-surface-500',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  )}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass padding="lg" className="mb-6">
            <h2 className="text-lg font-bold text-gradient mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center">
                <FiLock size={20} className="text-white" />
              </div>
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-surface-400 mb-2 block">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm',
                    'bg-background-light/50 backdrop-blur-sm border border-white/10',
                    'text-surface-100 placeholder:text-surface-500',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  )}
                />
              </div>
              <div>
                <label className="text-sm text-surface-400 mb-2 block">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm',
                    'bg-background-light/50 backdrop-blur-sm border border-white/10',
                    'text-surface-100 placeholder:text-surface-500',
                    'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none'
                  )}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={handleSave} loading={saving} size="lg" className="neon-glow gap-2">
            <FiSave size={18} /> Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
