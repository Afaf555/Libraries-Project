<template>
  <div class="book-grid">
    <BookCard
        v-for="b in books"
        :key="b.id"
        :book="b"
    />
  </div>
</template>

<script>
import BookService from "../service/BookService"
import BookCard from "./BookCard.vue"

export default {
  components: { BookCard },

  data() {
    return {
      books: []
    }
  },

  async mounted() {
    this.books = await BookService.getBooks()
  }
}
</script>
