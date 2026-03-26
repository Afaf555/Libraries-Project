const API = 'http://localhost:3000/api'

export default {

    async getBooks() {
        const res = await fetch(`${API}/books`)
        return res.json()
    },

    async getBookById(id) {
        const res = await fetch(`${API}/books/${id}`)
        return res.json()
    },

    async addBook(book) {
        const res = await fetch(`${API}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        })
        return res.json()
    },

    async updateBook(id, book) {
        const res = await fetch(`${API}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        })
        return res.json()
    },

    async deleteBook(id) {
        const res = await fetch(`${API}/books/${id}`, { method: 'DELETE' })
        return res.json()
    },

    async getReservations() {
        const res = await fetch(`${API}/reservations`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        return res.json()
    },

    async reserveBook(bookId, type) {
        const res = await fetch(`${API}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ book_id: bookId, type })
        })
        return res.json()
    },

    async cancelReservation(id) {
        const res = await fetch(`${API}/reservations/${id}`, { method: 'DELETE' })
        return res.json()
    },


    async login(email, password) {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message || 'Грешка при логирање')
        }
        return res.json()
    },

    async register(name, email, password) {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.message || 'Грешка при регистрација')
        }
        return res.json()
    },

    saveSession(token, user) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    },

    getUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    getToken() {
        return localStorage.getItem('token')
    },

    isLoggedIn() {
        return !!localStorage.getItem('token')
    },

    isAdmin() {
        const user = this.getUser()
        return user?.role === 'admin'
    },

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
}