import '../styles/profile.css'
import { getBookURL } from '../utils/bookCover'
import { parseInfo } from '../utils/bookCover';

export default function BookCarousel(props: { books, onBookClick?: (book) => void }) {
  
  return (
    <div className="book-carousel">
      {props.books.map(book => {

        const authors = parseInfo(book.authors)
        const displayAuthor = (authors[0] ?? '').replace(/^\[+|\]+$/g, '').replace(/^['"]|['"]$/g, '')
        const cacheKey = `${book.title}-${displayAuthor}`;

        return (
        <img
          key={book.book_id}
          src={getBookURL(book.title, displayAuthor)}
          data-book-key={cacheKey}
          alt={book.title}
          className="book-cover"
          onClick={() => props.onBookClick?.(book)}
        />)
      })}
    </div>
  )
}
