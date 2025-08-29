import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Resources from '../components/Resources.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/resources',
    component: Resources,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
