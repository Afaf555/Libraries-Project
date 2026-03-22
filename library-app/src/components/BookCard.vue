<template>
  <div class="card">
    <!-- Cover image -->
    <div class="card-cover">
      <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="cover-img"/>
      <div v-else class="cover-placeholder">
        <span>{{ book.title.charAt(0) }}</span>
      </div>
    </div>

    <div class="card-body">
      <h3>{{ book.title }}</h3>
      <p class="author">{{ book.author }}</p>
      <p class="year">{{ book.year }}</p>
      <span class="badge" :class="book.available ? 'available' : 'unavailable'">
        {{ book.available ? 'Available' : 'Unavailable' }}
      </span>
      <router-link class="btn btn-primary" :to="'/book/' + book.id">
        View Details
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    book: Object
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  min-width: 180px;
  max-width: 200px;
  width: 200px;
}

.card-cover {
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, var(--brown-dark), var(--brown-mid));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--gold-light);
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.card-body h3 {
  font-size: 0.95rem;
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-body .author {
  font-size: 0.82rem;
  margin-bottom: 0;
}

.card-body .year {
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
}

.card-body .btn {
  margin-top: auto;
  text-align: center;
  font-size: 0.78rem;
  padding: 0.45rem 0.8rem;
}
</style>