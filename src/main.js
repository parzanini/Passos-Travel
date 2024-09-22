import './style.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import Lara from '@/myPreset'


const app = createApp(App)
app.use(PrimeVue, {
    unstyled: true,
     pt: Lara   
})

app.use(router)

app.mount('#app')
