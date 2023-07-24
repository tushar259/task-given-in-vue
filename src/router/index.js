import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../components/FirstComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeComponent
    },
    {
      path: '/second-component',
      component: () => import('../components/SecondComponent.vue')
    }
  ]
})

export default router
