<template>
  <div class="card">
    <h3>{{ book.title }}</h3>
    <p class="author">{{ book.author }}</p>
    <p class="year">{{ book.year }}</p>
    <span class="badge" :class="book.available ? 'available' : 'unavailable'">
      {{ book.available ? 'Available' : 'Unavailable' }}
    </span>
    <br/>
    <router-link class="btn btn-primary" :to="'/book/' + book.id">
      View Details
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    book: Object
  }
}
</script>
