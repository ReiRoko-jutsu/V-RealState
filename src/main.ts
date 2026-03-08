import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Make sure this points to your router file
import './assets/main.css'    // Make sure your Tailwind CSS is here

const app = createApp(App)

app.use(router) // This is the line that makes <RouterView> work!
app.mount('#app')