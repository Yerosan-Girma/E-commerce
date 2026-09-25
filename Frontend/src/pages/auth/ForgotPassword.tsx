import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedBackground from '../../components/ui/AnimatedBackground'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
      <AnimatedBackground />
      <div className="w-full max-w-md z-10">
        <div className="glass-card-light p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-success" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
              >
                <FiArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiMail className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset password</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter your email to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  icon={<FiMail size={16} />}
                  error={error}
                />
                <Button type="submit" loading={loading} fullWidth size="lg">
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <FiArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
