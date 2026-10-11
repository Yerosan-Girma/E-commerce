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
  size = 13,
  showValue = false,
  count,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        const pct = partial ? (rating % 1) * 100 : 0

        return (
          <span
            key={i}
            className="relative inline-flex"
            style={{ width: size, height: size }}
          >
            {/* Empty star */}
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              className="absolute inset-0 text-gray-200 dark:text-gray-600"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* Filled star (full or partial) */}
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${pct}%` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={size}
                  height={size}
                  fill="#F59E0B"
                  style={{ minWidth: size }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            )}
          </span>
        )
      })}

      {showValue && (
        <span className="text-xs font-semibold text-gray-500 dark:text-surface-400 ml-0.5">
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="font-normal text-gray-400 dark:text-surface-500">
              {' '}({count})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
