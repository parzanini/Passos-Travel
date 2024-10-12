import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeViewPt from '../views/HomeView-Pt.vue'
import HomeViewEs from '../views/HomeView-Es.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/portuguese',
      name: 'HomeView-Pt',
      component: HomeViewPt
    },
    {
      path: '/spanish',
      name: 'HomeView-Es',
      component: HomeViewEs     

    }
  ]
})

export default router
