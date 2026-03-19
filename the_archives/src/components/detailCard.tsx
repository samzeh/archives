import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { getBookURL, parseInfo } from '../utils/bookCover'
import StarRatings from './StarRatings'
import '../styles/detailpage.css'


interface DetailBookInfo {
  label?: string
  authors?: string  
  average_rating?: number
  book_id?: number
  description?: string
  genres?: string
}

export default function DetailCard(props: { onExpand: () => void, bookInfo: DetailBookInfo } ) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  

  const author = parseInfo(props.bookInfo.authors)
  const displayAuthor = (author[0] ?? '').replace(/^\[+|\]+$/g, '').replace(/^['"]|['"]$/g, '')
  const cacheKey = `${props.bookInfo.label}-${displayAuthor}`

  useEffect(() => {
    if (titleRef.current && props.bookInfo.label) {
      const textLength = props.bookInfo.label.length
      titleRef.current.style.setProperty('--text-length', textLength.toString())
    }
  }, [props.bookInfo.label])

  return (
    <motion.div className="detail-card-container" onClick={props.onExpand}>
      <motion.div className="detail-card" layoutId="book-card" transition={{ type: 'spring', stiffness: 180, damping: 26 }}>
        <motion.div
          className="detail-card-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.152, duration: 0.23250 } }}
          exit={{ opacity: 0, transition: { duration: 0.13 } }}
        >
          <h1 ref={titleRef} className="book-title">{props.bookInfo.label}</h1>
          <StarRatings rating={props.bookInfo.average_rating ?? 0} />
        </motion.div>
        <img
          className="detail-card-left"
          src={getBookURL(props.bookInfo.label ?? '', displayAuthor)}
          data-book-key={cacheKey}
          alt={`${props.bookInfo.label} cover`}
        />
        <p className="bottom-text">click to see more</p>
      </motion.div>
    </motion.div>
  )
}
