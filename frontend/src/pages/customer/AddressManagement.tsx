import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi'

interface Address {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

const initialAddresses: Address[] = [
  { id: '1', name: 'Home', address: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', country: 'US', isDefault: true },
  { id: '2', name: 'Office', address: '456 Business Ave', city: 'New York', state: 'NY', zip: '10002', country: 'US', isDefault: false },
]

const emptyForm = { name: '', address: '', city: '', state: '', zip: '', country: 'US' }

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const openAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditId(addr.id)
    setForm({ name: addr.name, address: addr.address, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (editId) {
      setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a))
    } else {
      setAddresses(prev => [...prev, { id: Date.now().toString(), ...form, isDefault: prev.length === 0 }])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your delivery addresses</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <FiPlus size={16} /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="text-primary" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No addresses yet</h3>
          <p className="text-gray-400 mb-6">Add your first delivery address.</p>
          <Button onClick={openAdd} className="gap-2"><FiPlus size={16} /> Add Address</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={[
                'bg-white dark:bg-darksurface border rounded-2xl p-5 transition-all',
                addr.isDefault ? 'border-primary/40 shadow-md shadow-primary/5' : 'border-gray-100 dark:border-gray-700/50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FiMapPin className="text-primary" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{addr.name}</span>
                      {addr.isDefault && <Badge variant="primary">Default</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(addr)}
                    className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.id)}
                  className="mt-3 text-xs text-primary font-medium hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Address' : 'Add Address'}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Label (e.g. Home, Office)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Home" />
          <Input label="Street address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="New York" />
            <Input label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="NY" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="ZIP" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} placeholder="10001" />
            <Input label="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="US" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} fullWidth>Cancel</Button>
            <Button onClick={handleSave} fullWidth>Save Address</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
