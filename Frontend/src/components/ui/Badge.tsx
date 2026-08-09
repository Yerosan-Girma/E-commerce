import type { HTMLAttributes } from 'react'

type BadgeVariant = 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'gray'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  error: 'bg-red-500/15 text-red-300 border border-red-500/25',
  primary: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  secondary: 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  gray: 'bg-white/10 text-surface-300 border border-white/10',
}

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  primary: 'bg-blue-500',
  secondary: 'bg-violet-500',
  gray: 'bg-gray-400',
}

export default function Badge({
  variant = 'gray',
  dot = false,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />}
      {children}
    </span>
  )
}
