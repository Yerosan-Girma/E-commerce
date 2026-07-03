import ProductCard from './ProductCard'

const ProductGrid = ({ products }: { products?: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products ? products.map((p) => <ProductCard key={p.id} product={p} />) : (
        Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} />)
      )}
    </div>
  )
}

export default ProductGrid