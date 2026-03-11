const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = 3000

// ─── MIDDLEWARE ───
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ─── DATABASE ───
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'libraries_db',
    user: 'postgres',
    password: 'nova123'  // <-- промени го ова
})

// ─── BOOKS ───

// GET all books
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id ASC')
        res.json(result.rows)
    } catch (err) {
        console.error('DB ERROR:', err.message)  // ← додај го ова
        res.status(500).json({ error: err.message })
    }
})

// GET single book
app.get('/api/books/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST create book
app.post('/api/books', async (req, res) => {
    const { title, author, year, description, available } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO books (title, author, year, description, available) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, year, description, available ?? true]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT update book
app.put('/api/books/:id', async (req, res) => {
    const { title, author, year, description, available } = req.body
    try {
        const result = await pool.query(
            'UPDATE books SET title=$1, author=$2, year=$3, description=$4, available=$5 WHERE id=$6 RETURNING *',
            [title, author, year, description, available, req.params.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json({ message: 'Book deleted', book: result.rows[0] })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ─── RESERVATIONS ───

// GET all reservations
app.get('/api/reservations', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT r.id, r.type, r.created_at, b.title as book, b.author
      FROM reservations r
      JOIN books b ON r.book_id = b.id
      ORDER BY r.created_at DESC
    `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST create reservation
app.post('/api/reservations', async (req, res) => {
    const { book_id, type } = req.body
    try {
        // Mark book as unavailable
        await pool.query('UPDATE books SET available=false WHERE id=$1', [book_id])

        const result = await pool.query(
            'INSERT INTO reservations (book_id, type) VALUES ($1, $2) RETURNING *',
            [book_id, type]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE reservation (cancel)
app.delete('/api/reservations/:id', async (req, res) => {
    try {
        const resRow = await pool.query('SELECT book_id FROM reservations WHERE id=$1', [req.params.id])
        if (resRow.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' })

        // Mark book as available again
        await pool.query('UPDATE books SET available=true WHERE id=$1', [resRow.rows[0].book_id])
        await pool.query('DELETE FROM reservations WHERE id=$1', [req.params.id])

        res.json({ message: 'Reservation cancelled' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ─── START ───
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
})
