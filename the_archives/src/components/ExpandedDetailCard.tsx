import '../styles/expandeddetailpage.css'
import StarRatings from './StarRatings'
import ActionButton from './ActionButton'
import { motion } from 'motion/react'
import GenreCarousel from './GenreCarousel'
import { useEffect, useRef } from 'react'
import { getBookURL, parseInfo } from '../utils/bookCover'

interface ExpandedBookInfo {
  label?: string
  authors?: string[] | string
  average_rating?: number
  genres?: string[] | string
  description?: string
}

export default function ExpandedDetailCard(props: { onCollapse: () => void, bookInfo: ExpandedBookInfo }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (titleRef.current && props.bookInfo.label) {
      const textLength = props.bookInfo.label.length
      titleRef.current.style.setProperty('--text-length', textLength.toString())
    }
  }, [props.bookInfo.label])

  const authors = parseInfo(props.bookInfo.authors)
  const genres = parseInfo(props.bookInfo.genres)
  const displayAuthor = (authors[0] ?? '').replace(/^\[+|\]+$/g, '').replace(/^['"]|['"]$/g, '')

  const cacheKey = `${props.bookInfo.label}-${displayAuthor}`

  return (
    <motion.div className="expanded-detail-card" layoutId="book-card" onClick={props.onCollapse} transition={{ type: 'spring', stiffness: 180, damping: 26 }}>
      <div
        className="info-section"
      >
        <img 
          src={getBookURL(props.bookInfo.label ?? '', displayAuthor)}
          data-book-key={cacheKey}
          alt={`${props.bookInfo.label} cover`}
         />
        <div className="info-text">
          <h1 ref={titleRef}>{props.bookInfo.label}</h1>
          <p>{displayAuthor}</p>
          <StarRatings rating={props.bookInfo.average_rating ?? 0} />
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
