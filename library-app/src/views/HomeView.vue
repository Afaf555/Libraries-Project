<template>
  <div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">Digital Library · 2024</div>
        <h1 class="hero-title">
          Your digital<br/>
          <span class="hero-accent">library.</span>
        </h1>
        <p class="hero-desc">
          Thousands of titles in one place. Reserve, read and enjoy — anytime, anywhere, effortlessly.
        </p>
        <a href="/books" class="hero-btn">Browse books →</a>

        <div class="hero-stats">
          <div class="stat">
            <div class="stat-num">500+</div>
            <div class="stat-label">Books</div>
          </div>
          <div class="stat">
            <div class="stat-num">24/7</div>
            <div class="stat-label">Access</div>
          </div>
          <div class="stat">
            <div class="stat-num">Free</div>
            <div class="stat-label">Always</div>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="book-spine"></div>
        <div class="book-spine"></div>
        <div class="book-spine"></div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="about-image">
        <img src="https://i.pinimg.com/736x/97/59/0e/97590e385852c71b4bd22a4eab1a2875.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:4px;"/>
      </div>
      <div class="about-content">
        <div class="about-tag">About Us</div>
        <h2>A place where<br/><span class="accent">books live.</span></h2>
        <p>
          Our library is open to everyone who loves to read, learn and explore. With a rich collection of over 500 titles — from classic literature to contemporary fiction — everyone will find something for themselves.
        </p>
        <p>
          Reserve a book online and pick it up at the library or have it delivered to your home.
        </p>
      </div>
    </section>

    <!-- Three Cards Section -->
    <div class="three-cards">
      <div class="card-box" style="overflow:hidden;padding:0;">
        <img src="https://i.pinimg.com/736x/3b/d6/1c/3bd61c59d0d6d9fc60e07666cd31584b.jpg" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div class="card-box" style="overflow:hidden;padding:0;">
        <img src="https://i.pinimg.com/1200x/cd/10/07/cd10078e35c7fe6d3577e7965a086c4d.jpg" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <div class="card-box" style="overflow:hidden;padding:0;">
        <img src="https://i.pinimg.com/webp70/1200x/93/1b/de/931bdeaa2646a1f322f9a3b27298d0fb.webp" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
      </div>
    </div>

    <!-- Collection Section -->
    <div class="page">
      <div class="section-header">
        <h2>The <span class="accent">Collection</span></h2>
        <a href="/books" class="link-view-all">View all →</a>
      </div>

      <div class="book-carousel">
        <div v-for="(book, i) in featuredBooks" :key="i" class="book-item">
          <div class="book-cover">
            <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title" style="width:100%;height:100%;object-fit:cover;border-radius:4px;"/>
            <div v-else class="book-initial">{{ book.initial }}</div>
          </div>
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">{{ book.author }}</p>
          <span class="book-status" :class="book.statusClass">{{ book.status }}</span>
        </div>
      </div>


      <!-- Quote Section -->
      <div class="quote-section">
        <div class="quote-icon">"</div>
        <p class="quote-text">
          A reader lives a thousand lives before he dies. The man who never reads lives only one.
        </p>
        <p class="quote-author">— George R.R. Martin</p>
      </div>

      <!-- Newsletter Section -->
      <div class="newsletter-section">
        <h3>Stay <span class="accent">informed.</span></h3>
        <p>Subscribe to our newsletter and be the first to know about new arrivals, events and reading recommendations.</p>
        <div class="newsletter-form">
          <input type="email" placeholder="your@email.com" v-model="email">
          <button @click="subscribe">Subscribe</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import BookCard from "../components/BookCard.vue"
import BookService from "../service/BookService"

export default {
  components: { BookCard },

  data() {
    return {
      books: [],
      email: '',
      featuredBooks: []
    }
  },

  async mounted() {
    const all = await BookService.getBooks()
    this.featuredBooks = all.slice(0, 6).map(b => ({
      id: b.id,
      initial: b.title.charAt(0),
      title: b.title,
      author: b.author,
      cover_url: b.cover_url,
      status: b.available ? 'AVAILABLE' : 'RESERVED',
      statusClass: b.available ? 'available' : 'reserved'
    }))
  },

  methods: {
    subscribe() {
      if (this.email) {
        alert('Subscribed: ' + this.email)
        this.email = ''
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

/* ── Hero ── */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 420px;
  background: #fdfbf7;
  padding: 60px 120px 50px;
  gap: 60px;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-badge {
  font-size: 10px;
  font-weight: 500;
  color: #9d9084;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
}

.hero-title {
  font-family: 'Cormorant', serif;
  font-size: 52px;
  font-weight: 400;
  color: #3d3430;
  line-height: 1.1;
  margin-bottom: 16px;
}

.hero-accent {
  font-style: italic;
  color: #9d9084;
}

.hero-desc {
  font-size: 14px;
  color: #7d6f5f;
  line-height: 1.8;
  max-width: 420px;
  margin-bottom: 24px;
  font-weight: 300;
}

.hero-btn {
  display: inline-block;
  width: fit-content;
  background: #3d3430;
  color: #fdfbf7;
  padding: 10px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 400ms;
  margin-bottom: 32px;
}

.hero-btn:hover {
  background: #5a4d3e;
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat { display: flex; flex-direction: column; gap: 4px; }

.stat-num {
  font-family: 'Cormorant', serif;
  font-size: 30px;
  font-weight: 400;
  color: #3d3430;
}

.stat-label {
  font-size: 10px;
  color: #9d9084;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.hero-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  padding-bottom: 0;
}

.book-spine {
  width: 50px;
  background: #ede8e0;
  border-radius: 4px;
  transition: transform 400ms;
}

.book-spine:nth-child(1) { height: 220px; }
.book-spine:nth-child(2) { height: 270px; }
.book-spine:nth-child(3) { height: 300px; }
.book-spine:hover { transform: translateY(-10px); }

/* ── About ── */
.about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 50px 60px;
  background: #f8f5f1;
}
.about-image {
  border-radius: 4px;
  overflow: hidden;
  min-height: 420px;
  max-height: 500px;
}

.about-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.about-tag {
  font-size: 10px;
  font-weight: 500;
  color: #9d9084;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.about-content h2 {
  font-family: 'Cormorant', serif;
  font-size: 36px;
  font-weight: 400;
  color: #3d3430;
  line-height: 1.2;
  margin: 0;
}

.about-content h2 .accent { font-style: italic; }

.about-content p {
  font-size: 14px;
  color: #7d6f5f;
  line-height: 1.8;
  font-weight: 300;
  max-width: 460px;
}

/* ── Three Cards ── */
.three-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 40px 60px;
  background: #fdfbf7;
}

.card-box {
  background: #ede8e0;
  border-radius: 4px;
  min-height: 200px;
  max-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms;
  cursor: pointer;
  overflow: hidden;
}

.card-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(61, 52, 48, 0.08);
}

/* ── Collection ── */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 28px;
}

.section-header h2 {
  font-family: 'Cormorant', serif;
  font-size: 36px;
  font-weight: 400;
  color: #3d3430;
  margin: 0;
}

.section-header h2 .accent { font-style: italic; }

.link-view-all {
  font-size: 12px;
  font-weight: 500;
  color: #9d9084;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 400ms;
}

.link-view-all:hover { color: #5a4d3e; }

.book-carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 16px;
  margin-bottom: 50px;
  scrollbar-width: none;
}

.book-carousel::-webkit-scrollbar { display: none; }

.book-item {
  flex-shrink: 0;
  width: 200px;
}

.book-cover {
  width: 100%;
  aspect-ratio: 3/4;
  background: #ede8e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: transform 400ms;
  overflow: hidden;
}

.book-item:hover .book-cover { transform: translateY(-6px); }

.book-initial {
  font-family: 'Cormorant', serif;
  font-size: 96px;
  font-weight: 300;
  font-style: italic;
  color: rgba(61, 52, 48, 0.15);
}

.book-title {
  font-size: 13px;
  font-weight: 500;
  color: #3d3430;
  margin-bottom: 4px;
}

.book-author {
  font-size: 11px;
  color: #9d9084;
  margin-bottom: 6px;
  font-weight: 300;
}

.book-status {
  font-size: 9px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
}

.book-status.available { background: rgba(159,174,143,0.15); color: #7a8c67; }
.book-status.reserved { background: rgba(212,185,150,0.15); color: #c9a88f; }

/* ── Features ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
  margin-bottom: 50px;
}

.feature { text-align: center; }

.feature-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.feature h3 {
  font-family: 'Cormorant', serif;
  font-size: 20px;
  font-weight: 400;
  color: #3d3430;
  margin-bottom: 8px;
}

.feature p {
  font-size: 13px;
  color: #7d6f5f;
  line-height: 1.7;
  font-weight: 300;
}

/* ── Quote ── */
.quote-section {
  background: #f3efe9;
  padding: 40px 60px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 50px;
  position: relative;
}

.quote-icon {
  font-family: 'Cormorant', serif;
  font-size: 90px;
  color: rgba(61,52,48,0.07);
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.quote-text {
  font-family: 'Cormorant', serif;
  font-size: 22px;
  font-weight: 300;
  font-style: italic;
  color: #5a4d3e;
  line-height: 1.6;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.quote-author {
  font-size: 10px;
  color: #9d9084;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

/* ── Newsletter ── */
.newsletter-section {
  text-align: center;
  max-width: 560px;
  margin: 0 auto 0;
  padding: 0 40px 0;
}

.newsletter-section h3 {
  font-family: 'Cormorant', serif;
  font-size: 28px;
  font-weight: 400;
  color: #3d3430;
  margin-bottom: 10px;
}

.newsletter-section h3 .accent { font-style: italic; }

.newsletter-section p {
  font-size: 13px;
  color: #7d6f5f;
  line-height: 1.8;
  margin-bottom: 20px;
  font-weight: 300;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  max-width: 440px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e3dcd1;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
  background: #f8f5f1;
  color: #3d3430;
  outline: none;
  transition: all 400ms;
}

.newsletter-form input::placeholder { color: #bfb5a9; font-style: italic; }
.newsletter-form input:focus { border-color: #c9bfb3; background: #fdfbf7; }

.newsletter-form button {
  padding: 10px 24px;
  background: #3d3430;
  color: #fdfbf7;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 400ms;
}

.newsletter-form button:hover { background: #5a4d3e; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; padding: 50px 24px 40px; }
  .hero-title { font-size: 40px; }
  .hero-visual { display: none; }
  .about-section { grid-template-columns: 1fr; padding: 40px 24px; }
  .three-cards { grid-template-columns: 1fr; padding: 40px 24px; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>