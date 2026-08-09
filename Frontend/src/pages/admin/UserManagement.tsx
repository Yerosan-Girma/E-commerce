import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { FiSearch, FiMoreVertical } from 'react-icons/fi'
import { cn } from '../../lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  status: 'active' | 'suspended'
  joined: string
  orders: number
}

const users: User[] = [
  { id: 'U001', name: 'Alice Wilson', email: 'alice@example.com', role: 'customer', status: 'active', joined: 'Jan 5, 2025', orders: 14 },
  { id: 'U002', name: 'Bob Martinez', email: 'bob@techstore.com', role: 'vendor', status: 'active', joined: 'Dec 12, 2024', orders: 0 },
  { id: 'U003', name: 'Carol Smith', email: 'carol@example.com', role: 'customer', status: 'suspended', joined: 'Nov 20, 2024', orders: 3 },
  { id: 'U004', name: 'David Reed', email: 'david@fashionhub.com', role: 'vendor', status: 'active', joined: 'Oct 8, 2024', orders: 0 },
  { id: 'U005', name: 'Eve Liu', email: 'eve@example.com', role: 'customer', status: 'active', joined: 'Jan 18, 2025', orders: 7 },
  { id: 'U006', name: 'Frank Brown', email: 'frank@admin.com', role: 'admin', status: 'active', joined: 'Jan 1, 2024', orders: 0 },
]

const roleVariant: Record<User['role'], 'primary' | 'secondary' | 'error'> = {
  customer: 'primary',
  vendor: 'secondary',
  admin: 'error',
}

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">User Management</h1>
        <p className="text-surface-500">{users.length} total users</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className={cn(
              'pl-9 pr-4 py-2.5 rounded-xl text-sm',
              'glass border border-white/10',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none w-60'
            )}
          />
        </div>
        <div className="flex gap-1 p-1 glass rounded-2xl">
          {(['all', 'customer', 'vendor', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all',
                roleFilter === r
                  ? 'bg-gradient-mesh text-white neon-glow'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'
              )}
            >
              {r}
            </button>
          ))}
        </div>
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
                  {['User', 'Role', 'Orders', 'Joined', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center text-white text-sm font-bold shrink-0 neon-glow">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-200">{user.name}</p>
                          <p className="text-xs text-surface-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-400">{user.orders}</td>
                    <td className="px-5 py-4 text-sm text-surface-500">{user.joined}</td>
                    <td className="px-5 py-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'error'} dot>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors">
                        <FiMoreVertical size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-surface-500">No users found.</div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
