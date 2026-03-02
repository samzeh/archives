import '../styles/expandeddetailpage.css'
import StarRatings from './StarRatings'
import ActionButton from './ActionButton'
import { motion } from 'motion/react'
import GenreCarousel from './GenreCarousel'

export default function ExpandedDetailCard(props: { onCollapse: () => void, bookInfo: any }) {

  const parseInfo = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map(item => String(item))
    }

    if (typeof value !== 'string') { return [] }

    try {
      const parsed = JSON.parse(value.replace(/'/g, '"'))

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item))
      } else {
        return []
      }
    } catch {
      return value
      .replace(/^\[|\]$/g, '') //remove surrounding brackets
      .split(',') //split by comma into an array
      .map((item) => item.trim() // trim white space
      .replace(/^['"]|['"]$/g, '')) // remove extra quotes
      .filter(Boolean) // remove empty values
    }
  }

  const authors = parseInfo(props.bookInfo.authors)
  const genres = parseInfo(props.bookInfo.genres)

  return (
    <motion.div className="expanded-detail-card" layoutId="book-card" onClick={props.onCollapse} transition={{ type: 'spring', stiffness: 180, damping: 26 }}>
      <div
        className="info-section"
      >
        <img src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1341952742i/15745753.jpg" />
        <div className="info-text">
          <h1>{props.bookInfo.label}</h1>
          <p>{authors[0]}</p>
          <StarRatings rating={props.bookInfo.average_rating} />
          <div className="button-container">
            <ActionButton title="to read" bgColor='#7AC970' textColor='#ffffff'/>
            <ActionButton title="finished" bgColor='#D9D9D9' textColor='#000000' />
          </div>
        </div>
      </div>
      <div><hr /></div>
      <GenreCarousel genres={genres} />
      <div className="description">
        {props.bookInfo.description}
      </div>
    </motion.div>
  )
}
