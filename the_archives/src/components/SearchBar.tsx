import { useEffect, useState, useRef } from 'react'
import '../styles/footer.css'
import { BsSearch } from "react-icons/bs";
import SearchResults from './SearchResults';
import { useQuery } from '@tanstack/react-query';

const searchBooks = async(search_query: string) => {
  const response = await fetch(`/api/books/search?q=${encodeURIComponent(search_query)}`)
  return response.json()
}

export default function SearchBar(props: { handleSearch: (id: number) => void }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isResultsVisible, setIsResultsVisible] = useState(true)
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  const handleSearchWithClear = (id: number) => {
    props.handleSearch(id)
    setQuery('')
    setDebouncedQuery('')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(()=> {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])


  const { data: searchResults } = useQuery({
    queryKey: ["search_results", debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    refetchOnWindowFocus: false,
  })
  

  return (
    <div className="search-bar-wrapper" ref={searchWrapperRef}>
      {query && searchResults?.books && isResultsVisible &&(
        <SearchResults handleSearch={handleSearchWithClear} results={searchResults.books} isVisible={() => setIsResultsVisible(false)}/>
      )}
      <div className="search-bar">
        <BsSearch style={{ color: '#847058', flexShrink: 0 }} />
        <input 
          className="search-input" 
          placeholder="Search for book title..." 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsResultsVisible(true) }}
          onFocus={() => setIsResultsVisible(true)}
        />
      </div>
    </div>
  )
}

