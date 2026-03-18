import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GoHomeFill } from "react-icons/go"
import BookCarousel from '../components/BookCarousel'
import SideModal from '../components/SideModal'
import '../styles/profile.css'
import { useNavigate } from 'react-router-dom'
import { getBookInfo } from '../utils/profileBooks'
import loadingGif from '../assets/loading.gif'
import noBooks from '../assets/no_books.png'
import { getUsername, getCurrentUserId } from '../firebase/firestoreFunctions'
import ProfileButton from '../components/ProfileButton'
import { AnimatePresence, motion } from 'motion/react'
import { logout } from '../firebase/firestoreFunctions'


export default function Profile() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [username, setUsername] = useState('User');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const queryClient = useQueryClient();

  const profileModalRef = useRef<HTMLDivElement>(null)
  

  const {
    data: { finishedBooks = [], toReadBooks = [] } = {},
    isLoading,
    isError
  } = useQuery({
    queryKey: ['profileBooks'],
    queryFn: getBookInfo,
  });
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
  }

  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      getUsername(userId).then((username) => {
        setUsername(username)
      });
    }
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(e.target as Node)) {
        setShowProfileModal(false)
      }
    }

    if (showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileModal])

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  const displayUsername = username.length > 8 ? username.slice(0, 5) + '...' : username;

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {isLoading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#44362d', fontSize: '1.5rem', zIndex: 10,
          flexDirection: 'column',
        }}>
          <img src={loadingGif} alt="Loading..." style={{ width: 300, height: 300 }} />
          <p> loading... </p>
        </div>
      )}
      <div className="header">
        <h1>{displayUsername}'s Library</h1>
        <div className="header-icons">
          <GoHomeFill style={{height: '65px', width: '65px', cursor: 'pointer', pointerEvents: 'all'}} onClick={goHome} />
          <div ref={profileModalRef} className="profile-button-wrapper" style={{ position: 'relative', flexShrink: 0 }}>
            <ProfileButton onClick={() => setShowProfileModal((v) => !v)}/>

            <AnimatePresence>
              {showProfileModal && (
                <motion.div
                  className="profile-page-modal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.17 }}
                >
                    <p>edit</p>
                    <hr />
                    <p className="danger" onClick={handleSignOut}>log out</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>

      <div className="section-box">
        <h1 className="section-title">Finished:</h1>
        {isError ? <div>Error loading books</div> : finishedBooks.length === 0 
  ? <div className="book-carousel"><img src={noBooks} alt="No Books" className="book-cover" /></div> 
  : <BookCarousel books={finishedBooks} onBookClick={setSelectedBook} />}
      </div>

      <div className="section-box">
        <h1 className="section-title">To Be Read:</h1>
        {isError ? <div>Error loading books</div> : toReadBooks.length === 0 
  ? <div className="book-carousel"><img src={noBooks} alt="No Books" className="book-cover" /></div> 
  : <BookCarousel books={toReadBooks} onBookClick={setSelectedBook} />}
      </div>

      <div style={{ paddingBottom: '48px' }} />

      <SideModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)}
        onBookRemoved={() => queryClient.invalidateQueries(['profileBooks'])}
      />
    </div>
  )
}