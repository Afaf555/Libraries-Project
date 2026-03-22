<template>
  <div class="page">
    <router-link to="/" class="back-link">← Back to Library</router-link>

    <div v-if="book" class="details-wrap">

      <!-- Cover -->
      <div class="details-cover">
        <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="cover-img"/>
        <div v-else class="cover-placeholder">
          {{ book.title.charAt(0) }}
        </div>
      </div>

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
            <option value="pickup">Pickup from Library</option>
            <option value="delivery">Home Delivery</option>
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
    this.book = await BookService.getBookById(id)
  },

  methods: {
    async reserve() {
      await BookService.reserveBook(this.book.id, this.deliveryType)
      alert(`"${this.book.title}" reserved for ${this.deliveryType === 'pickup' ? 'library pickup' : 'home delivery'}!`)
      this.$router.push('/reservations')
    }
  }
}
</script>

<style scoped>
.details-cover {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 3/4;
  box-shadow: 8px 8px 30px var(--shadow-strong);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, var(--green-dark), var(--green-mid));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
}
</style>