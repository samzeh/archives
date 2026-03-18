import '../styles/expandeddetailpage.css'
import StarRatings from './StarRatings'
import ActionButton from './ActionButton'
import { motion } from 'motion/react'
import GenreCarousel from './GenreCarousel'
import { useEffect, useRef, useState } from 'react'
import { getBookURL, parseInfo } from '../utils/bookCover'
import { addBookToProfile, getCurrentUserId } from '../firebase/firestoreFunctions'
import type { ProfileBook } from '../type/books'

interface ExpandedBookInfo {
  id?: number
  book_id?: number
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

  const [addStatus, setAddStatus] = useState<string | null>(null);

  useEffect(() => {
    if (addStatus) {
      const timeout = setTimeout(() => setAddStatus(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [addStatus]);

  const handleAddToProfile = async (book: ProfileBook) => {
    const userId = getCurrentUserId();
    if (!userId) {
      setAddStatus('You must be logged in to add books.');
      return;
    }
    setAddStatus(null);
    try {
      await addBookToProfile(userId, book);
      setAddStatus('Book added to your profile!');
    } catch (err) {
      setAddStatus('Failed to add book.');
      console.error('Add to profile error:', err);
    }
  }

  const isGuest = localStorage.getItem('guest') === 'true'

  return (
    <motion.div className="expanded-detail-card" layoutId="book-card" onClick={props.onCollapse} transition={{ type: 'spring', stiffness: 180, damping: 26 }}>
      <div className="info-section">
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
            <ActionButton   
              onClick={(e) => {
                e.stopPropagation();
                if (isGuest) return;
                handleAddToProfile({ book_id: String(props.bookInfo.book_id), your_ratings: 0, comment: '', status: "to_read" });
              }} 
              title="to read" 
              bgColor='#7AC970' 
              textColor='#ffffff'
              disabled={isGuest}
            />
            <ActionButton 
              onClick={(e) => {
                e.stopPropagation();
                if (isGuest) return;
                handleAddToProfile({ book_id: String(props.bookInfo.book_id), your_ratings: 0, comment: '', status: "finished" });
              }} 
              title="finished" 
              bgColor='#D9D9D9' 
              textColor='#000000' 
              disabled={isGuest}
            />
          </div>
          {addStatus && (
            <div style={{ color: addStatus.includes('added') ? 'green' : 'red', marginTop: 8, fontSize: '0.95em' }}>{addStatus}</div>
          )}
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
