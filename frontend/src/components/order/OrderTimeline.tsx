import { motion } from 'framer-motion'
import { FiCheck, FiClock, FiTruck, FiPackage, FiHome, FiX } from 'react-icons/fi'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface TimelineStep {
  key: OrderStatus | 'placed'
  label: string
  icon: typeof FiCheck
}

const steps: TimelineStep[] = [
  { key: 'placed',      label: 'Placed',      icon: FiClock   },
  { key: 'processing',  label: 'Processing',  icon: FiPackage },
  { key: 'shipped',     label: 'Shipped',     icon: FiTruck   },
  { key: 'delivered',   label: 'Delivered',   icon: FiHome    },
]

const statusIndex: Record<OrderStatus, number> = {
  pending:    0,
  processing: 1,
  shipped:    2,
  delivered:  3,
  cancelled: -1,
}

interface OrderTimelineProps {
  status: OrderStatus
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = statusIndex[status]

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shadow-sm">
          <FiX className="text-red-400" size={18} />
        </div>
        <span className="text-sm font-semibold text-red-400">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done   = i <= currentIndex
        const active = i === currentIndex
        const Icon   = step.icon
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md',
                  done
                    ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-primary/30'
                    : 'bg-white/5 border border-white/10 text-surface-500',
                  active ? 'ring-4 ring-primary/25 ring-offset-2 ring-offset-transparent' : '',
                ].join(' ')}
              >
                {done && !active
                  ? <FiCheck size={16} />
                  : <Icon size={15} />
                }
              </motion.div>
              <span className={`text-xs font-semibold whitespace-nowrap ${done ? 'text-primary' : 'text-surface-500'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className={[
                  'flex-1 h-0.5 mb-5 mx-2 rounded-full origin-left transition-all duration-500',
                  i < currentIndex ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
