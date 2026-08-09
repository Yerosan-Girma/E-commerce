import { FiCheck, FiClock, FiTruck, FiPackage, FiHome } from 'react-icons/fi'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface TimelineStep {
  key: OrderStatus | 'placed'
  label: string
  icon: typeof FiCheck
}

const steps: TimelineStep[] = [
  { key: 'placed', label: 'Order Placed', icon: FiClock },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiHome },
]

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
}

interface OrderTimelineProps {
  status: OrderStatus
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = status === 'cancelled' ? -1 : statusIndex[status]

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center">
          <FiCheck className="text-error" size={16} />
        </div>
        <span className="text-sm font-medium text-error">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i <= currentIndex
        const active = i === currentIndex
        const Icon = step.icon
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                  done
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400',
                  active ? 'ring-4 ring-primary/20' : '',
                ].join(' ')}
              >
                <Icon size={15} />
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${done ? 'text-primary' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  'flex-1 h-0.5 mb-5 mx-1 transition-all duration-500',
                  i < currentIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
