require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const app = express()
const PORT = 3000
const JWT_SECRET = 'library_secret_key_2024'

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'libraries_db',
    user: 'saramihajlova',
    password: ''
})

// ─── NODEMAILER ───────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

// Привремено складиште за OTP кодови { email: { code, expires } }
const otpStore = {}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOTPEmail(email, code) {
    await transporter.sendMail({
        from: `"The Library" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Ваш верификациски код — The Library',
        html: `
            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 2rem; background: #f7f4ef;">
                <h2 style="color: #2c1a0e; text-align: center;">The Library</h2>
                <div style="background: white; border-radius: 8px; padding: 2rem; text-align: center; border-top: 4px solid #c9a84c;">
                    <p style="color: #6b5040; margin-bottom: 1.5rem;">Вашиот верификациски код е:</p>
                    <div style="font-size: 2.5rem; font-weight: 700; letter-spacing: 0.3em; color: #2c1a0e; background: #f5f0e8; padding: 1rem 2rem; border-radius: 8px; display: inline-block;">
                        ${code}
                    </div>
                    <p style="color: #8b6b4a; margin-top: 1.5rem; font-size: 0.9rem;">Кодот е валиден 5 минути.</p>
                </div>
            </div>
        `
    })
}

// ─── HELPER ───────────────────────────────────────────────
function getUserFromToken(req) {
    const auth = req.headers.authorization
    if (!auth) return null
    try {
        const token = auth.split(' ')[1]
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}

// ─── AUTH ─────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password)
        return res.status(400).json({ message: 'Сите полиња се задолжителни' })
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        if (existing.rows.length > 0)
            return res.status(409).json({ message: 'Корисник со тој email веќе постои' })
        const hashed = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashed, 'user']
        )
        const user = result.rows[0]

        // Испрати OTP за верификација
        const code = generateOTP()
        otpStore[email] = {
            code,
            userId: user.id,
            expires: Date.now() + 5 * 60 * 1000
        }
        await sendOTPEmail(email, code)

        res.status(201).json({ requiresOTP: true, message: 'Верификациски код испратен на вашиот email' })
    } catch (err) {
        console.error('REGISTER ERROR:', err.message)
        res.status(500).json({ message: 'Серверска грешка' })
    }
})

// Чекор 1: Логин — провери credentials и испрати OTP
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ message: 'Внесете email и лозинка' })
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0)
            return res.status(401).json({ message: 'Погрешен email или лозинка' })
        const user = result.rows[0]
        const match = await bcrypt.compare(password, user.password)
        if (!match)
            return res.status(401).json({ message: 'Погрешен email или лозинка' })

        // Генерирај и испрати OTP
        const code = generateOTP()
        otpStore[email] = {
            code,
            userId: user.id,
            expires: Date.now() + 5 * 60 * 1000 // 5 минути
        }

        await sendOTPEmail(email, code)

        res.json({ requiresOTP: true, message: 'Верификациски код испратен на вашиот email' })
    } catch (err) {
        console.error('LOGIN ERROR:', err.message)
        res.status(500).json({ message: 'Серверска грешка' })
    }
})

// Чекор 2: Верификација на OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, code } = req.body
    if (!email || !code)
        return res.status(400).json({ message: 'Внесете email и код' })

    const entry = otpStore[email]
    if (!entry)
        return res.status(401).json({ message: 'Нема активен код за овој email' })
    if (Date.now() > entry.expires) {
        delete otpStore[email]
        return res.status(401).json({ message: 'Кодот е истечен, логирајте се повторно' })
    }
    if (entry.code !== code)
        return res.status(401).json({ message: 'Погрешен код' })

    // Код е точен — генерирај токен
    delete otpStore[email]
    const result = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [entry.userId]
    )
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
})

app.get('/api/auth/profile', async (req, res) => {
    const tokenUser = getUserFromToken(req)
    if (!tokenUser) return res.status(401).json({ message: 'Неовластен пристап' })
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, street, street_number, city, country FROM users WHERE id = $1',
            [tokenUser.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: 'Серверска грешка' })
    }
})

app.put('/api/auth/profile', async (req, res) => {
    const tokenUser = getUserFromToken(req)
    if (!tokenUser) return res.status(401).json({ message: 'Неовластен пристап' })
    const { name, street, street_number, city, country } = req.body
    try {
        const result = await pool.query(
            'UPDATE users SET name=$1, street=$2, street_number=$3, city=$4, country=$5 WHERE id=$6 RETURNING id, name, email, role, street, street_number, city, country',
            [name, street, street_number, city, country, tokenUser.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: 'Серверска грешка' })
    }
})

// ─── BOOKS ────────────────────────────────────────────────

app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id ASC')
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.get('/api/books/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/books', async (req, res) => {
    const { title, author, year, description, available, cover_url, genre } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO books (title, author, year, description, available, cover_url, genre) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, author, parseInt(year), description, available ?? true, cover_url || null, genre || null]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error("ГРЕШКА ПРИ ДОДАВАЊЕ КНИГА:", err.message)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/books/:id', async (req, res) => {
    const { title, author, year, description, available, cover_url, genre } = req.body
    try {
        const result = await pool.query(
            'UPDATE books SET title=$1, author=$2, year=$3, description=$4, available=$5, cover_url=$6, genre=$7 WHERE id=$8 RETURNING *',
            [title, author, year, description, available, cover_url || null, genre || null, req.params.id]
        )
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/books/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [req.params.id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' })
        res.json({ message: 'Book deleted', book: result.rows[0] })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ─── RESERVATIONS ─────────────────────────────────────────

app.get('/api/reservations', async (req, res) => {
    const tokenUser = getUserFromToken(req)
    try {
        let result
        if (tokenUser && tokenUser.role === 'admin') {
            result = await pool.query(`
                SELECT r.id, r.type, r.created_at, r.status, r.user_id,
                       b.title as book, b.author,
                       u.name as user_name, u.email as user_email
                FROM reservations r
                JOIN books b ON r.book_id = b.id
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            `)
        } else if (tokenUser) {
            result = await pool.query(`
                SELECT r.id, r.type, r.created_at, r.status,
                       b.title as book, b.author
                FROM reservations r
                JOIN books b ON r.book_id = b.id
                WHERE r.user_id = $1
                ORDER BY r.created_at DESC
            `, [tokenUser.id])
        } else {
            return res.status(401).json({ error: 'Неовластен пристап' })
        }
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/reservations', async (req, res) => {
    const tokenUser = getUserFromToken(req)
    if (!tokenUser) return res.status(401).json({ error: 'Неовластен пристап' })
    const { book_id, type } = req.body
    try {
        await pool.query('UPDATE books SET available=false WHERE id=$1', [book_id])
        const result = await pool.query(
            'INSERT INTO reservations (book_id, type, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [book_id, type, tokenUser.id, 'pending']
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/reservations/:id', async (req, res) => {
    const tokenUser = getUserFromToken(req)
    if (!tokenUser || tokenUser.role !== 'admin')
        return res.status(403).json({ error: 'Само admin може да го менува статусот' })
    const { status } = req.body
    try {
        const result = await pool.query(
            'UPDATE reservations SET status=$1 WHERE id=$2 RETURNING *',
            [status, req.params.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/reservations/:id', async (req, res) => {
    try {
        const resRow = await pool.query('SELECT book_id FROM reservations WHERE id=$1', [req.params.id])
        if (resRow.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' })
        await pool.query('UPDATE books SET available=true WHERE id=$1', [resRow.rows[0].book_id])
        await pool.query('DELETE FROM reservations WHERE id=$1', [req.params.id])
        res.json({ message: 'Reservation cancelled' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`)
})