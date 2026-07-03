import { FiCheck } from 'react-icons/fi'

const steps = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered']

const OrderTimeline = ({ currentStep = 2 }: { currentStep?: number }) => {
  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={step} className="flex items-start mb-8 relative">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
            index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
          }`}>
            {index < currentStep ? <FiCheck /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`absolute left-4 top-8 w-0.5 h-full -ml-px ${
              index < currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
            }`} />
          )}
          <div className="ml-4">
            <p className={`font-medium ${index <= currentStep ? 'text-primary' : 'text-gray-500'}`}>{step}</p>
            {index <= currentStep && <p className="text-xs text-gray-400">{index === currentStep ? 'In progress' : 'Completed'}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderTimeline