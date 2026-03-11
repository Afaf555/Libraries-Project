<template>
  <div class="page">
    <h1>The <span>Library</span></h1>
    <p class="subtitle">Discover, reserve, and enjoy great books.</p>
    <div class="divider"></div>
    <BookList/>
  </div>
</template>

<script>
import BookList from "../components/BookList.vue"

export default {
  components: { BookList }
}
</script>
