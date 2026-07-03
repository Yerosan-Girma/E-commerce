const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
)

export const ProductCardSkeleton = () => (
  <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-2xl">
    <Skeleton className="h-40 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <Skeleton className="h-8 w-full" />
  </div>
)

export default Skeleton