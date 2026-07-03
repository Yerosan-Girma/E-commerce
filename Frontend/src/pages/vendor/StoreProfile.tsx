import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const StoreProfile = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-bold mb-6">Store Profile</h1>
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">S</div>
        <Button variant="outline">Upload Logo</Button>
      </div>
      <Input label="Store Name" defaultValue="TechGear" />
      <Input label="Description" defaultValue="Premium electronics store." />
      <Input label="Business Hours" defaultValue="Mon-Fri 9am-6pm" />
      <Button>Save</Button>
    </div>
  </div>
)

export default StoreProfile