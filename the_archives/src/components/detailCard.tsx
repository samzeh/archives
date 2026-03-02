import '../styles/detailpage.css'
import StarRatings from './StarRatings'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

interface DetailBookInfo {
  label?: string
  average_rating?: number
}

export default function DetailCard(props: { onExpand: () => void, bookInfo: DetailBookInfo } ) {
  const titleRef = useRef<HTMLHeadingElement>(null)

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
          animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <h1 ref={titleRef} className="book-title">{props.bookInfo.label}</h1>
          <StarRatings rating={props.bookInfo.average_rating ?? 0} />
        </motion.div>
        <img
          className="detail-card-left"
          src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1341952742i/15745753.jpg"
        />
        <p className="bottom-text">click to see more</p>
      </motion.div>
    </motion.div>
  )
}
