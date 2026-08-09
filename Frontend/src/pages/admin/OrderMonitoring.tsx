import { useState } from 'react'
import OrderCard from '../../components/order/OrderCard'

const OrderMonitoring = () => {
  const [filter, setFilter] = useState('all')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Monitoring</h1>
      <div className="flex gap-3 mb-6">
        {['all','pending','processing','shipped','delivered','dispute'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter===s ? 'bg-primary text-white' : 'bg-white dark:bg-darksurface border'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-4"><OrderCard /><OrderCard /></div>
    </div>
  )
}

export default OrderMonitoring