import { FiPlus, FiSearch } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Link } from 'react-router-dom'

const products = [
  { id:1, name:'Wireless Headphones', price:49.99, stock:23, status:'active' },
  { id:2, name:'Smart Watch', price:199.99, stock:5, status:'low' },
  { id:3, name:'USB-C Hub', price:34.99, stock:0, status:'out' },
]

const ProductManagement = () => (
  <div>
    <div className="flex justify-between mb-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <Link to="/vendor/products/add"><Button><FiPlus className="mr-2" /> Add Product</Button></Link>
    </div>
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b"><tr><th className="text-left p-3">Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3"><Badge variant={p.status==='active'?'success':p.status==='low'?'warning':'error'}>{p.status}</Badge></td>
              <td className="p-3"><button className="text-primary hover:underline">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default ProductManagement