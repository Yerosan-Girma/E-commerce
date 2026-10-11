import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

export default function Input({
  label,
  error,
  hint,
  icon,
  iconRight,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-700 dark:text-surface-200 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-gray-400 dark:text-surface-400 pointer-events-none z-10">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm font-medium',
            'bg-white/70 dark:bg-background-light/60 backdrop-blur-sm',
            'text-gray-900 dark:text-surface-100',
            'placeholder:text-gray-400 dark:placeholder:text-surface-500',
            'transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-primary/40 focus:shadow-lg focus:shadow-primary/10',
            error
              ? 'border-red-400 dark:border-error focus:border-red-400 dark:focus:border-error bg-red-50/50 dark:bg-red-500/5'
              : 'border-gray-200 dark:border-white/12 focus:border-primary hover:border-gray-300 dark:hover:border-white/20',
            icon ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3.5 text-gray-400 dark:text-surface-400 z-10">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-error flex items-center gap-1 mt-0.5">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 dark:bg-error" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-400 dark:text-surface-500 mt-0.5">{hint}</p>
      )}
    </div>
  )
}
