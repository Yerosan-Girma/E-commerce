import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice'
import { FiTrash2, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const tax = subtotal * 0.08

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length})</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-500">Your cart is empty.</p></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 bg-white dark:bg-darksurface p-4 rounded-xl border">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl">📱</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-primary font-bold">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <select value={item.quantity} onChange={e => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) }))} className="border rounded-lg px-2 py-1 text-sm">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-error"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-darksurface p-6 rounded-2xl border h-fit">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${(subtotal+shipping+tax).toFixed(2)}</span></div>
            </div>
            <input placeholder="Coupon code" className="w-full mt-4 border rounded-xl px-3 py-2 text-sm" />
            <Link to="/checkout"><Button className="w-full mt-4"><FiArrowRight className="mr-2" /> Proceed to Checkout</Button></Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart