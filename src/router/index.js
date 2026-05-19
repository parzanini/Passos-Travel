import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const SUPPORTED_LANGUAGES = ['pt', 'es'];

const detectLanguage = () => {
  const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : null;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const detected = detectLanguage();
        if (detected) {
          next(`/${detected}`);
        } else {
          next();
        }
      },
    },
    {
      path: '/:lang(pt|es)',
      name: 'home-lang',
      component: HomeView,
    },
  ],
});

export default router;
