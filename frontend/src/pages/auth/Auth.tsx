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
type AuthMode = 'signin' | 'signup'

export default function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('customer')
  const [signinRole, setSigninRole] = useState<'customer' | 'vendor' | 'admin'>('customer')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; form?: string }>({})

  const validateSignin = () => {
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  const validateSignup = () => {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const navigateForRole = (userRole: AuthResponse['role']) => {
    if (userRole === 'vendor') navigate('/vendor')
    else if (userRole === 'admin') navigate('/admin')
    else navigate('/')
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateSignin()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setErrors({})

    try {
      const response = await api.login({ email, password, role: signinRole }) as unknown as AuthResponse

      if (!response.token) {
        setErrors({ form: 'Login failed — no auth token received from server.' })
        setLoading(false)
        return
      }

      if (response.role !== signinRole) {
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
          ? 'Cannot reach the server. Please check your connection.'
          : message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateSignup()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setErrors({})

    try {
      const response = await api.register({ name, email, password, role }) as unknown as AuthResponse
      dispatch(setCredentials({
        user: { name: response.name, email: response.email, role: response.role },
        token: response.token,
      }))
      navigate(role === 'vendor' ? '/vendor' : '/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      setErrors({ form: message })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = mode === 'signin' ? handleSignin : handleSignup

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'signin' ? 'Sign in to your MarketHub account' : 'Join MarketHub today'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrors({}) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white dark:bg-darksurface text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrors({}) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white dark:bg-darksurface text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.form}
              </div>
            )}

            {mode === 'signin' && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Login as</label>
                <div className="flex gap-2">
                  {(['customer', 'vendor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSigninRole(r)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                        signinRole === r
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                {/* Role Toggle for Signup */}
                <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 mb-4">
                  {(['customer', 'vendor'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                        role === r
                          ? 'bg-white dark:bg-darksurface text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {r === 'customer' ? '🛍️ Customer' : '🏪 Vendor'}
                    </button>
                  ))}
                </div>

                <Input
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  icon={<FiUser size={16} />}
                  error={errors.name}
                />
              </>
            )}

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
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
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

            {mode === 'signup' && (
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
            )}

            {mode === 'signup' && role === 'vendor' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
                🏪 As a vendor, you'll get access to your own store dashboard to manage products and orders.
              </div>
            )}

            {mode === 'signin' && (
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
            )}

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('signin')} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
