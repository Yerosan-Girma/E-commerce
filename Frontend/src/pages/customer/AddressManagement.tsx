import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import Button from '../../components/ui/Button'

const addresses = [
  { id:1, name:'Home', address:'123 Main St, New York, NY 10001', default:true },
  { id:2, name:'Office', address:'456 Business Ave, NY 10002', default:false },
]

const AddressManagement = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="flex justify-between mb-6">
      <h1 className="text-2xl font-bold">Addresses</h1>
      <Button><FiPlus className="mr-2" /> Add Address</Button>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map(addr => (
        <div key={addr.id} className="glass-card p-5">
          <div className="flex justify-between">
            <h3 className="font-semibold">{addr.name} {addr.default && <span className="text-xs text-primary ml-2">(Default)</span>}</h3>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-primary"><FiEdit /></button>
              <button className="text-gray-400 hover:text-error"><FiTrash2 /></button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{addr.address}</p>
        </div>
      ))}
    </div>
  </div>
)

export default AddressManagement