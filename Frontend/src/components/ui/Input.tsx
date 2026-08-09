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
        <label htmlFor={inputId} className="text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-surface-400 pointer-events-none">
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
            'w-full rounded-xl border px-4 py-3 text-sm',
            'bg-background-light/50 backdrop-blur-sm',
            'text-surface-100 placeholder:text-surface-500',
            'transition-all duration-300 outline-none',
            'focus:ring-2 focus:ring-primary/50',
            error
              ? 'border-error focus:border-error'
              : 'border-white/10 focus:border-primary',
            icon ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 text-surface-400">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-500">{hint}</p>}
    </div>
  )
}
