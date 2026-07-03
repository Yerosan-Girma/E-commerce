import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const AddProduct = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
    <div className="glass-card p-6 space-y-4">
      <div className="border-2 border-dashed rounded-xl p-8 text-center text-gray-400 cursor-pointer hover:border-primary">Upload Images</div>
      <Input label="Title" />
      <Input label="Description" />
      <div className="grid grid-cols-2 gap-4"><Input label="Price" type="number" /><Input label="Stock" type="number" /></div>
      <Input label="Brand" />
      <Input label="Category" />
      <Button className="w-full">Create Product</Button>
    </div>
  </div>
)

export default AddProduct