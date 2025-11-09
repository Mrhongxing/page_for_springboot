import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: login
    }
  ],
})

export default router
