import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Scroll to top on every navigation
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/properties',
      name: 'properties',
      // Lazy loading saves memory and makes the initial site load faster
      component: () => import('../views/PropertiesView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    }, 
    {
  // Make this something hard to guess
  path: '/avelune-vault-admin', 
  name: 'admin',
  component: () => import('../views/AdminView.vue')
}
  ]
})

export default router