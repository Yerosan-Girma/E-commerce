import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Analytics() {
  return (
    <div>
      <div className="flex justify-between mb-6"><h1 className="text-2xl font-bold">Analytics</h1><Button variant="outline">Export Report</Button></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><h3 className="font-semibold mb-4">Revenue</h3><div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">Chart</div></Card>
        <Card><h3 className="font-semibold mb-4">Orders Trend</h3><div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">Chart</div></Card>
        <Card><h3 className="font-semibold mb-4">Top Products</h3><ul className="space-y-2">{[1, 2, 3].map(i => <li key={i} className="flex justify-between text-sm"><span>Product {i}</span><span>${100 - i * 10}</span></li>)}</ul></Card>
        <Card><h3 className="font-semibold mb-4">Category Sales</h3><div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">Pie Chart</div></Card>
      </div>
    </div>
  )
}
