import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import { FiPackage, FiChevronRight, FiCalendar } from 'react-icons/fi'

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
  pending:    'warning',
  processing: 'primary',
  shipped:    'secondary',
  delivered:  'success',
  cancelled:  'error',
}

const statusIcon: Record<OrderSummary['status'], string> = {
  pending:    '🕐',
  processing: '⚙️',
  shipped:    '🚚',
  delivered:  '✅',
  cancelled:  '❌',
}

interface OrderCardProps {
  order: OrderSummary
  onView?: (id: string) => void
}

export default function OrderCard({ order, onView }: OrderCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.2)' }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-darksurface border border-gray-100 dark:border-white/8 rounded-2xl p-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
            <FiPackage className="text-primary" size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-surface-100 text-sm">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 dark:text-surface-500 flex items-center gap-1 mt-0.5">
              <FiCalendar size={10} /> {order.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">{statusIcon[order.status]}</span>
          <Badge variant={statusVariant[order.status]} dot>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="space-y-1.5 mb-4 bg-gray-50 dark:bg-white/3 rounded-xl p-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-surface-400 truncate">
              {item.name}
              <span className="text-gray-400 dark:text-surface-500 ml-1">×{item.qty}</span>
            </span>
            <span className="shrink-0 ml-3 font-semibold text-gray-700 dark:text-surface-300">
              ${(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/8">
        <div>
          <span className="text-xs text-gray-400 dark:text-surface-500">Total</span>
          <span className="ml-2 text-base font-extrabold text-gray-900 dark:text-white">
            ${order.total.toFixed(2)}
          </span>
        </div>
        {onView && (
          <button
            onClick={() => onView(order.id)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            View Details
            <FiChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
