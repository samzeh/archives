import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import '../styles/profile.css'
import StarRatings from './StarRatings'
import ActionButton from './ActionButton'
import GenreCarousel from './GenreCarousel'

type Book = { id: number, cover: string }

export default function SideModal(props: { book: Book | null, onClose: () => void }) {
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!props.book) return
    const saved = localStorage.getItem(`book-${props.book.id}`)
    if (saved) {
      const { rating, comment } = JSON.parse(saved)
      setUserRating(rating ?? 0)
      setComment(comment ?? '')
    } else {
      setUserRating(0)
      setComment('')
    }
  }, [props.book?.id])

  function handleRate(rating: number) {
    setUserRating(rating)
    if (!props.book) return
    const existing = JSON.parse(localStorage.getItem(`book-${props.book.id}`) ?? '{}')
    localStorage.setItem(`book-${props.book.id}`, JSON.stringify({ ...existing, rating }))
  }

  function handleComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value)
    if (!props.book) return
    const existing = JSON.parse(localStorage.getItem(`book-${props.book.id}`) ?? '{}')
    localStorage.setItem(`book-${props.book.id}`, JSON.stringify({ ...existing, comment: e.target.value }))
  }
  
  return (
    <AnimatePresence>
      {props.book && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={props.onClose}
          />
          <motion.div
            className="book-modal"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="book-info-container">
              <img src={props.book.cover} className="book-modal-cover" />
              <div className="book-info">
                <h1>Dune</h1>
                <p>Frank Herbert</p>
                <StarRatings rating={4} />
                <div className="button-container">
                  <ActionButton title="remove" bgColor='#da4021' textColor='#ffffff'/>
                  <ActionButton title="to read" bgColor='#D9D9D9' textColor='#000000' />
                </div>
              </div>
            </div>
            <hr></hr>
            <GenreCarousel genres={['Fiction', 'Coming of Age', 'Drama', 'Fiction', 'Coming of Age', 'Drama', 'Fiction', 'Coming of Age', 'Drama']} />
            <div className="book-description">
              standing on the fringes of life offers a unique perspective. But there comes a time to see what it looks like from the dance floor. This haunting novel about the dilemma of passivity vs. passion marks the stunning debut of a provocative new voice in contemporary fiction: The Perks of Being A WALLFLOWER...         standing on the fringes of life offers a unique perspective. But there comes a time to see what it looks like from the dance floor. This haunting novel about the dilemma of passivity vs. passion marks the stunning debut of a provocative new voice in contemporary fiction: The Perks of Being A WALLFLOWER...
            </div>

            <div className="rating-section">
              <div className="rating-row">
                <h2>Your Rating</h2>
                <StarRatings rating={userRating} onRate={handleRate} />
              </div>
              <div className="review-bar">
                <textarea
                  className="review-input"
                  placeholder="comments..."
                  value={comment}
                  onChange={handleComment}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
