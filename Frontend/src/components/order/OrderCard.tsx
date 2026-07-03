import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { FiTruck } from 'react-icons/fi'

const OrderCard = ({ order }: { order?: any }) => {
  const defaultOrder = {
    id: '#ORD-12345',
    date: '2025-06-15',
    total: 89.97,
    status: 'processing',
    items: 3,
  }
  const o = order || defaultOrder

  const statusVariant = o.status === 'delivered' ? 'success' : o.status === 'processing' ? 'warning' : 'primary'

  return (
    <div className="bg-white dark:bg-darksurface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold">{o.id}</h3>
          <Badge variant={statusVariant}>{o.status}</Badge>
        </div>
        <p className="text-sm text-gray-500">Placed on {o.date} · {o.items} items</p>
        <p className="text-lg font-bold mt-1">${o.total}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm"><FiTruck className="mr-1" /> Track</Button>
        <Button size="sm">View Details</Button>
      </div>
    </div>
  )
}

export default OrderCard