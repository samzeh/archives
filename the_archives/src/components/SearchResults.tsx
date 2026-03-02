import React, { useState } from 'react'
import { motion } from 'motion/react'

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
export default function SearchResults(props: { results: Book[], handleSearch: (id: number) => void }) {
  const orderedResults = [...props.results].reverse()
  const hasResults = props.results && props.results.length > 0
  const cleanAuthorText = (value: string) => value.replace(/\[|\]|"|'/g, '').trim()

  return (
    <motion.div
      className="search-results-box"
      initial={{ opacity: 0, paddingTop: 0, paddingBottom: 0 }}
      animate={{ opacity: 1, paddingTop: 12, paddingBottom: 12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      {hasResults ? (orderedResults.map((result, index) => {
        const delay = (orderedResults.length - 1 - index) * 0.17

        return (
          <React.Fragment key={result.book_id}>
            <motion.div
              initial={{ opacity: 0, y: 16, height: 0, marginTop: 0, marginBottom: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 5, marginBottom: 5 }}
              transition={{ duration: 0.5, delay, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="search-result-card" onClick={() => props.handleSearch(result.book_id)}>
                <img src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1341952742i/15745753.jpg" alt={`${result.title} cover`} className="search-result-cover" />
                <div className="search-result-info">
                  <h1>{result.title}</h1>
                  <p>{cleanAuthorText(result.authors)}</p>
                </div>
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