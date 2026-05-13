<template>
  <div class="page">
    <h2>Сите книги</h2>
    <div class="divider"></div>

    <!-- SEARCH + FILTER -->
    <div class="filters-wrap">
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#b09070" stroke-width="1.5"/>
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#b09070" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
            class="search-input"
            type="text"
            v-model="query"
            placeholder="Пребарај книга, автор..."
        />
        <button class="search-btn" @click="query = ''">
          {{ query ? '✕' : 'Search' }}
        </button>
      </div>

      <select class="genre-select" v-model="selectedGenre">
        <option value="">Сите жанрови</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <p v-if="query || selectedGenre" class="results-count">
      {{ filteredBooks.length }} резултат{{ filteredBooks.length !== 1 ? 'и' : '' }}
    </p>

    <div class="divider"></div>

    <!-- BOOKS GRID -->
    <div v-if="filteredBooks.length" class="books-grid">
      <BookCard v-for="b in filteredBooks" :key="b.id" :book="b" />
    </div>

    <div v-else class="empty-state">
      <div class="icon">📖</div>
      <p>Нема книги за пребарувањето.</p>
    </div>
  </div>
</template>

<script>
import BookCard from '../components/BookCard.vue'
import BookService from '../service/BookService'

export default {
  components: { BookCard },

  data() {
    return {
      books: [],
      query: '',
      selectedGenre: '',
      genres: ['Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction',
        'Mystery', 'Romance', 'History', 'Philosophy',
        'Science', 'Biography', 'Children', 'Other']
    }
  },

  async mounted() {
    this.books = await BookService.getBooks()
  },

  computed: {
    filteredBooks() {
      return this.books.filter(b => {
        const q = this.query.toLowerCase()
        const matchQuery = !q ||
            b.title?.toLowerCase().includes(q) ||
            b.author?.toLowerCase().includes(q) ||
            b.genre?.toLowerCase().includes(q)
        const matchGenre = !this.selectedGenre || b.genre === this.selectedGenre
        return matchQuery && matchGenre
      })
    }
  }
}
</script>

<style scoped>
.filters-wrap {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 260px;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.9rem 7rem 0.9rem 3rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.97rem;
  color: #2c1a0e;
  background: white;
  border: 1.5px solid #d5c9b0;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #c9942a; }
.search-input::placeholder { color: #b09070; font-style: italic; }

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #3d3430;
  color: #fdfbf7;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 400ms;
}
.search-btn:hover { background: #5a4d3e; transform: translateY(-50%) translateY(-2px); }

.genre-select {
  padding: 0.9rem 1.2rem;
  border: 1.5px solid #d5c9b0;
  border-radius: 4px;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: #2c1a0e;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.genre-select:focus { border-color: #c9942a; }

.results-count {
  font-size: 0.85rem;
  color: #8b6b4a;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .filters-wrap { flex-direction: column; }
  .search-wrap { max-width: 100%; }
}
</style>