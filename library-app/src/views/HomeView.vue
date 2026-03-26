<template>
  <div>

    <section class="hero">
      <div class="hero-bg">
        <div class="hero-circle c1"></div>
        <div class="hero-circle c2"></div>
        <div class="hero-circle c3"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">Добредојдовте</div>
        <h1 class="hero-title">
          Вашата дигитална<br/>
          <span class="hero-accent">библиотека</span>
        </h1>
        <p class="hero-desc">
          Илјадници книги на едно место. Резервирајте, читајте и уживајте — онлајн, секогаш.
        </p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">500+</span>
            <span class="stat-label">Книги</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">24/7</span>
            <span class="stat-label">Достапност</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">100%</span>
            <span class="stat-label">Бесплатно</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="shelf">
          <div class="row row-back">
            <div class="b" style="--w:18px;--h:80px;--c:#b5a48a;"></div>
            <div class="b" style="--w:14px;--h:65px;--c:#8c7b6b;"></div>
            <div class="b" style="--w:20px;--h:88px;--c:#a09080;"></div>
            <div class="b" style="--w:16px;--h:72px;--c:#7a6a5a;"></div>
            <div class="b" style="--w:18px;--h:82px;--c:#b0a090;"></div>
            <div class="b" style="--w:14px;--h:68px;--c:#908070;"></div>
            <div class="b" style="--w:20px;--h:76px;--c:#c4b49a;"></div>
            <div class="b" style="--w:16px;--h:84px;--c:#807060;"></div>
          </div>
          <div class="plank" style="width:260px;"></div>
          <div class="row row-front">
            <div class="b" style="--w:22px;--h:118px;--c:#c9a84c;"></div>
            <div class="b" style="--w:16px;--h:98px; --c:#d4c5a9;"></div>
            <div class="b" style="--w:20px;--h:128px;--c:#e8e0d0;"></div>
            <div class="b" style="--w:14px;--h:105px;--c:#b8a88a;"></div>
            <div class="b" style="--w:24px;--h:115px;--c:#c9a84c;opacity:0.6;"></div>
            <div class="b" style="--w:18px;--h:122px;--c:#f0ead6;"></div>
            <div class="b" style="--w:16px;--h:96px; --c:#d0c0a0;"></div>
            <div class="b" style="--w:22px;--h:130px;--c:#e0d4bc;"></div>
            <div class="b" style="--w:14px;--h:108px;--c:#c8b898;"></div>
            <div class="b" style="--w:20px;--h:112px;--c:#c9a84c;opacity:0.8;"></div>
          </div>
          <div class="plank" style="width:290px;"></div>
        </div>
      </div>
    </section>

    <div class="page">
      <h1>The <span>Library</span></h1>
      <p class="subtitle">Discover, reserve, and enjoy great books.</p>

      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="#b09070" stroke-width="1.5"/>
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#b09070" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
            class="search-input"
            type="text"
            v-model="query"
            placeholder="Пребарај книга, автор..."
        />
        <button class="search-btn" @click="query = ''">
          {{ query ? '✕' : 'Search' }}
        </button>
      </div>

      <div class="search-hints">
        <span
            v-for="hint in hints"
            :key="hint"
            class="hint"
            :class="{ active: query === hint }"
            @click="query = query === hint ? '' : hint"
        >{{ hint }}</span>
      </div>

      <div class="divider"></div>

      <p v-if="query" class="results-count">
        {{ filteredBooks.length }} резултат{{ filteredBooks.length !== 1 ? 'и' : '' }} за „{{ query }}"
      </p>

      <div v-if="filteredBooks.length" class="carousel-wrap">
        <button class="carousel-btn carousel-btn-left" @click="scrollLeft" :disabled="atStart">&#8592;</button>
        <div class="carousel-track" ref="track" @scroll="checkScroll">
          <BookCard v-for="b in filteredBooks" :key="b.id" :book="b" />
        </div>
        <button class="carousel-btn carousel-btn-right" @click="scrollRight" :disabled="atEnd">&#8594;</button>
      </div>

      <div v-else class="empty-state">
        <div class="icon">📖</div>
        <p>Нема книги за „{{ query }}"</p>
      </div>
    </div>
    <section class="about">
      <div class="about-image">
        <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
            alt="Library interior"
        />
        <div class="about-image-overlay"></div>
      </div>
      <div class="about-content">
        <span class="about-tag">За нас</span>
        <h2 class="about-title">Место каде<br/>книгите живеат</h2>
        <p class="about-text">
          Нашата библиотека е отворена за сите кои сакаат да читаат, учат и истражуваат.
          Со богата колекција од над 500 наслови — од класична литература до современа фантастика —
          секој ќе најде нешто за себе.
        </p>
        <p class="about-text">
          Резервирајте книга онлајн и подигнете ја во библиотека или нарачајте ја на домашна адреса.
          Читањето никогаш не било полесно.
        </p>
        <div class="about-features">
          <div class="feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span>Голема колекција</span>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span>Брза резервација</span>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span>Достава до дом</span>
          </div>
        </div>
      </div>
    </section>
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
      query: '',
      hints: ['Fiction', 'History', 'Philosophy', 'Science'],
      atStart: true,
      atEnd: false
    }
  },

  async mounted() {
    this.books = await BookService.getBooks()
    this.$nextTick(() => {
      this.checkScroll()
    })
  },

  computed: {
    filteredBooks() {
      if (!this.query.trim()) return this.books
      const q = this.query.toLowerCase()
      return this.books.filter(b =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.genre?.toLowerCase().includes(q)
      )
    }
  },

  methods: {
    scrollLeft() {
      const track = this.$refs.track
      if (!track) return
      track.scrollLeft -= 440
      this.$nextTick(this.checkScroll)
    },

    scrollRight() {
      const track = this.$refs.track
      if (!track) return
      track.scrollLeft += 440
      this.$nextTick(this.checkScroll)
    },

    checkScroll() {
      const track = this.$refs.track
      if (!track) return
      this.atStart = track.scrollLeft <= 0
      this.atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 420px;
  padding: 4rem 6rem;
  background: #1a2332;
  overflow: hidden;
}

.hero-bg { position: absolute; inset: 0; pointer-events: none; }

.hero-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
}
.c1 { width: 400px; height: 400px; background: #c9a84c; top: -100px; left: -80px; }
.c2 { width: 300px; height: 300px; background: #8c7b6b; bottom: -80px; right: 200px; }
.c3 { width: 200px; height: 200px; background: #b5a48a; top: 50px; right: 80px; }

.hero-content { position: relative; z-index: 1; max-width: 520px; }

.hero-badge {
  display: inline-block;
  background: rgba(201,168,76,0.15);
  color: #c9a84c;
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 1.2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #f0ead6;
  line-height: 1.15;
  margin: 0 0 1rem;
  font-family: 'Georgia', serif;
}

.hero-accent { color: #c9a84c; }

.hero-desc {
  font-size: 1.05rem;
  color: #8a9bb0;
  line-height: 1.7;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
}

.hero-stats { display: flex; align-items: center; gap: 1.5rem; }
.stat { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-num { font-size: 1.6rem; font-weight: 800; color: #f0ead6; line-height: 1; }
.stat-label { font-size: 0.78rem; color: #5d7080; text-transform: uppercase; letter-spacing: 0.08em; }
.stat-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.1); }

.hero-visual { position: relative; z-index: 1; flex-shrink: 0; }
.shelf { display: flex; flex-direction: column; }
.row { display: flex; align-items: flex-end; gap: 3px; padding: 0 6px; }
.row-back { opacity: 0.35; transform: scale(0.82); transform-origin: bottom center; margin-bottom: -2px; }
.plank { height: 8px; background: #3d2810; border-radius: 2px; box-shadow: 0 3px 10px rgba(0,0,0,0.5); }

.b {
  width: var(--w);
  height: var(--h);
  background: var(--c);
  border-radius: 1px 3px 3px 1px;
  position: relative;
  transition: transform 0.3s cubic-bezier(.34, 1.4, .64, 1);
  cursor: default;
}
.b:hover { transform: translateY(-14px); }
.b::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: rgba(0,0,0,0.2);
  border-radius: 1px 0 0 1px;
}

.about {
  display: flex;
  align-items: stretch;
  min-height: 420px;
  background: #f7f4ef;
}

.about-image {
  width: 45%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 60%, #f7f4ef 100%);
}

.about-content {
  flex: 1;
  padding: 4rem 4rem 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.about-tag {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c9a84c;
}

.about-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c1a0e;
  line-height: 1.2;
  margin: 0;
}

.about-text {
  font-size: 0.97rem;
  color: #6b5040;
  line-height: 1.8;
  font-family: 'Georgia', serif;
  max-width: 480px;
}

.about-features {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #4a3520;
}

.feature-icon {
  width: 36px;
  height: 36px;
  background: rgba(201,168,76,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-wrap { position: relative; max-width: 560px; margin-bottom: 0.8rem; }

.search-icon {
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.9rem 7rem 0.9rem 3rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.97rem;
  color: #2c1a0e;
  background: white;
  border: 1.5px solid #d5c9b0;
  border-radius: 4px;
  outline: none;
  box-shadow: 0 2px 12px rgba(44,26,14,0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder { color: #b09070; font-style: italic; }
.search-input:focus { border-color: #c9942a; box-shadow: 0 2px 18px rgba(201,148,42,0.15); }

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #2c1a0e;
  color: #e8c97a;
  border: none;
  padding: 0.55rem 1.2rem;
  border-radius: 3px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
}
.search-btn:hover { background: #6b3f1f; }

.search-hints { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }

.hint {
  font-size: 0.78rem;
  color: #8b6b4a;
  background: #ede5d0;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  font-family: Georgia, serif;
  font-style: italic;
}
.hint:hover { border-color: #c9942a; color: #2c1a0e; }
.hint.active { background: #2c1a0e; color: #e8c97a; border-color: #2c1a0e; }

.results-count { font-size: 0.85rem; color: #8b6b4a; margin-bottom: 1rem; font-style: italic; }

.carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0.5rem;
  flex: 1;
  scrollbar-width: none;
}
.carousel-track::-webkit-scrollbar { display: none; }

.carousel-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #d5c9b0;
  background: white;
  color: #2c1a0e;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  box-shadow: 0 2px 8px rgba(44,26,14,0.1);
  position: relative;
  z-index: 2;
}
.carousel-btn:hover:not(:disabled) {
  background: #2c1a0e;
  color: #e8c97a;
  border-color: #2c1a0e;
  transform: scale(1.08);
}
.carousel-btn:disabled { opacity: 0.3; cursor: default; }

@media (max-width: 900px) {
  .hero { flex-direction: column; padding: 3rem 2rem; text-align: center; min-height: auto; }
  .hero-title { font-size: 2.2rem; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .about { flex-direction: column; }
  .about-image { width: 100%; height: 240px; }
  .about-image-overlay { background: linear-gradient(to bottom, transparent 60%, #f7f4ef 100%); }
  .about-content { padding: 2rem; }
  .about-title { font-size: 1.7rem; }
}
</style>