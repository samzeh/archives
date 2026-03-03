import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { getBookURL, parseInfo } from '../utils/bookCover'

export interface Book {
  book_id: number;
  title: string;
  authors: string;
  average_ratings: string;
  description: string;
  genres: string[];
  pages: number;
  publication_year: number;
}
export default function SearchResults(props: { results: Book[], handleSearch: (id: number) => void, isVisible: () => void }) {
  const orderedResults = [...props.results].reverse()
  const hasResults = props.results && props.results.length > 0
  const [selectedIndex, setSelectedIndex] = useState(orderedResults.length-1)

  const handleSelectionChange = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => prev-1 >= 0? prev-1 : prev)
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => prev+1 <= orderedResults.length-1 ? prev+1 : prev)
    } else if (e.key === 'Enter') {
      const selectedResult = orderedResults[selectedIndex].book_id
      props.handleSearch(selectedResult)
    }
  }

  const handleClick = (result: Book) => {
    setSelectedIndex(orderedResults.findIndex(r => r.book_id === result.book_id))
    props.handleSearch(result.book_id)
  }

  useEffect(() => {
    addEventListener('keydown', handleSelectionChange)

    return () => removeEventListener('keydown', handleSelectionChange)
  }, [handleSelectionChange])

  return (
    <motion.div
      className="search-results-box"
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      {hasResults ? (orderedResults.map((result, index) => {
        const delay = (orderedResults.length - 1 - index) * 0.17
        const isSelected = index === selectedIndex

        const isFirst = orderedResults.length === 1 ? index == 0 : index === orderedResults.length - 1
        const isLast = orderedResults.length === 1 ? index == 0 :index === 0

        const authors = parseInfo(result.authors)
        const author = (authors[0] ?? '').replace(/^\[+|\]+$/g, '').replace(/^['"]|['"]$/g, '')

        const cacheKey = `${result.title}-${author}`

        


        return (
          <React.Fragment key={result.book_id}>
            <motion.div
              className="search-result-wrapper"
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.5, delay, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              {isSelected && (<div className="search-result-overlay" /> )}

              <div 
                className={`search-result-card ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`} 
                tabIndex={0} 
                onClick={() => handleClick(result)} 
                onKeyDown={handleSelectionChange}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <img 
                  src={getBookURL(result.title, author)} 
                  data-book-key={cacheKey}
                  alt={`${result.title} cover`} 
                  className="search-result-cover" 
                />
                <div className="search-result-info">
                  <h1>{result.title}</h1>
                  <p>{author}</p>
                </div>

                {isSelected && <span className="search-result-arrow">↵</span>}
              </div>
            </motion.div>

            {index !== orderedResults.length - 1 && (
              <motion.hr
                className="search-result-divider"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.35, delay: delay + 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: 'center' }}
              />
            )}
          </React.Fragment>
        )
      })) : (
        <motion.div
          initial={{ opacity: 0, y: 16, height: 0, marginTop: 0, marginBottom: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 5, marginBottom: 5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div className="search-result-card">
            <div className="search-result-info">
              <h1>no results found</h1>
            </div>
          </div>
        </motion.div>
      )}
      
    </motion.div>
  )
}