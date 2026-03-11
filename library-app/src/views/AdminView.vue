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
          <label>Description</label>
          <textarea v-model="form.description" placeholder="Book description..." rows="3"></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-gold" @click="saveBook">
          {{ editingBook ? '💾 Save Changes' : '➕ Add Book' }}
        </button>
        <button v-if="editingBook" class="btn btn-outline" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- BOOKS TABLE -->
    <h3 style="margin-bottom: 1rem;">All Books ({{ books.length }})</h3>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
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

  </div>
</template>

<script>
import BookService from "../service/BookService"

export default {
  data() {
    return {
      books: [],
      editingBook: null,
      form: {
        title: '',
        author: '',
        year: '',
        description: '',
        available: true
      }
    }
  },

  async mounted() {
    await this.loadBooks()
  },

  methods: {
    async loadBooks() {
      this.books = await BookService.getBooks()
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
      this.form = { ...book }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() {
      this.resetForm()
    },

    async deleteBook(id) {
      if (!confirm('Are you sure you want to delete this book?')) return
      await BookService.deleteBook(id)
      await this.loadBooks()
    },

    resetForm() {
      this.editingBook = null
      this.form = { title: '', author: '', year: '', description: '', available: true }
    }
  }
}
</script>
