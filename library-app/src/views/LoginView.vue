<template>
  <div class="auth-page">

    <!-- Left Panel - Soft Image -->
    <div class="auth-panel">
      <div class="panel-image">
        <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80" alt="Reading">
        <div class="panel-overlay"></div>
      </div>
      <div class="panel-content">
        <h2 class="panel-title">Your digital sanctuary</h2>
        <p class="panel-subtitle">Discover thousands of books and reserve online with ease</p>
      </div>
    </div>

    <!-- Right Panel - Form -->
    <div class="auth-form-panel">
      <div class="form-container">

        <!-- Mode Tabs -->
        <div v-if="!otpStep" class="mode-tabs">
          <button
              class="mode-tab"
              :class="{ active: mode === 'login' }"
              @click="switchMode('login')"
          >
            Sign In
          </button>
          <span class="tab-divider">/</span>
          <button
              class="mode-tab"
              :class="{ active: mode === 'register' }"
              @click="switchMode('register')"
          >
            Sign Up
          </button>
        </div>

        <!-- Alerts -->
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>

        <!-- LOGIN FORM -->
        <form v-if="mode === 'login' && !otpStep" class="auth-form" @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Email Address</label>
            <input
                v-model="loginForm.email"
                type="email"
                placeholder="you@example.com"
                required
                :disabled="loading"
            />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
                :disabled="loading"
            />
          </div>

          <button type="submit" class="btn-auth" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Sign In</span>
          </button>

          <p class="auth-footer">
            Don't have an account?
            <a href="#" @click.prevent="switchMode('register')">Sign up</a>
          </p>
        </form>

        <!-- OTP FORM -->
        <form v-if="otpStep" class="auth-form" @submit.prevent="handleVerifyOTP">
          <div class="otp-box">
            <div class="otp-icon">✉️</div>
            <p>Verification code sent to:</p>
            <strong>{{ isRegisterOTP ? registerForm.email : loginForm.email }}</strong>
          </div>

          <div class="input-group">
            <label>6-Digit Code</label>
            <input
                v-model="otpCode"
                type="text"
                placeholder="000000"
                maxlength="6"
                required
                :disabled="loading"
                class="otp-input"
            />
          </div>

          <button type="submit" class="btn-auth" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Verify</span>
          </button>

          <div class="otp-actions">
            <p class="auth-footer">
              <a href="#" @click.prevent="resendOTP">Resend code</a>
            </p>
            <p class="auth-footer">
              <a href="#" @click.prevent="cancelOTP">← Back</a>
            </p>
          </div>
        </form>

        <!-- REGISTER FORM -->
        <form v-if="mode === 'register' && !otpStep" class="auth-form" @submit.prevent="handleRegister">
          <div class="input-group">
            <label>Full Name</label>
            <input
                v-model="registerForm.name"
                type="text"
                placeholder="John Doe"
                required
                :disabled="loading"
            />
          </div>

          <div class="input-group">
            <label>Email Address</label>
            <input
                v-model="registerForm.email"
                type="email"
                placeholder="you@example.com"
                required
                :disabled="loading"
            />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 6 characters"
                required
                minlength="6"
                :disabled="loading"
            />
          </div>

          <div class="input-group">
            <label>Confirm Password</label>
            <input
                v-model="registerForm.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Repeat password"
                required
                :disabled="loading"
                :class="{ 'error': passwordMismatch }"
            />
            <span v-if="passwordMismatch" class="input-error">Passwords don't match</span>
          </div>

          <button type="submit" class="btn-auth" :disabled="loading || passwordMismatch">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Create Account</span>
          </button>

          <p class="auth-footer">
            Already have an account?
            <a href="#" @click.prevent="switchMode('login')">Sign in</a>
          </p>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import BookService from '../service/BookService'

const API = 'http://localhost:3000/api'

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
      otpStep: false,
      otpCode: '',
      isRegisterOTP: false,
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
      this.otpStep = false
      this.otpCode = ''
      this.isRegisterOTP = false
    },

    async handleLogin() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.loginForm.email, password: this.loginForm.password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Login failed')

        if (data.requiresOTP) {
          this.otpStep = true
          this.isRegisterOTP = false
          this.success = 'Code sent!'
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async handleVerifyOTP() {
      this.loading = true
      this.error = null
      try {
        const endpoint = this.isRegisterOTP ? 'verify-register-otp' : 'verify-otp'
        const email = this.isRegisterOTP ? this.registerForm.email : this.loginForm.email

        const res = await fetch(`${API}/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: this.otpCode })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Invalid code')

        BookService.saveSession(data.token, data.user)
        if (data.user?.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async resendOTP() {
      this.otpCode = ''
      this.error = null
      this.success = null
      if (this.isRegisterOTP) {
        await this.handleRegister()
      } else {
        await this.handleLogin()
      }
    },

    cancelOTP() {
      this.otpStep = false
      this.otpCode = ''
      this.isRegisterOTP = false
      this.error = null
      this.success = null
    },

    async handleRegister() {
      if (this.passwordMismatch) return
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.registerForm.name,
            email: this.registerForm.email,
            password: this.registerForm.password
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Registration failed')

        if (data.requiresOTP) {
          this.otpStep = true
          this.isRegisterOTP = true
          this.success = 'Code sent!'
        }
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

.auth-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
}

/* ═══════════════════════════════════════════════════════════
   LEFT PANEL - Soft Image
   ═══════════════════════════════════════════════════════════ */

.auth-panel {
  width: 45%;
  position: relative;
  overflow: hidden;
}

.panel-image {
  position: absolute;
  inset: 0;
}

.panel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%) sepia(15%);
}

.panel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(243, 239, 233, 0.9) 0%, transparent 50%);
}

.panel-content {
  position: absolute;
  bottom: 60px;
  left: 60px;
  right: 60px;
  z-index: 1;
}

.panel-title {
  font-family: 'Cormorant', serif;
  font-size: 42px;
  font-weight: 300;
  font-style: italic;
  color: #5a4d3e;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.panel-subtitle {
  font-size: 14px;
  color: #7d6f5f;
  line-height: 1.7;
  font-weight: 300;
}

/* ═══════════════════════════════════════════════════════════
   RIGHT PANEL - Form
   ═══════════════════════════════════════════════════════════ */

.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: #fdfbf7;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

/* Mode Tabs */
.mode-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.mode-tab {
  font-size: 13px;
  font-weight: 400;
  color: #bfb5a9;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 400ms;
  letter-spacing: 0.5px;
}

.mode-tab.active {
  color: #5a4d3e;
  font-weight: 500;
}

.tab-divider {
  color: #e3dcd1;
}

/* Alerts */
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 24px;
  font-weight: 300;
  animation: fadeIn 400ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.alert-error {
  background: rgba(160, 112, 96, 0.08);
  color: #a07060;
  border: 1px solid rgba(160, 112, 96, 0.2);
}

.alert-success {
  background: rgba(159, 174, 143, 0.08);
  color: #7a8c67;
  border: 1px solid rgba(159, 174, 143, 0.2);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 10px;
  font-weight: 500;
  color: #7d6f5f;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e3dcd1;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  background: #f8f5f1;
  color: #3d3430;
  transition: all 400ms;
  outline: none;
}

.input-group input::placeholder {
  color: #bfb5a9;
  font-style: italic;
}

.input-group input:focus {
  border-color: #c9bfb3;
  background: #fdfbf7;
  box-shadow: 0 0 0 3px rgba(212, 185, 150, 0.08);
}

.input-group input:disabled {
  background: #ede8e0;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-group input.error {
  border-color: #a07060;
}

.input-error {
  font-size: 11px;
  color: #a07060;
  font-weight: 300;
}

/* OTP */
.otp-box {
  text-align: center;
  padding: 24px;
  background: rgba(212, 185, 150, 0.06);
  border-radius: 4px;
  border: 1px solid rgba(212, 185, 150, 0.15);
  margin-bottom: 20px;
}

.otp-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.otp-box p {
  font-size: 12px;
  color: #9d9084;
  margin-bottom: 4px;
  font-weight: 300;
}

.otp-box strong {
  font-size: 14px;
  color: #5a4d3e;
  font-weight: 400;
}

.otp-input {
  text-align: center !important;
  font-size: 24px !important;
  letter-spacing: 0.4em !important;
  font-weight: 400 !important;
}

.otp-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Button */
.btn-auth {
  width: 100%;
  padding: 14px;
  background: #5a4d3e;
  color: #fdfbf7;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 400ms;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 8px;
}

.btn-auth:hover:not(:disabled) {
  background: #7d6f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(61, 52, 48, 0.12);
}

.btn-auth:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(253, 251, 247, 0.3);
  border-top-color: #fdfbf7;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Footer */
.auth-footer {
  text-align: center;
  font-size: 12px;
  color: #9d9084;
  margin-top: 8px;
  font-weight: 300;
}

.auth-footer a {
  color: #7d6f5f;
  text-decoration: none;
  font-weight: 400;
  transition: color 400ms;
}

.auth-footer a:hover {
  color: #5a4d3e;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
  }

  .auth-panel {
    width: 100%;
    min-height: 300px;
  }

  .panel-content {
    bottom: 40px;
    left: 32px;
    right: 32px;
  }

  .panel-title {
    font-size: 32px;
  }

  .auth-form-panel {
    padding: 48px 32px;
  }
}
</style>