import { useState } from 'react'
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { useToast } from '../../components/ui/Toast'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const handleAddToCart = () => {
    dispatch(addToCart({ id: id || '1', name: 'Wireless Headphones', price: 49.99, quantity }))
    addToast('Added to cart!', 'success')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl h-96 flex items-center justify-center text-6xl">📱</div>
        <div>
          <p className="text-sm text-primary font-medium">TechGear</p>
          <h1 className="text-3xl font-bold mt-1">Wireless Bluetooth Headphones</h1>
          <div className="flex items-center gap-2 mt-2 text-yellow-500">
            {'★★★★½'} <span className="text-gray-500 text-sm">(128 reviews)</span>
          </div>
          <p className="text-2xl font-bold text-primary mt-4">$49.99 <span className="text-gray-400 line-through text-lg ml-2">$62.00</span></p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Experience premium sound quality with noise cancellation and 30-hour battery life.</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="px-3 py-2">-</button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => setQuantity(quantity+1)} className="px-3 py-2">+</button>
            </div>
            <Button onClick={handleAddToCart}><FiShoppingCart className="mr-2" /> Add to Cart</Button>
            <button className="p-3 rounded-xl border"><FiHeart /></button>
          </div>
          <div className="mt-6 bg-surface dark:bg-darksurface p-4 rounded-xl">
            <h3 className="font-semibold">Shipping Information</h3>
            <p className="text-sm text-gray-500">Free delivery on orders over $50. Estimated delivery: 3-5 business days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail