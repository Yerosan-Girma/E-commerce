import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const Profile = () => (
  <div className="max-w-2xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Profile</h1>
    <div className="glass-card p-6 space-y-4">
      <Input label="Full Name" defaultValue="John Doe" />
      <Input label="Email" defaultValue="john@example.com" />
      <Input label="Phone" defaultValue="+1 234 567 890" />
      <Button>Save Changes</Button>
    </div>
  </div>
)

export default Profile