<template>
  <div class="app-wrapper">

    <nav class="navbar">
      <router-link to="/" class="nav-logo">
        <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 5 C16 5 10 3 2 4 L2 22 C10 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <path d="M16 5 C16 5 22 3 30 4 L30 22 C22 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          <line x1="16" y1="5" x2="16" y2="23" stroke="#c9a84c" stroke-width="1.2" stroke-dasharray="2 2"/>
        </svg>
        <div class="nav-logo-text">
          <span class="nav-logo-name">The Library</span>
          <span class="nav-logo-sub">Est. 2024</span>
        </div>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <span class="nav-sep"></span>
        <router-link to="/books" class="nav-link">Books</router-link>
        <template v-if="!isAdmin">
          <span class="nav-sep"></span>
          <router-link to="/reservations" class="nav-link">My Reservations</router-link>
        </template>

        <template v-if="isAdmin">
          <span class="nav-sep"></span>
          <router-link to="/admin" class="nav-link">Admin Panel</router-link>
        </template>

        <span class="nav-sep"></span>

        <div v-if="user" class="nav-user">
          <router-link v-if="!isAdmin" to="/profile" class="nav-link">{{ user.name }}</router-link>
          <button class="nav-logout" @click="logout">Log out</button>
        </div>
        <router-link v-else to="/login" class="nav-link nav-login">Log in</router-link>
      </div>
    </nav>

    <main class="app-main">
      <router-view/>
    </main>

    <footer class="footer">
      <div class="footer-inner">

        <div class="footer-brand">
          <div class="footer-logo">
            <svg width="28" height="22" viewBox="0 0 32 26" fill="none">
              <path d="M16 5 C16 5 10 3 2 4 L2 22 C10 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <path d="M16 5 C16 5 22 3 30 4 L30 22 C22 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <line x1="16" y1="5" x2="16" y2="23" stroke="#c9a84c" stroke-width="1.2" stroke-dasharray="2 2"/>
            </svg>
            <span class="footer-logo-name">The Library</span>
          </div>
          <p class="footer-tagline">Вашата дигитална библиотека.<br/>Читајте повеќе, знаете повеќе.</p>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Навигација</h4>
          <router-link to="/" class="footer-link">Home</router-link>
          <span class="nav-sep"></span>
          <router-link to="/books" class="nav-link">Книги</router-link>
          <router-link v-if="!isAdmin" to="/reservations" class="footer-link">My Reservations</router-link>
          <router-link v-if="isAdmin" to="/admin" class="footer-link">Admin Panel</router-link>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Информации</h4>
          <span class="footer-text">Работно време: 08:00 – 20:00</span>
          <span class="footer-text">Понеделник – Сабота</span>
          <span class="footer-text">contact@thelibrary.mk</span>
        </div>

      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} The Library. Сите права задржани.</span>
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

.app-main { flex: 1; }

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 68px;
  background: #2c1a0e;
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-logo-text { display: flex; flex-direction: column; gap: 1px; }

.nav-logo-name {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f0ead6;
  line-height: 1;
  letter-spacing: 0.02em;
}

.nav-logo-sub {
  font-size: 9px;
  color: #c9a84c;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c4a882;
  text-decoration: none;
  padding: 0.4rem 0.75rem;
  transition: color 0.2s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0.75rem;
  right: 0.75rem;
  height: 2px;
  background: #c9a84c;
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-link:hover { color: #f0ead6; }
.nav-link:hover::after,
.nav-link.router-link-active::after { transform: scaleX(1); }
.nav-link.router-link-active { color: #f0ead6; }

.nav-login {
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 4px;
  padding: 0.35rem 0.9rem;
  color: #c9a84c;
}

.nav-login:hover { background: rgba(201, 168, 76, 0.1); color: #c9a84c; }
.nav-login::after { display: none; }

.nav-sep {
  width: 1px;
  height: 16px;
  background: rgba(201, 168, 76, 0.2);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-username {
  font-size: 0.82rem;
  color: #f0ead6;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.nav-logout {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8a6a4a;
  background: transparent;
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.nav-logout:hover {
  color: #f0ead6;
  border-color: rgba(201, 168, 76, 0.5);
}

.footer {
  background: #2c1a0e;
  border-top: 1px solid rgba(201, 168, 76, 0.2);
  padding-top: 3rem;
}

.footer-inner {
  display: flex;
  gap: 4rem;
  justify-content: space-between;
  padding: 0 3rem 2.5rem;
  flex-wrap: wrap;
}

.footer-brand { max-width: 220px; }

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.footer-logo-name {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f0ead6;
  letter-spacing: 0.02em;
}

.footer-tagline {
  font-size: 0.85rem;
  color: #7a6555;
  line-height: 1.7;
  font-style: italic;
  font-family: 'Georgia', serif;
}

.footer-col { display: flex; flex-direction: column; gap: 0.6rem; }

.footer-heading {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom: 0.4rem;
  font-family: 'Georgia', serif;
}

.footer-link {
  font-size: 0.88rem;
  color: #a08060;
  text-decoration: none;
  transition: color 0.2s;
  letter-spacing: 0.03em;
}

.footer-link:hover { color: #f0ead6; }

.footer-text {
  font-size: 0.88rem;
  color: #7a6555;
  letter-spacing: 0.03em;
}

.footer-bottom {
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  padding: 1rem 3rem;
  font-size: 0.78rem;
  color: #5a4535;
  letter-spacing: 0.04em;
}

@media (max-width: 700px) {
  .footer-inner { flex-direction: column; gap: 2rem; padding: 0 1.5rem 2rem; }
  .footer-bottom { padding: 1rem 1.5rem; }
  .navbar { padding: 0 1.2rem; }
}
</style>