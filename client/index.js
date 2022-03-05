import { createApp, h } from 'vue'
import './assets/styles/index.css'
import App from './App.vue'
import router from './router'
import icons from './components/icons/*.vue'

const iconComponents = Object.fromEntries(
  Object.entries(icons).map(([name, mod]) => [name, mod.default]),
)

const app = createApp({
  router,
  render: () => h(App),
})

app.use(router)

app.mixin({ components: iconComponents })

app.mount('#root')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(new URL('./service-worker.js', import.meta.url), { type: 'module' })
    .catch((err) => console.log('Service Worker konnte nicht registriert werden', err))
}
