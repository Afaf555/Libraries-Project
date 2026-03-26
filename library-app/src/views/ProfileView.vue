<template>
  <div class="page">
    <h2>Мојот профил</h2>
    <div class="divider"></div>

    <div class="profile-wrap">

      <div class="profile-card">
        <div class="card-header">
          <div class="avatar">{{ user?.name?.charAt(0) }}</div>
          <div>
            <h3>{{ user?.name }}</h3>
            <p class="email">{{ user?.email }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <h4 class="section-title">Адреса за достава</h4>

        <div class="form-grid">
          <div class="form-group full-width">
            <label>Улица</label>
            <input v-model="form.street" type="text" placeholder="Улица бр." :disabled="!editing"/>
          </div>
          <div class="form-group">
            <label>Број</label>
            <input v-model="form.street_number" type="text" placeholder="бб" :disabled="!editing"/>
          </div>
          <div class="form-group">
            <label>Град</label>
            <input v-model="form.city" type="text" placeholder="Скопје" :disabled="!editing"/>
          </div>
          <div class="form-group full-width">
            <label>Држава</label>
            <input v-model="form.country" type="text" placeholder="Македонија" :disabled="!editing"/>
          </div>
        </div>

        <div class="form-actions">
          <button v-if="!editing" class="btn btn-primary" @click="editing = true">Измени адреса</button>
          <button v-if="editing" class="btn btn-gold" @click="saveProfile" :disabled="saving">
            {{ saving ? 'Зачувување...' : 'Зачувај' }}
          </button>
          <button v-if="editing" class="btn btn-outline" @click="cancelEdit">Откажи</button>
        </div>

        <div v-if="successMsg" class="alert-success">{{ successMsg }}</div>
        <div v-if="errorMsg" class="alert-error">{{ errorMsg }}</div>
      </div>

      <!-- ── Моите резервации ── -->
      <div class="reservations-card">
        <h4 class="section-title">Моите резервации</h4>

        <div v-if="reservations.length" class="res-list">
          <div v-for="r in reservations" :key="r.id" class="res-item">
            <div class="res-info">
              <span class="res-title">{{ r.book }}</span>
              <span class="res-author">{{ r.author }}</span>
              <span class="res-type">{{ r.type === 'pickup' ? 'Подигање' : 'Достава до дом' }}</span>
              <span class="res-date">{{ new Date(r.created_at).toLocaleDateString('mk-MK') }}</span>
            </div>
            <div class="res-status" :class="r.status">
              {{ statusLabel(r.status) }}
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Немате резервации.</p>
          <router-link to="/" class="btn btn-primary">Прелистај книги</router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import BookService from '../service/BookService'

const API = 'http://localhost:3000/api'

export default {
  data() {
    return {
      user: null,
      form: { street: '', street_number: '', city: '', country: '' },
      editing: false,
      saving: false,
      successMsg: null,
      errorMsg: null,
      reservations: []
    }
  },

  async mounted() {
    this.user = BookService.getUser()
    await this.loadProfile()
    this.reservations = await BookService.getReservations()
  },

  methods: {
    async loadProfile() {
      try {
        const res = await fetch(`${API}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        const data = await res.json()
        this.user = data
        this.form = {
          street: data.street || '',
          street_number: data.street_number || '',
          city: data.city || '',
          country: data.country || ''
        }
      } catch (err) {
        console.error(err)
      }
    },

    async saveProfile() {
      this.saving = true
      this.successMsg = null
      this.errorMsg = null
      try {
        const res = await fetch(`${API}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name: this.user.name, ...this.form })
        })
        if (!res.ok) throw new Error('Грешка при зачувување')
        this.successMsg = 'Адресата е успешно зачувана!'
        this.editing = false
      } catch (err) {
        this.errorMsg = err.message
      } finally {
        this.saving = false
      }
    },

    cancelEdit() {
      this.editing = false
      this.loadProfile()
    },

    statusLabel(status) {
      const labels = {
        pending:    'Во чекање',
        processing: 'Во обработка',
        shipped:    'Испратено',
        delivered:  'Доставено'
      }
      return labels[status] || status
    }
  }
}
</script>

<style scoped>
.profile-wrap {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: start;
}

.profile-card, .reservations-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(44,26,14,0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brown-dark);
  color: var(--gold-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.card-header h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.email {
  font-size: 0.85rem;
  color: var(--text-light);
}

.section-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-group.full-width { grid-column: 1 / -1; }

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-light);
}

.form-group input {
  padding: 0.6rem 0.9rem;
  border: 1.5px solid var(--parchment);
  border-radius: 4px;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-dark);
  transition: border-color 0.2s;
}

.form-group input:focus { outline: none; border-color: var(--gold); }
.form-group input:disabled { background: var(--cream); color: var(--text-light); }

.form-actions { display: flex; gap: 0.8rem; }

.alert-success {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background: #eafaf1;
  color: #1e8449;
  border-left: 3px solid #27ae60;
  border-radius: 4px;
  font-size: 0.88rem;
}

.alert-error {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background: #fdecea;
  color: #c0392b;
  border-left: 3px solid #c0392b;
  border-radius: 4px;
  font-size: 0.88rem;
}

.res-list { display: flex; flex-direction: column; gap: 0.8rem; }

.res-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border: 1px solid var(--parchment);
  border-radius: 6px;
  border-left: 4px solid var(--gold);
}

.res-info { display: flex; flex-direction: column; gap: 0.15rem; }

.res-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem;
  color: var(--brown-dark);
  font-weight: 600;
}

.res-author, .res-type, .res-date {
  font-size: 0.78rem;
  color: var(--text-light);
}

.res-status {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  flex-shrink: 0;
}

.res-status.pending    { background: #fef9e7; color: #b7950b; }
.res-status.processing { background: #eaf4fb; color: #1a6ba0; }
.res-status.shipped    { background: #eaf7f0; color: #1e8449; }
.res-status.delivered  { background: #f0fff0; color: #145a32; }

@media (max-width: 800px) {
  .profile-wrap { grid-template-columns: 1fr; }
}
</style>