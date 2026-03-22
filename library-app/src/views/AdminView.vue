<template>
  <div class="page">
    <h2>Admin Panel</h2>
    <div class="divider"></div>

    <!-- ADD / EDIT FORM -->
    <div class="admin-form">
      <h3>{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Title *</label>
          <input v-model="form.title" type="text" placeholder="Book title" />
        </div>
        <div class="form-group">
          <label>Author *</label>
          <input v-model="form.author" type="text" placeholder="Author name" />
        </div>
        <div class="form-group">
          <label>Year</label>
          <input v-model="form.year" type="number" placeholder="e.g. 1997" />
        </div>
        <div class="form-group">
          <label>Available</label>
          <select v-model="form.available">
            <option :value="true">✅ Available</option>
            <option :value="false">❌ Unavailable</option>
          </select>
        </div>
        <div class="form-group full-width">
          <label>Cover Image URL</label>
          <input v-model="form.cover_url" type="url" placeholder="https://example.com/cover.jpg" />
          <div v-if="form.cover_url" class="cover-preview">
            <img :src="form.cover_url" alt="Cover preview" />
          </div>
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea v-model="form.description" placeholder="Book description..." rows="3"></textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-gold" @click="saveBook">
          {{ editingBook ? '💾 Save Changes' : '➕ Add Book' }}
        </button>
        <button v-if="editingBook" class="btn btn-outline" @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- BOOKS TABLE -->
    <h3 style="margin-bottom: 1rem;">All Books ({{ books.length }})</h3>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
          <th>Cover</th>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>
            <div class="table-cover">
              <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" />
              <div v-else class="table-cover-placeholder">{{ book.title.charAt(0) }}</div>
            </div>
          </td>
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.year }}</td>
          <td>
              <span class="badge" :class="book.available ? 'available' : 'unavailable'">
                {{ book.available ? 'Available' : 'Unavailable' }}
              </span>
          </td>
          <td class="actions">
            <button class="btn btn-primary" @click="startEdit(book)">✏️ Edit</button>
            <button class="btn btn-danger" @click="deleteBook(book.id)">🗑️ Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="divider"></div>

    <!-- RESERVATIONS TABLE -->
    <h3 style="margin-bottom: 1rem;">All Reservations ({{ reservations.length }})</h3>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Book</th>
          <th>User</th>
          <th>Type</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in reservations" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.book }}</td>
          <td>
            <div>{{ r.user_name }}</div>
            <div style="font-size:0.78rem;color:var(--text-light);">{{ r.user_email }}</div>
          </td>
          <td>{{ r.type === 'pickup' ? 'Pickup' : 'Delivery' }}</td>
          <td>{{ new Date(r.created_at).toLocaleDateString('mk-MK') }}</td>
          <td>
            <select class="status-select" :value="r.status" @change="updateStatus(r.id, $event.target.value)">
              <option value="pending">Во чекање</option>
              <option value="processing">Во обработка</option>
              <option value="shipped">Испратено</option>
              <option value="delivered">Доставено</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import BookService from "../service/BookService"

const API = 'http://localhost:3000/api'

export default {
  data() {
    return {
      books: [],
      reservations: [],
      editingBook: null,
      form: {
        title: '', author: '', year: '', description: '', available: true, cover_url: ''
      }
    }
  },

  async mounted() {
    await this.loadBooks()
    await this.loadReservations()
  },

  methods: {
    async loadBooks() {
      this.books = await BookService.getBooks()
    },

    async loadReservations() {
      this.reservations = await BookService.getReservations()
    },

    async saveBook() {
      if (!this.form.title || !this.form.author) {
        alert('Title and Author are required!')
        return
      }
      if (this.editingBook) {
        await BookService.updateBook(this.editingBook.id, this.form)
      } else {
        await BookService.addBook(this.form)
      }
      this.resetForm()
      await this.loadBooks()
    },

    startEdit(book) {
      this.editingBook = book
      this.form = { ...book, cover_url: book.cover_url || '' }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() { this.resetForm() },

    async deleteBook(id) {
      if (!confirm('Are you sure you want to delete this book?')) return
      await BookService.deleteBook(id)
      await this.loadBooks()
    },

    resetForm() {
      this.editingBook = null
      this.form = { title: '', author: '', year: '', description: '', available: true, cover_url: '' }
    },

    async updateStatus(id, status) {
      try {
        await fetch(`${API}/reservations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status })
        })
        await this.loadReservations()
      } catch (err) {
        console.error('Status update error:', err)
      }
    }
  }
}
</script>

<style scoped>
.cover-preview {
  margin-top: 0.8rem;
  width: 80px;
  height: 110px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid var(--parchment);
}
.cover-preview img { width: 100%; height: 100%; object-fit: cover; }

.table-cover { width: 40px; height: 55px; border-radius: 3px; overflow: hidden; }
.table-cover img { width: 100%; height: 100%; object-fit: cover; }
.table-cover-placeholder {
  width: 100%; height: 100%;
  background: var(--brown-dark);
  color: var(--gold-light);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem; font-weight: 700;
}

.status-select {
  font-family: 'Lato', sans-serif;
  font-size: 0.82rem;
  padding: 0.35rem 0.7rem;
  border: 1.5px solid var(--parchment);
  border-radius: 4px;
  background: white;
  color: var(--text-dark);
  cursor: pointer;
  transition: border-color 0.2s;
}
.status-select:focus { outline: none; border-color: var(--gold); }
</style>