import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { FiSearch, FiCheck, FiX, FiMoreVertical } from 'react-icons/fi'
import { cn } from '../../lib/utils'

interface Vendor {
  id: string
  name: string
  store: string
  email: string
  status: 'approved' | 'pending' | 'rejected' | 'suspended'
  products: number
  revenue: string
  joined: string
}

const vendors: Vendor[] = [
  { id: 'V001', name: 'Bob Martinez', store: 'TechStore', email: 'bob@techstore.com', status: 'approved', products: 64, revenue: '$12,456', joined: 'Dec 12, 2024' },
  { id: 'V002', name: 'Diana Cole', store: 'StyleHouse', email: 'diana@stylehouse.com', status: 'pending', products: 0, revenue: '$0', joined: 'Jan 25, 2025' },
  { id: 'V003', name: 'Eric Nguyen', store: 'FashionHub', email: 'eric@fashionhub.com', status: 'approved', products: 128, revenue: '$28,920', joined: 'Oct 8, 2024' },
  { id: 'V004', name: 'Fatima Khan', store: 'GreenGoods', email: 'fatima@greengoods.com', status: 'pending', products: 0, revenue: '$0', joined: 'Jan 28, 2025' },
  { id: 'V005', name: 'Greg Patel', store: 'TechPro', email: 'greg@techpro.com', status: 'suspended', products: 23, revenue: '$4,120', joined: 'Sep 1, 2024' },
  { id: 'V006', name: 'Helen Wu', store: 'HomeComfort', email: 'helen@homecomfort.com', status: 'rejected', products: 0, revenue: '$0', joined: 'Jan 10, 2025' },
]

const statusMap: Record<Vendor['status'], 'success' | 'warning' | 'error' | 'gray'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  suspended: 'gray',
}

export default function VendorManagement() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Vendor['status'] | 'all'>('all')
  const [vendorList, setVendorList] = useState<Vendor[]>(vendors)

  const filtered = vendorList.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.store.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  const approve = (id: string) => {
    setVendorList(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v))
  }

  const reject = (id: string) => {
    setVendorList(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Vendor Management</h1>
        <p className="text-surface-500">
          {vendorList.filter(v => v.status === 'pending').length} pending approvals
        </p>
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
            placeholder="Search vendors..."
            className={cn(
              'pl-9 pr-4 py-2.5 rounded-xl text-sm',
              'glass border border-white/10',
              'text-surface-200 placeholder:text-surface-500',
              'focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none w-60'
            )}
          />
        </div>
        <div className="flex gap-1 p-1 glass rounded-2xl">
          {(['all', 'approved', 'pending', 'rejected', 'suspended'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all',
                statusFilter === s
                  ? 'bg-gradient-mesh text-white neon-glow'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'
              )}
            >
              {s}
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
                  {['Vendor', 'Store', 'Products', 'Revenue', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((vendor, i) => (
                  <motion.tr
                    key={vendor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-mesh flex items-center justify-center text-white text-sm font-bold shrink-0 neon-glow">
                          {vendor.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-200">{vendor.name}</p>
                          <p className="text-xs text-surface-500">{vendor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-surface-300">{vendor.store}</td>
                    <td className="px-5 py-4 text-sm text-surface-400">{vendor.products}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-surface-200">{vendor.revenue}</td>
                    <td className="px-5 py-4 text-sm text-surface-500">{vendor.joined}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusMap[vendor.status]} dot>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {vendor.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => approve(vendor.id)}
                              className="!text-success !bg-success/10 hover:!bg-success/20 gap-1"
                            >
                              <FiCheck size={13} /> Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => reject(vendor.id)}
                              className="!text-accent !bg-accent/10 hover:!bg-accent/20 gap-1"
                            >
                              <FiX size={13} /> Reject
                            </Button>
                          </>
                        )}
                        {vendor.status !== 'pending' && (
                          <button className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors">
                            <FiMoreVertical size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
