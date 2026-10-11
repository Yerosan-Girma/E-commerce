import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/slices/authSlice'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedBackground from '../../components/ui/AnimatedBackground'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import { api } from '../../services/api'

interface AuthResponse {
  _id?: string
  name: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  token: string
}

type Role = 'customer' | 'vendor'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)

    try {
      const response = await api.register({ name, email, password, role }) as unknown as AuthResponse
      dispatch(setCredentials({
        user: { name: response.name, email: response.email, role: response.role },
        token: response.token,
      }))
      navigate(role === 'vendor' ? '/vendor' : '/')
    } catch (error) {
      console.log('Backend registration failed, using mock auth:', error)
      dispatch(setCredentials({
        user: { name, email, role },
        token: 'mock-token-' + Date.now(),
      }))
      navigate(role === 'vendor' ? '/vendor' : '/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
      <AnimatedBackground />
      <div className="w-full max-w-md z-10">
        <div className="glass-card-light p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">M</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join MarketHub today</p>
          </div>

          {/* Role Toggle */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 mb-6">
            {(['customer', 'vendor'] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200',
                  role === r
                    ? 'bg-white dark:bg-darksurface text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700',
                ].join(' ')}
              >
                {r === 'customer' ? '🛍️ Customer' : '🏪 Vendor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              icon={<FiUser size={16} />}
              error={errors.name}
            />
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<FiMail size={16} />}
              error={errors.email}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
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
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              icon={<FiLock size={16} />}
              error={errors.confirmPassword}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />

            {role === 'vendor' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
                🏪 As a vendor, you'll get access to your own store dashboard to manage products and orders.
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
