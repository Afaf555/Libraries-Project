import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BookDetails from '../views/BookDetails.vue'
import Reservations from '../views/Reservations.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/book/:id', component: BookDetails },
        { path: '/reservations', component: Reservations },
        { path: '/admin', component: AdminView }
    ]
})

export default router
