import { FiStar } from 'react-icons/fi'

interface RatingStarsProps {
  rating: number
  max?: number
  size?: number
  showValue?: boolean
  count?: number
}

export default function RatingStars({
  rating,
  max = 5,
  size = 14,
  showValue = false,
  count,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <FiStar
              size={size}
              className="text-gray-200 dark:text-gray-600"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
            {(filled || partial) && (
              <span
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: partial ? `${(rating % 1) * 100}%` : '100%' }}
              >
                <FiStar
                  size={size}
                  style={{ fill: '#F59E0B', color: '#F59E0B', minWidth: size }}
                />
              </span>
            )}
          </span>
        )
      })}
      {showValue && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  )
}
