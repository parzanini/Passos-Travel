import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:lang(pt|es)?', // Only allow 'pt' and 'es' as language parameters, '/' for English
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        let lang = to.params.lang;
        const supportedLanguages = ['pt', 'es'];

        if (!lang || !supportedLanguages.includes(lang)) {
          try {
            if (!lang) {
              // Use a geolocation API to get the user's country
              const response = await axios.get('https://ipapi.co/json/');
              const country = response.data.country_code;

              // Map countries to languages
              const countryLanguageMap = {
                BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt',
                ES: 'es', MX: 'es', AR: 'es', CO: 'es',
                // Add more countries as needed
              };

              lang = countryLanguageMap[country];
            }

            if (lang && supportedLanguages.includes(lang)) {
              next(`/${lang}`);
            } else {
              next(); // Proceed with '/' for English
            }
          } catch (error) {
            console.error('Error detecting location:', error);
            next(); // Default to root for English if geolocation fails
          }
        } else {
          next(); // Proceed with the navigation if the language is already set and supported
        }
      }
    }
  ]
})

export default router
