import Card from '../../components/ui/Card'
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers } from 'react-icons/fi'

const VendorDashboard = () => {
  const stats = [
    { icon: FiDollarSign, label: 'Revenue', value: '$12,450', color: 'text-success' },
    { icon: FiShoppingBag, label: 'Orders', value: '156', color: 'text-primary' },
    { icon: FiPackage, label: 'Products', value: '48', color: 'text-secondary' },
    { icon: FiUsers, label: 'Customers', value: '234', color: 'text-accent' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Card key={stat.label} hover={false}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${stat.color}`}><stat.icon /></div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><h3 className="font-semibold mb-4">Revenue Chart</h3><div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">Chart placeholder</div></Card>
        <Card><h3 className="font-semibold mb-4">Recent Orders</h3><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="flex justify-between text-sm"><span>Order #12{i}</span><span className="text-primary">$89.97</span></div>)}</div></Card>
      </div>
    </div>
  )
}

export default VendorDashboard