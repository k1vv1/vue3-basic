import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const BASE_URL = import.meta.env.BASE_URL

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页',
      keepAlive: false,
      auth: false,
    },

    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: false,
      auth: false,
    },
    component: () => import('@/pages/login/index.vue'),
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(BASE_URL),
})
export default router
