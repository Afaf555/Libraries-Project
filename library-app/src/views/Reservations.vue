<template>
  <div class="page">
    <h2>My Reservations</h2>
    <div class="divider"></div>

    <div v-if="reservations.length" class="reservation-list">
      <div class="reservation-item" v-for="r in reservations" :key="r.id">

        <div class="reservation-info">
          <span class="book-title">{{ r.book }}</span>
          <span class="book-author">{{ r.author }}</span>
          <span class="reservation-date">
            {{ new Date(r.created_at).toLocaleDateString('mk-MK', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </span>
        </div>

        <div class="reservation-right">
          <span class="delivery-type">
            {{ r.type === 'pickup' ? 'Pickup' : 'Home Delivery' }}
          </span>
          <button class="btn btn-danger" @click="cancel(r.id)">Cancel</button>
        </div>

      </div>
    </div>

    <div v-else class="empty-state">
      <div class="icon">📋</div>
      <p>No reservations yet. Browse the library and reserve a book!</p>
      <br/>
      <router-link class="btn btn-primary" to="/">Browse Books</router-link>
    </div>
  </div>
</template>

<script>
import BookService from "../service/BookService"

export default {
  data() {
    return {
      reservations: []
    }
  },

  async mounted() {
    this.reservations = await BookService.getReservations()
  },

  methods: {
    async cancel(id) {
      if (!confirm('Are you sure you want to cancel this reservation?')) return
      await BookService.cancelReservation(id)
      this.reservations = await BookService.getReservations()
    }
  }
}
</script>

<style scoped>
.reservation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.reservation-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.book-author {
  font-size: 0.88rem;
  color: var(--text-light);
  font-style: italic;
}

.reservation-date {
  font-size: 0.78rem;
  color: var(--text-light);
  letter-spacing: 0.03em;
}

.reservation-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
</style>