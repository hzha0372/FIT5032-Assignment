import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import TeenPage from '../views/TeenPage.vue'
import StaffPage from '../views/StaffPage.vue'
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (!to.meta || !to.meta.requiresRole) {
    next()
    return
  }

  const needRole = to.meta.requiresRole
  const currentRole = localStorage.getItem('userRole')

  if (currentRole && currentRole === needRole) {
    next()
  } else {
    next({ path: '/signin' })
  }
})
export default router
