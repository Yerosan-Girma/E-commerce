import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/slices/authSlice'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedBackground from '../../components/ui/AnimatedBackground'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { api } from '../../services/api'

interface AuthResponse {
  _id?: string
  name: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  token: string
}

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectFrom = (location.state as { from?: string; requiredRole?: string } | null)?.from
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'vendor' | 'admin'>('customer')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  const navigateForRole = (userRole: AuthResponse['role']) => {
    if (redirectFrom && redirectFrom.startsWith(`/${userRole === 'admin' ? 'admin' : userRole === 'vendor' ? 'vendor' : ''}`)) {
      navigate(redirectFrom)
      return
    }
    if (userRole === 'vendor') navigate('/vendor')
    else if (userRole === 'admin') navigate('/admin')
    else navigate('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setErrors({})

    try {
      const response = await api.login({ email, password, role }) as unknown as AuthResponse

      if (!response.token) {
        setErrors({ form: 'Login failed — no auth token received from server.' })
        setLoading(false)
        return
      }

      if (response.role !== role) {
        setErrors({
          form: `This account is registered as a ${response.role}. Please select "${response.role.charAt(0).toUpperCase() + response.role.slice(1)}" above and try again.`,
        })
        setLoading(false)
        return
      }

      dispatch(setCredentials({
        user: {
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
        },
        token: response.token,
      }))

      navigateForRole(response.role)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setErrors({
        form: message.includes('fetch')
          ? 'Cannot reach the server. Start the backend on port 5000 and try again.'
          : message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
      <AnimatedBackground />
      <div className="w-full max-w-md z-10">
        <div className="glass-card-light p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">M</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your MarketHub account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.form}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Login as</label>
              <div className="flex gap-2">
                {(['customer', 'vendor', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      role === r
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'vendor' ? 'vendor@example.com' : role === 'admin' ? 'admin@example.com' : 'you@example.com'}
              icon={<FiMail size={16} />}
              error={errors.email}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<FiLock size={16} />}
              error={errors.password}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
