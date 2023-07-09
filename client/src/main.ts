import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import VueRouter from './scripts/router/vuerouter'
import axios from 'axios'

//Bootstrap5 Main styles
import "bootstrap/dist/css/bootstrap.min.css"
//Bootstrap5 Interactivity
import "bootstrap"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const pinia = createPinia()

const app = createApp(App)
app.use(VueRouter)
app.use(pinia)
app.mount('#app')
