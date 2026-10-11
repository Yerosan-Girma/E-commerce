import type { HTMLAttributes } from 'react'

type BadgeVariant = 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'gray'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success:   'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10',
  warning:   'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10',
  error:     'bg-red-500/15 text-red-300 border border-red-500/30 shadow-sm shadow-red-500/10',
  primary:   'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10',
  secondary: 'bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10',
  gray:      'bg-white/10 text-surface-200 border border-white/15',
}

const dotClasses: Record<BadgeVariant, string> = {
  success:   'bg-emerald-400',
  warning:   'bg-amber-400',
  error:     'bg-red-400',
  primary:   'bg-blue-400',
  secondary: 'bg-violet-400',
  gray:      'bg-gray-400',
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
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  )
}
