import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookDetails from '../views/BookDetails.vue'
import Reservations from '../views/Reservations.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: LoginView },
        { path: '/',             component: HomeView,      meta: { requiresAuth: true } },
        { path: '/book/:id',     component: BookDetails,   meta: { requiresAuth: true } },
        { path: '/reservations', component: Reservations,  meta: { requiresAuth: true } },
        { path: '/profile',      component: ProfileView,   meta: { requiresAuth: true } },
        { path: '/admin',        component: AdminView,     meta: { requiresAuth: true, requiresAdmin: true } }
    ]
})

router.beforeEach((to, from) => {
    const token = localStorage.getItem('token')
    const user  = JSON.parse(localStorage.getItem('user') || 'null')
    const isLoggedIn = !!token
    const isAdmin    = user?.role === 'admin'

    if (to.meta.requiresAuth && !isLoggedIn) return '/login'
    if (to.meta.requiresAdmin && !isAdmin) return '/'
    if (to.path === '/login' && isLoggedIn) return '/'
})

export default router