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
        const res = await fetch(`${API}/reservations`)
        return res.json()
    },

    async reserveBook(bookId, type) {
        const res = await fetch(`${API}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: bookId, type })
        })
        return res.json()
    },

    async cancelReservation(id) {
        const res = await fetch(`${API}/reservations/${id}`, { method: 'DELETE' })
        return res.json()
    }

}
