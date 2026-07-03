import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedBackground from '../../components/ui/AnimatedBackground'
import { useState } from 'react'

const ForgotPassword = () => {
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 rounded-2xl text-center">
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
              <p className="text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>
              <div className="relative mb-4"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" /><Input placeholder="Email address" className="pl-10" /></div>
              <Button className="w-full" onClick={() => setSent(true)}>Send Reset Link</Button>
            </>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-success text-2xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
              <p className="text-gray-500">We've sent a password reset link to your email.</p>
            </motion.div>
          )}
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary mt-6 hover:underline"><FiArrowLeft /> Back to Login</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword