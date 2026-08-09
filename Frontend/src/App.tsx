import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import { useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { ToastProvider } from './components/ui/Toast'

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App