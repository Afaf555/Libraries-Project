<template>
  <div class="book-card">
    <div class="card-cover-wrapper">
      <div class="card-cover">
        <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" class="cover-img"/>
        <div v-else class="cover-placeholder">
          <span class="placeholder-letter">{{ book.title.charAt(0) }}</span>
        </div>
        <div class="cover-overlay">
          <div class="overlay-content">
            <span class="quick-view">View Details</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
      <span class="status-badge" :class="book.available ? 'available' : 'unavailable'">
        <span class="badge-dot"></span>
        {{ book.available ? 'Available' : 'Reserved' }}
      </span>
    </div>

    <div class="card-body">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">by {{ book.author }}</p>
      <div class="book-meta">
        <span class="book-year">{{ book.year }}</span>
      </div>

      <router-link class="card-link" :to="'/book/' + book.id">
        <span>Read More</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
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
.book-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(44, 26, 14, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 200px;
  max-width: 220px;
}

.book-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #c9a84c, #e8c97a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(44, 26, 14, 0.16),
  0 8px 16px rgba(44, 26, 14, 0.08);
}

.book-card:hover::before {
  transform: scaleX(1);
}

.card-cover-wrapper {
  position: relative;
}

.card-cover {
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  position: relative;
  background: linear-gradient(145deg, #2c1a0e, #3d2616);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card:hover .cover-img {
  transform: scale(1.08);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #2c1a0e 0%, #4a3520 50%, #2c1a0e 100%);
  background-size: 200% 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(201, 168, 76, 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.book-card:hover .cover-placeholder::before {
  opacity: 1;
}

.placeholder-letter {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 4rem;
  font-weight: 700;
  color: #c9a84c;
  text-shadow: 0 2px 20px rgba(201, 168, 76, 0.3);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.book-card:hover .placeholder-letter {
  transform: scale(1.1) rotate(-5deg);
  color: #e8c97a;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
  rgba(44, 26, 14, 0) 0%,
  rgba(44, 26, 14, 0.5) 60%,
  rgba(44, 26, 14, 0.85) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1.2rem;
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card:hover .cover-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f0ead6;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transform: translateY(10px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.05s;
}

.book-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-content svg {
  transition: transform 0.3s ease;
}

.book-card:hover .overlay-content svg {
  transform: translateX(3px);
}

.status-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  backdrop-filter: blur(12px);
  z-index: 2;
  transition: all 0.3s ease;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.status-badge.available {
  background: rgba(230, 244, 237, 0.95);
  color: #1a6b3f;
  border: 1px solid rgba(26, 107, 63, 0.2);
}

.status-badge.available .badge-dot {
  background: #1a6b3f;
}

.status-badge.unavailable {
  background: rgba(250, 234, 234, 0.95);
  color: #b03030;
  border: 1px solid rgba(176, 48, 48, 0.2);
}

.status-badge.unavailable .badge-dot {
  background: #b03030;
}

.card-body {
  padding: 1.2rem 1.1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  background: white;
}

.book-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2c1a0e;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.book-card:hover .book-title {
  color: #c9a84c;
}

.book-author {
  font-size: 0.82rem;
  color: #8b6b4a;
  font-style: italic;
  margin: 0 0 0.3rem 0;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.2rem;
  padding-top: 0.6rem;
  border-top: 1px solid #f0ead6;
}

.book-year {
  font-size: 0.72rem;
  color: #a08060;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c9a84c;
  text-decoration: none;
  margin-top: auto;
  padding-top: 0.8rem;
  transition: all 0.3s ease;
}

.card-link svg {
  transition: transform 0.3s ease;
}

.card-link:hover {
  color: #2c1a0e;
}

.card-link:hover svg {
  transform: translateX(4px);
}
</style>