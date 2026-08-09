import Badge from '../ui/Badge'
import { FiPackage, FiChevronRight } from 'react-icons/fi'

interface OrderItem {
  name: string
  qty: number
  price: number
}

export interface OrderSummary {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  total: number
}

type BadgeVariant = 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'gray'

const statusVariant: Record<OrderSummary['status'], BadgeVariant> = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
}

interface OrderCardProps {
  order: OrderSummary
  onView?: (id: string) => void
}

export default function OrderCard({ order, onView }: OrderCardProps) {
  return (
    <div className="bg-white dark:bg-darksurface border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FiPackage className="text-primary" size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Order #{order.id}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{order.date}</p>
          </div>
        </div>
        <Badge variant={statusVariant[order.status]}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="space-y-1.5 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="truncate">{item.name} × {item.qty}</span>
            <span className="shrink-0 ml-2">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Total: ${order.total.toFixed(2)}
        </span>
        {onView && (
          <button
            onClick={() => onView(order.id)}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            View Details <FiChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
