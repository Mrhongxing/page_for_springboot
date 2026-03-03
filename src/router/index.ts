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
      path: '/car',
      name: 'car',
      component: () => import('@/views/car/car.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/user.vue')
    },
    {
      path: '/navigation',
      name: 'navigation',
      component: () => import('@/views/navigation/index.vue')
    }
  ],
})

export default router
