import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GoHomeFill } from "react-icons/go"
import BookCarousel from '../components/BookCarousel'
import SideModal from '../components/SideModal'
import '../styles/profile.css'
import mockPfp from '../assets/mock_pfp.png'
import { useNavigate } from 'react-router-dom'
import { getBookInfo } from '../utils/profileBooks'
import loadingGif from '../assets/loading.gif'

export default function Profile() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const queryClient = useQueryClient();

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

  return (
    <>
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
        <h1>Sam's Library</h1>
        <div className="header-icons">
          <GoHomeFill style={{height: '65px', width: '65px', cursor: 'pointer', pointerEvents: 'all'}} onClick={goHome} />
          <img src={mockPfp} alt="Profile" className="profile-image" />
        </div>
      </div>

      <div className="section-box">
        <h1 className="section-title">Read:</h1>
        {isError ? <div>Error loading books</div> : <BookCarousel books={finishedBooks} onBookClick={setSelectedBook} />}
      </div>

      <div className="section-box">
        <h1 className="section-title">To Be Read:</h1>
        {isError ? <div>Error loading books</div> : <BookCarousel books={toReadBooks} onBookClick={setSelectedBook} />}
      </div>

      <SideModal 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)}
        onBookRemoved={() => queryClient.invalidateQueries(['profileBooks'])}
      />
    </>
  )
}

