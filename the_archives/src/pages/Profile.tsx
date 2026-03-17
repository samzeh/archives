import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GoHomeFill } from "react-icons/go"
import BookCarousel from '../components/BookCarousel'
import SideModal from '../components/SideModal'
import '../styles/profile.css'
import mockPfp from '../assets/mock_pfp.png'
import { useNavigate } from 'react-router-dom'
import { getBookInfo } from '../utils/profileBooks'

export default function Profile() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

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
      <div className="header">
        <h1>Sam's Library</h1>
        <div className="header-icons">
          <GoHomeFill style={{height: '65px', width: '65px', cursor: 'pointer', pointerEvents: 'all'}} onClick={goHome} />
          <img src={mockPfp} alt="Profile" className="profile-image" />
        </div>
      </div>

      <div className="section-box">
        <h1 className="section-title">Read:</h1>
        {isLoading ? <div>Loading...</div> : isError ? <div>Error loading books</div> : <BookCarousel books={finishedBooks} onBookClick={setSelectedBook} />}
      </div>

      <div className="section-box">
        <h1 className="section-title">To Be Read:</h1>
        {isLoading ? <div>Loading...</div> : isError ? <div>Error loading books</div> : <BookCarousel books={toReadBooks} onBookClick={setSelectedBook} />}
      </div>

      <SideModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </>
  )
}

