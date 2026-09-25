import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  hover?: boolean
  glass?: boolean
  neon?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  gradient?: boolean
  animated?: boolean
  children?: ReactNode
  className?: string
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  hover = false,
  glass = true,
  neon = false,
  padding = 'md',
  gradient = false,
  animated = true,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 16 } : false}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={hover ? {
        y: -6,
        scale: 1.015,
        boxShadow: neon
          ? '0 0 32px rgba(99, 102, 241, 0.45)'
          : '0 24px 48px -12px rgba(0,0,0,0.4)',
      } : {}}
      className={cn(
        'rounded-2xl transition-all duration-300',
        glass && 'glass-card',
        gradient && 'bg-gradient-mesh',
        neon && 'neon-glow',
        !glass && !gradient && 'bg-background-light border border-white/10',
        hover && 'cursor-pointer',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
