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
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-extrabold text-gradient mb-2 tracking-tight">User Management</h1>
        <p className="text-surface-500">{users.length} registered users</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 items-center"
      >
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className={cn(
              'pl-10 pr-4 py-2.5 rounded-xl text-sm w-64',
              'bg-white/5 border border-white/10 backdrop-blur-sm',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all'
            )}
          />
        </div>
        <div className="flex gap-1 p-1.5 glass-card rounded-2xl">
          {(['all', 'customer', 'vendor', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200',
                roleFilter === r
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/8',
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
        <Card glass padding="none" className="overflow-hidden border border-white/8 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  {['User', 'Role', 'Orders', 'Joined', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-extrabold text-surface-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/4 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-primary/20">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-surface-100">{user.name}</p>
                          <p className="text-xs text-surface-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-surface-300">{user.orders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-500">{user.joined}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'error'} dot>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/8 transition-colors opacity-0 group-hover:opacity-100">
                        <FiMoreVertical size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-surface-500 text-sm">No users found.</div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
