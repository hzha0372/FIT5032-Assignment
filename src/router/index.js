import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import TeenPage from '../views/TeenPage.vue'
import StaffPage from '../views/StaffPage.vue'
import ProgramAPI from '@/views/ProgramAPI.vue'
import FeedbackAPI from '@/views/FeedbackAPI.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import isAuthenticated from '@/authenticate'
const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/login',
    component: LoginView,
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
    path: '/ProgramAPI',
    component: ProgramAPI,
    meta: { requiresAuth: true },
  },
  {
    path: '/FeedbackAPI',
    component: FeedbackAPI,
    meta: { requiresAuth: true },
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
