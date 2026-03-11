<template>
  <div class="page">
    <router-link to="/" class="back-link">← Back to Library</router-link>

    <div v-if="book" class="details-wrap">
      <div class="details-cover">📖</div>

      <div class="details-meta">
        <div>
          <span class="badge" :class="book.available ? 'available' : 'unavailable'">
            {{ book.available ? 'Available' : 'Unavailable' }}
          </span>
          <h2>{{ book.title }}</h2>
          <p class="details-author">by {{ book.author }} · {{ book.year }}</p>
        </div>

        <p class="details-description">{{ book.description }}</p>

        <div v-if="book.available" class="reserve-form">
          <label for="delivery">Delivery Method</label>
          <select id="delivery" v-model="deliveryType">
            <option value="pickup">🏛️ Pickup from Library</option>
            <option value="delivery">🏠 Home Delivery</option>
          </select>
          <button class="btn btn-gold" @click="reserve">Reserve This Book</button>
        </div>

        <p v-else style="color: var(--text-light); font-style: italic;">
          This book is currently unavailable for reservation.
        </p>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="icon">📭</div>
      <p>Book not found.</p>
    </div>
  </div>
</template>

<script>
import BookService from "../service/BookService"

export default {
  data() {
    return {
      book: null,
      deliveryType: "pickup"
    }
  },

  async mounted() {
    const id = parseInt(this.$route.params.id)
    this.book = BookService.getBookById(id)
  },

  methods: {
    reserve() {
      BookService.reserveBook(this.book, this.deliveryType)
      alert(`"${this.book.title}" reserved for ${this.deliveryType === 'pickup' ? 'library pickup' : 'home delivery'}!`)
      this.$router.push('/reservations')
    }
  }
}
</script>
