<template>
  <div class="app-wrapper">

    <!-- Minimal Top Bar -->
<!--    <div class="top-bar">-->
<!--      <div class="social-links">-->
<!--        <a href="#" title="Instagram">📷</a>-->
<!--        <a href="#" title="Pinterest">📌</a>-->
<!--        <a href="#" title="Email">✉️</a>-->
<!--      </div>-->
<!--      <div class="top-info">-->
<!--        <span>Account & Profile →</span>-->
<!--      </div>-->
<!--    </div>-->

    <!-- Main Navbar -->
    <nav class="navbar">
      <router-link to="/" class="nav-logo">The Library</router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/books" class="nav-link">Books</router-link>
        <template v-if="!isAdmin">
          <router-link to="/reservations" class="nav-link">Reservations</router-link>
        </template>
        <template v-if="isAdmin">
          <router-link to="/admin" class="nav-link">Admin</router-link>
        </template>
        <span class="nav-sep">|</span>
        <template v-if="user">
          <router-link v-if="!isAdmin" to="/profile" class="nav-link">{{ user.name }}</router-link>
          <button class="nav-logout" @click="logout">Logout</button>
        </template>
        <router-link v-else to="/login" class="nav-link">Login</router-link>
      </div>
    </nav>

    <main class="app-main">
      <router-view/>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">

        <div class="footer-brand">
          <div class="footer-logo">The Library</div>
          <p class="footer-tagline">Your digital sanctuary for books and knowledge</p>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Navigation</h4>
          <router-link to="/" class="footer-link">Home</router-link>
          <router-link to="/books" class="footer-link">Books</router-link>
          <router-link v-if="!isAdmin" to="/reservations" class="footer-link">Reservations</router-link>
          <router-link v-if="isAdmin" to="/admin" class="footer-link">Admin</router-link>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Contact</h4>
          <span class="footer-text">Mon - Sat</span>
          <span class="footer-text">08:00 - 20:00</span>
          <span class="footer-text">contact@thelibrary.mk</span>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Follow</h4>
          <div class="footer-social">
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Email</a>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} The Library</span>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      user: null,
      isAdmin: false
    }
  },

  mounted() {
    this.loadUser()
  },

  watch: {
    $route() {
      this.loadUser()
    }
  },

  methods: {
    loadUser() {
      const stored = localStorage.getItem('user')
      this.user = stored ? JSON.parse(stored) : null
      this.isAdmin = this.user?.role === 'admin'
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.user = null
      this.isAdmin = false
      this.$router.push('/login')
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}

/* ═══════════════════════════════════════════════════════════
   TOP BAR - Teresa Style
   ═══════════════════════════════════════════════════════════ */

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 60px;
  background: #ede8e0;
  border-bottom: 1px solid rgba(227, 220, 209, 0.5);
  font-size: 11px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  font-size: 14px;
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 400ms;
}

.social-links a:hover {
  opacity: 1;
}

.top-info {
  font-size: 10px;
  font-weight: 500;
  color: #7d6f5f;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.top-info span {
  cursor: pointer;
  transition: color 400ms;
}

.top-info span:hover {
  color: #5a4d3e;
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR - Minimal & Clean
   ═══════════════════════════════════════════════════════════ */

.navbar {
  position: sticky;
  top: 0;
  background: rgba(253, 251, 247, 0.98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(227, 220, 209, 0.3);
  padding: 20px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.nav-logo {
  font-family: 'Cormorant', serif;
  font-size: 28px;
  font-weight: 300;
  font-style: italic;
  color: #5a4d3e;
  text-decoration: none;
  letter-spacing: 1px;
  transition: opacity 400ms;
}

.nav-logo:hover {
  opacity: 0.6;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 11px;
  font-weight: 500;
  color: #7d6f5f;
  text-decoration: none;
  transition: color 400ms;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #3d3430;
}

.nav-sep {
  color: #e3dcd1;
  font-weight: 300;
}

.nav-logout {
  font-size: 11px;
  font-weight: 500;
  color: #9d9084;
  background: transparent;
  border: 1px solid #e3dcd1;
  border-radius: 4px;
  padding: 6px 14px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: all 400ms;
}

.nav-logout:hover {
  color: #5a4d3e;
  border-color: #c9bfb3;
}

/* ═══════════════════════════════════════════════════════════
   FOOTER - Soft & Detailed
   ═══════════════════════════════════════════════════════════ */

.footer {
  background: #f3efe9;
  border-top: 1px solid rgba(227, 220, 209, 0.5);
  padding-top: 60px;
  margin-top: 100px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding: 0 60px 48px;
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  font-family: 'Cormorant', serif;
  font-size: 32px;
  font-weight: 300;
  font-style: italic;
  color: #5a4d3e;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.footer-tagline {
  font-size: 13px;
  color: #9d9084;
  line-height: 1.8;
  font-weight: 300;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-heading {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #7d6f5f;
  margin-bottom: 4px;
}

.footer-link {
  font-size: 13px;
  color: #9d9084;
  text-decoration: none;
  transition: color 400ms;
  font-weight: 300;
}

.footer-link:hover {
  color: #5a4d3e;
}

.footer-text {
  font-size: 13px;
  color: #aea396;
  font-weight: 300;
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-social a {
  font-size: 13px;
  color: #9d9084;
  text-decoration: none;
  transition: color 400ms;
  font-weight: 300;
}

.footer-social a:hover {
  color: #5a4d3e;
}

.footer-bottom {
  border-top: 1px solid rgba(227, 220, 209, 0.3);
  padding: 20px 60px;
  text-align: center;
  font-size: 11px;
  color: #bfb5a9;
  letter-spacing: 1px;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 900px) {
  .top-bar {
    padding: 10px 32px;
    font-size: 10px;
  }

  .navbar {
    padding: 16px 32px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-logo {
    font-size: 24px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    padding: 0 32px 40px;
    gap: 32px;
  }

  .footer-bottom {
    padding: 16px 32px;
  }
}

@media (max-width: 600px) {
  .top-bar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 20px;
  }

  .navbar {
    padding: 16px 20px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .nav-sep {
    display: none;
  }
}
</style>