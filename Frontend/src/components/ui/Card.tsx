import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

const Card = ({ children, className = '', hover = true }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5 }}
    whileHover={hover ? { y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' } : {}}
    className={`bg-white dark:bg-darksurface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 transition-shadow ${className}`}
  >
    {children}
  </motion.div>
)

export default Card