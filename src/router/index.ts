import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    },
    {
      path: '/3D',
      name: '3D',
      component: () => import('@/views/3D/3D.vue')
    }
  ],
})

export default router
