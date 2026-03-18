import StarIcon from '../assets/star.svg?react';
import '../styles/ratings.css'

export default function StarRatings(props: { rating: number, onRate?: (rating: number) => void }) {

  const stars = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="star-rating-box">
      {stars.map((star) => (
        <StarIcon
          className="star"
          key={star}
          style={{
            color: star < props.rating ? '#FFD900' : '#959595',
            cursor: props.onRate ? 'pointer' : 'default',
          }}
          onClick={() => props.onRate?.(star + 1)}
        />
      ))}
    </div>
  )
}

