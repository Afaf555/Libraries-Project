<template>
  <div class="auth-page">

    <!-- Left decorative panel -->
    <div class="auth-panel">
      <div class="panel-content">
        <div class="panel-logo">
          <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
            <path d="M16 5 C16 5 10 3 2 4 L2 22 C10 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            <path d="M16 5 C16 5 22 3 30 4 L30 22 C22 21 16 23 16 23" stroke="#c9a84c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            <line x1="16" y1="5" x2="16" y2="23" stroke="#c9a84c" stroke-width="1.2" stroke-dasharray="2 2"/>
          </svg>
          <span class="panel-logo-name">The Library</span>
        </div>
        <h1 class="panel-title">Вашата дигитална библиотека</h1>
        <p class="panel-subtitle">Истражувајте илјадници книги и резервирајте онлајн.</p>

        <!-- Single row floating golden books -->
        <div class="shelf">
          <div class="row row-front">
            <div class="b" style="--w:34px;--h:118px;--o:1;  --d:0s;"></div>
            <div class="b" style="--w:28px;--h:98px; --o:0.7;--d:0.2s;"></div>
            <div class="b" style="--w:36px;--h:138px;--o:0.9;--d:0.4s;"></div>
            <div class="b" style="--w:30px;--h:105px;--o:0.6;--d:0.6s;"></div>
            <div class="b" style="--w:32px;--h:125px;--o:1;  --d:0.3s;"></div>
            <div class="b" style="--w:26px;--h:96px; --o:0.75;--d:0.5s;"></div>
            <div class="b" style="--w:34px;--h:115px;--o:0.85;--d:0.1s;"></div>
          </div>
        </div>

      </div>
    </div>

    <!-- Right form panel -->
    <div class="auth-form-panel">
      <div class="form-container">

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab" :class="{ active: mode === 'login' }" @click="switchMode('login')">Најава</button>
          <button class="tab" :class="{ active: mode === 'register' }" @click="switchMode('register')">Регистрација</button>
          <div class="tab-indicator" :class="{ right: mode === 'register' }"></div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Success message -->
        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <!-- LOGIN FORM -->
        <form v-if="mode === 'login'" class="auth-form" @submit.prevent="handleLogin">
          <div class="field">
            <label>Е-пошта</label>
            <input v-model="loginForm.email" type="email" placeholder="vase@email.com" required :disabled="loading"/>
          </div>
          <div class="field">
            <label>Лозинка</label>
            <div class="password-wrap">
              <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Внесете лозинка" required :disabled="loading"/>
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Најави се</span>
          </button>
          <p class="switch-hint">
            Немате профил?
            <a href="#" @click.prevent="switchMode('register')">Регистрирајте се</a>
          </p>
        </form>

        <!-- REGISTER FORM -->
        <form v-if="mode === 'register'" class="auth-form" @submit.prevent="handleRegister">
          <div class="field">
            <label>Име и презиме</label>
            <input v-model="registerForm.name" type="text" placeholder="Ване Петров" required :disabled="loading"/>
          </div>
          <div class="field">
            <label>Е-пошта</label>
            <input v-model="registerForm.email" type="email" placeholder="vase@email.com" required :disabled="loading"/>
          </div>
          <div class="field">
            <label>Лозинка</label>
            <div class="password-wrap">
              <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Минимум 6 карактери" required minlength="6" :disabled="loading"/>
              <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
          <div class="field">
            <label>Потврди лозинка</label>
            <div class="password-wrap">
              <input v-model="registerForm.confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="Повторете ја лозинката" required :disabled="loading"/>
              <button type="button" class="toggle-pw" @click="showConfirm = !showConfirm">
                {{ showConfirm ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="passwordMismatch" class="field-error">Лозинките не се совпаѓаат</span>
          </div>
          <button type="submit" class="btn-primary" :disabled="loading || passwordMismatch">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Регистрирај се</span>
          </button>
          <p class="switch-hint">
            Веќе имате профил?
            <a href="#" @click.prevent="switchMode('login')">Најавете се</a>
          </p>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import BookService from '../service/BookService'

export default {
  name: 'LoginView',

  data() {
    return {
      mode: 'login',
      loading: false,
      error: null,
      success: null,
      showPassword: false,
      showConfirm: false,
      loginForm: { email: '', password: '' },
      registerForm: { name: '', email: '', password: '', confirmPassword: '' }
    }
  },

  computed: {
    passwordMismatch() {
      return this.registerForm.confirmPassword.length > 0 &&
          this.registerForm.password !== this.registerForm.confirmPassword
    }
  },

  methods: {
    switchMode(newMode) {
      this.mode = newMode
      this.error = null
      this.success = null
      this.showPassword = false
      this.showConfirm = false
    },

    async handleLogin() {
      this.loading = true
      this.error = null
      try {
        const data = await BookService.login(this.loginForm.email, this.loginForm.password)
        BookService.saveSession(data.token, data.user)
        if (data.user?.role === 'admin') {
          this.$router.push('/admin')
        } else {
          this.$router.push('/')
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async handleRegister() {
      if (this.passwordMismatch) return
      this.loading = true
      this.error = null
      try {
        const data = await BookService.register(
            this.registerForm.name,
            this.registerForm.email,
            this.registerForm.password
        )
        BookService.saveSession(data.token, data.user)
        this.success = 'Успешна регистрација! Пренасочување...'
        setTimeout(() => this.$router.push('/'), 1200)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────── */
.auth-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Georgia', serif;
}

/* ── Left panel ─────────────────────────────────── */
.auth-panel {
  width: 45%;
  background: #1a2332;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.auth-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
      radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(181,164,138,0.08) 0%, transparent 50%);
}

.panel-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  max-width: 380px;
}

/* Logo */
.panel-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.panel-logo-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f0ead6;
  letter-spacing: 0.04em;
}

.panel-title {
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.8rem;
  color: #f0ead6;
}

.panel-subtitle {
  font-size: 0.95rem;
  color: #8a9bb0;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.shelf { display: flex; flex-direction: column; align-items: center; }

.row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.b {
  width: var(--w);
  height: var(--h);
  background: #c9a84c;
  opacity: var(--o);
  border-radius: 6px;
  cursor: default;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  animation: floatBook 3s ease-in-out infinite;
  animation-delay: var(--d);
}

.b:hover { opacity: 1; }

@keyframes floatBook {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

/* ── Right panel ─────────────────────────────────── */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #f7f4ef;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

/* ── Tabs ───────────────────────────────────────── */
.tabs {
  display: flex;
  position: relative;
  background: #e8e2d9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 2rem;
}

.tab {
  flex: 1;
  padding: 0.65rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-family: 'Georgia', serif;
  color: #6b5e4e;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  transition: color 0.25s;
  font-weight: 600;
}

.tab.active { color: #1a2332; }

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: white;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-indicator.right { transform: translateX(100%); }

/* ── Alerts ─────────────────────────────────────── */
.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  animation: fadeIn 0.3s ease;
}

.alert-error { background: #fdecea; color: #c0392b; border-left: 3px solid #c0392b; }
.alert-success { background: #eafaf1; color: #1e8449; border-left: 3px solid #27ae60; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Form ───────────────────────────────────────── */
.auth-form { display: flex; flex-direction: column; gap: 1.2rem; }

.field { display: flex; flex-direction: column; gap: 0.4rem; }

.field label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #4a3f35;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.field input {
  padding: 0.75rem 1rem;
  border: 1.5px solid #d5ccc0;
  border-radius: 8px;
  font-size: 0.97rem;
  font-family: 'Georgia', serif;
  background: white;
  color: #1a2332;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input:focus {
  border-color: #c9a84c;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
}

.field input:disabled { background: #f0ece6; cursor: not-allowed; }

.password-wrap { position: relative; }
.password-wrap input { width: 100%; padding-right: 3rem; box-sizing: border-box; }

.toggle-pw {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
}

.field-error { font-size: 0.82rem; color: #c0392b; margin-top: 0.2rem; }

/* ── Submit button ──────────────────────────────── */
.btn-primary {
  margin-top: 0.4rem;
  padding: 0.85rem;
  background: #1a2332;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Georgia', serif;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.btn-primary:hover:not(:disabled) { background: #c9a84c; }
.btn-primary:active:not(:disabled) { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Spinner ────────────────────────────────────── */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Switch hint ─────────────────────────────────── */
.switch-hint { text-align: center; font-size: 0.9rem; color: #7a6e65; margin-top: 0.3rem; }
.switch-hint a { color: #c9a84c; font-weight: 700; text-decoration: none; }
.switch-hint a:hover { text-decoration: underline; }

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 768px) {
  .auth-page { flex-direction: column; }
  .auth-panel { width: 100%; padding: 2.5rem 2rem; min-height: auto; }
  .panel-title { font-size: 1.4rem; }
}
</style>