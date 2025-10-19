import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import TeenPage from '../views/TeenPage.vue'
import StaffPage from '../views/StaffPage.vue'
import FeedbackAPI from '@/views/FeedbackAPI.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import isAuthenticated from '@/authenticate'
import BulkEmail from '@/views/BulkEmail.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import GeminiChat from '@/views/GeminiChat.vue'
const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/FireLogin',
    component: FirebaseSigninView,
  },
  {
    path: '/FireRegister',
    component: FirebaseRegisterView,
  },
  {
    path: '/TeenPage',
    component: TeenPage,
  },
  {
    path: '/StaffPage',
    component: StaffPage,
  },
  {
    path: '/FeedbackAPI',
    component: FeedbackAPI,
    meta: { requiresAuth: true },
  },
  {
    path: '/BulkEmail',
    component: BulkEmail,
    meta: { requiresAuth: true },
  },
  {
    path: '/AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/GeminiChat',
    component: GeminiChat,
  },
  {
    path: '/AccessDenied',
    component: AccessDenied,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.requiresRole
  const currentRole = localStorage.getItem('userRole')

  if (requiresAuth && !isAuthenticated.value) {
    next('/AccessDenied')
    return
  }

  if (requiredRole && currentRole !== requiredRole) {
    next('/AccessDenied')
    return
  }

  next()
})

export default router
