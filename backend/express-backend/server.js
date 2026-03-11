import express from 'express';
import pool from './db.js';

const app = express();

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

app.listen(3000);