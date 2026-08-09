import { useState } from 'react'
import OrderCard from '../../components/order/OrderCard'
import type { OrderSummary } from '../../components/order/OrderCard'

type OrderFilter = OrderSummary['status'] | 'all'

const orders: OrderSummary[] = [
  {
    id: 'MH-1042',
    date: 'Aug 9, 2026',
    status: 'pending',
    items: [
      { name: 'Wireless Headphones Pro', qty: 1, price: 199.99 },
      { name: 'USB-C Charging Cable', qty: 2, price: 14.99 },
    ],
    total: 229.97,
  },
  {
    id: 'MH-1038',
    date: 'Aug 8, 2026',
    status: 'shipped',
    items: [
      { name: 'Smart Fitness Watch', qty: 1, price: 149.99 },
    ],
    total: 149.99,
  },
]

const filters: OrderFilter[] = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

const OrderMonitoring = () => {
  const [filter, setFilter] = useState<OrderFilter>('all')
  const visibleOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Monitoring</h1>
      <div className="flex gap-3 mb-6">
        {filters.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter === s ? 'bg-primary text-white' : 'bg-white dark:bg-darksurface border'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-4">
        {visibleOrders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  )
}

export default OrderMonitoring
