<template>
  <div class="page">
    <h2>My Reservations</h2>
    <div class="divider"></div>

    <div v-if="reservations.length" class="reservation-list">
      <div class="reservation-item" v-for="(r, i) in reservations" :key="i">
        <span class="book-title">{{ r.book }}</span>
        <span class="delivery-type">
          {{ r.type === 'pickup' ? '🏛️ Pickup' : '🏠 Delivery' }}
        </span>
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
    this.reservations = BookService.getReservations()
  }
}
</script>
