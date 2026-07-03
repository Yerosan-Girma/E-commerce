import OrderCard from '../../components/order/OrderCard'
import { useState } from 'react'

const OrderHistory = () => {
  const [filter, setFilter] = useState('all')
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="flex gap-3 mb-6">
        {['all','processing','shipped','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter===s ? 'bg-primary text-white' : 'bg-white dark:bg-darksurface border'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-4">
        <OrderCard />
        <OrderCard />
      </div>
    </div>
  )
}

export default OrderHistory