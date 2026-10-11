/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons: Record<ToastType, ReactNode> = {
  success: <FiCheckCircle size={18} />,
  error:   <FiAlertCircle size={18} />,
  info:    <FiInfo size={18} />,
  warning: <FiAlertTriangle size={18} />,
}

const styles: Record<ToastType, { bar: string; icon: string; bg: string }> = {
  success: { bar: 'bg-emerald-500', icon: 'text-emerald-400', bg: 'border-emerald-500/20 bg-emerald-500/8' },
  error:   { bar: 'bg-red-500',     icon: 'text-red-400',     bg: 'border-red-500/20 bg-red-500/8' },
  info:    { bar: 'bg-blue-500',    icon: 'text-blue-400',    bg: 'border-blue-500/20 bg-blue-500/8' },
  warning: { bar: 'bg-amber-500',   icon: 'text-amber-400',   bg: 'border-amber-500/20 bg-amber-500/8' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800)
  }, [])

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const s = styles[toast.type]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.92 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={[
                  'pointer-events-auto relative overflow-hidden',
                  'flex items-start gap-3 px-4 py-3.5 rounded-2xl',
                  'glass-card border shadow-2xl',
                  s.bg,
                ].join(' ')}
              >
                {/* Accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar} rounded-l-2xl`} />

                <span className={`mt-0.5 shrink-0 ${s.icon}`}>{icons[toast.type]}</span>
                <p className="text-sm font-medium text-surface-100 flex-1 leading-snug pr-1">
                  {toast.message}
                </p>
                <button
                  onClick={() => remove(toast.id)}
                  className="shrink-0 text-surface-500 hover:text-surface-200 transition-colors mt-0.5"
                  aria-label="Dismiss"
                >
                  <FiX size={15} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
