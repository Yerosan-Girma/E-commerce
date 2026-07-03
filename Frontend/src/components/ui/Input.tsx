import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>}
    <input
      className={`w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${error ? 'border-error' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-error text-sm mt-1">{error}</p>}
  </div>
)

export default Input