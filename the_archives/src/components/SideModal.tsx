import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react'
import '../styles/profile.css'
import StarRatings from './StarRatings'
import ActionButton from './ActionButton'
import GenreCarousel from './GenreCarousel'
import { getBookURL, parseInfo } from '../utils/bookCover'
import { removeBookFromProfile, getCurrentUserId, addRating, addComment, getRating, getComment, addBookToProfile } from '../firebase/firestoreFunctions'
import { getErrorMessage } from '../utils/error';

interface BookType {
  book_id: number;
  title: string;
  authors: string;
  average_ratings: number;
  genres: string | string[];
  description: string;
  status: "to_read" | "finished";
}

export default function SideModal(props: { book: BookType | null, onClose: () => void, onBookRemoved?: () => void }) {
  const userId = getCurrentUserId();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (props.book && userId) {
      getRating(userId, props.book.book_id).then((userRating) => {
        setRating(userRating ?? 0);
      });
      getComment(userId, props.book.book_id).then((userComment) => {
        setComment(userComment ?? '');
      });
    }
  }, [props.book, userId]);

  async function handleRate(newRating: number) {
    setRating(newRating);
    if (userId && props.book) {
      await addRating(userId, String(props.book.book_id), newRating);
    }
  }

  function handleComment(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
    if (userId && props.book) {
      addComment(userId, props.book.book_id, e.target.value);
    }
  }

  const handleSwitchStatus = async (bookId: string | number | undefined) => {
    if (!userId || !props.book) return;

    const newStatus = props.book.status === 'to_read' ? 'finished' : 'to_read';

    await addBookToProfile(userId, {
      book_id: String(bookId),
      your_ratings: rating,
      comment: comment,
      status: newStatus
    });

    props.onClose();
    if (props.onBookRemoved) props.onBookRemoved();
  }

  const handleRemoveFromProfile = async (bookId: string | number | undefined) => {
    if (userId && bookId) {
      try {
        await removeBookFromProfile(userId, Number(bookId));
        props.onClose();
        if (props.onBookRemoved) props.onBookRemoved();
      } catch (e) {
        alert(getErrorMessage(e));
      }
    }
  };

  if (!props.book) return null;

  const authors = parseInfo(props.book.authors);
  const displayAuthor = (authors[0] ?? '').replace(/^\[+|\]+$/g, '').replace(/^['"]|['"]$/g, '');
  const cacheKey = `${props.book.title}-${displayAuthor}`;

  return (
    <AnimatePresence>
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
            <img
              key={props.book.book_id}
              src={getBookURL(props.book.title, displayAuthor)}
              data-book-key={cacheKey}
              alt={props.book.title} 
              className="book-modal-cover" 
              style={{ width: '100%' }}
            />
            <div className="book-info">
              <h1>{props.book.title}</h1>
              <p>{props.book.authors}</p>
              <StarRatings rating={props.book.average_ratings} />
              <div className="button-container">
                <ActionButton onClick={e => { e.stopPropagation(); handleRemoveFromProfile(props.book?.book_id); }} title="remove" bgColor='#da4021' textColor='#ffffff'/>
                <ActionButton
                  onClick={async e => {
                    e.stopPropagation();
                    handleSwitchStatus(props.book?.book_id);
                  }}
                  title={props.book.status === 'to_read' ? 'finished' : 'to read'}
                  bgColor='#D9D9D9'
                  textColor='#000000'
                />
              </div>
            </div>
          </div>
          <hr></hr>
          <GenreCarousel genres={Array.isArray(props.book.genres) ? props.book.genres : [props.book.genres]} />
          <div className="book-description">
            {props.book.description}
          </div>

          <div className="rating-section">
            <div className="rating-row">
              <h2>Your Rating</h2>
              <StarRatings rating={rating} onRate={handleRate} />
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
    </AnimatePresence>
  );
}
