import { getCurrentUserId, getUserProfileBooks } from "../firebase/firestoreFunctions";

export async function getBookInfo(){
  const userId = getCurrentUserId()
  if (!userId) return { finishedBooks: [], toReadBooks: [] };

  const profileBooks = await getUserProfileBooks(userId);
  const bookIds = profileBooks.map(book => Number(book.book_id));
  if (bookIds.length === 0) return { finishedBooks: [], toReadBooks: [] };

  const response = await fetch('http://localhost:3000/api/books/batch', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookIds }),
  })

  if (!response.ok) return { finishedBooks: [], toReadBooks: [] };

  const { books } = await response.json();

  const mergedBooks = books.map(book => ({
    ...book, ...profileBooks.find(pb => Number(pb.book_id) === book.book_id)
  }))

  return {
    finishedBooks: mergedBooks.filter(book => book.status === 'finished'),
    toReadBooks: mergedBooks.filter(book => book.status === 'to_read'),
  }
}