import express from 'express';
import pool from './db.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

app.get('/api/books/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const result = await pool.query( 
      "SELECT * FROM books WHERE title % $1 OR title ILIKE '%' || $1 || '%' ORDER BY similarity(title, $1) DESC LIMIT $2", 
      [q, 5]);

    res.json({ books: result.rows });


  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/books/batch', async (req, res) => {
  try {
    const { bookIds } = req.body;
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ error: 'bookIds must be a non-empty array' });
    }

    const placeholders = bookIds.map((_, i) => `$${i + 1}`).join(',');
    const query = `SELECT book_id, title, authors, average_ratings, description, genres FROM books WHERE book_id IN (${placeholders})`;
    const result = await pool.query(query, bookIds);

    res.json({ books: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000);