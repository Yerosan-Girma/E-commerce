import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AnimatedBackground from '../../components/ui/AnimatedBackground'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Join as a Customer or Vendor</p>
          </div>
          <form className="space-y-4">
            <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" /><Input placeholder="Full Name" className="pl-10" /></div>
            <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" /><Input type="email" placeholder="Email" className="pl-10" /></div>
            <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" /><Input type="password" placeholder="Password" className="pl-10" /></div>
            <div>
              <label className="block text-sm font-medium mb-2">I want to</label>
              <div className="flex gap-2">
                <button type="button" className="flex-1 py-2 rounded-xl border border-primary text-primary bg-primary/5 font-medium">Customer</button>
                <button type="button" className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium">Vendor</button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary rounded" /> I agree to the Terms & Privacy</label>
            <Button className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-500">Already have an account? <Link to="/login" className="text-primary font-semibold">Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register