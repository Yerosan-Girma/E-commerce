import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'neon' | 'success'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  disabled?: boolean
  icon?: ReactNode
  children?: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 border border-purple-500/20',
  secondary:
    'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:from-pink-500 hover:to-rose-400 shadow-lg shadow-pink-500/25 border border-pink-500/20',
  outline:
    'bg-transparent border border-white/15 text-surface-300 hover:bg-white/10 hover:border-white/25 hover:text-white backdrop-blur-sm',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/25 border border-red-500/20',
  ghost:
    'bg-white/5 text-surface-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10',
  neon:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow',
  success:
    'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 border border-emerald-500/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-transparent',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {icon && !loading && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}
