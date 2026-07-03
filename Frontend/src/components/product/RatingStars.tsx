import { FiStar } from 'react-icons/fi'

const RatingStars = ({ rating, size = 'text-sm' }: { rating: number; size?: string }) => {
  return (
    <div className={`flex items-center gap-0.5 ${size} text-yellow-500`}>
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className={i < Math.floor(rating) ? 'fill-current' : ''} />
      ))}
      <span className="text-gray-500 ml-1">({rating})</span>
    </div>
  )
}

export default RatingStars