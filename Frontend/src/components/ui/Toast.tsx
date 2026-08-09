/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
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
  success: <FiCheckCircle className="text-success" size={18} />,
  error: <FiAlertCircle className="text-error" size={18} />,
  info: <FiInfo className="text-primary" size={18} />,
  warning: <FiAlertTriangle className="text-warning" size={18} />,
}

const colors: Record<ToastType, string> = {
  success: 'border-l-4 border-success',
  error: 'border-l-4 border-error',
  info: 'border-l-4 border-primary',
  warning: 'border-l-4 border-warning',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const remove = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={[
              'flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl',
              'bg-white dark:bg-darksurface',
              'animate-[slideUp_0.3s_ease-out]',
              colors[toast.type],
            ].join(' ')}
          >
            <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
            <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

