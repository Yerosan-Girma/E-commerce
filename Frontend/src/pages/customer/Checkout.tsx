import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { FiCreditCard } from 'react-icons/fi'

const steps = ['Shipping', 'Payment', 'Review']

const Checkout = () => {
  const [step, setStep] = useState(0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center ${i < steps.length-1 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>{i+1}</div>
            <span className={`ml-2 text-sm font-medium ${i <= step ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length-1 && <div className={`flex-1 h-0.5 mx-4 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" />
            <Input label="Last Name" />
            <Input label="Address" className="col-span-2" />
            <Input label="City" />
            <Input label="Zip Code" />
          </div>
          <Button className="mt-6" onClick={() => setStep(1)}>Continue to Payment</Button>
        </div>
      )}
      {step === 1 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer"><input type="radio" name="payment" className="accent-primary" defaultChecked /> <FiCreditCard /> Credit Card</label>
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer"><input type="radio" name="payment" className="accent-primary" /> PayPal</label>
            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer"><input type="radio" name="payment" className="accent-primary" /> Cash on Delivery</label>
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)}>Review Order</Button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="glass-card p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p className="text-gray-500">Items: 3 | Total: $89.97</p>
          <Button className="mt-6" size="lg">Place Order (Stripe Placeholder)</Button>
        </div>
      )}
    </div>
  )
}

export default Checkout