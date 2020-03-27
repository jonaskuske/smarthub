import Vue from 'vue'
import './assets/styles/index.css'
import App from './App.vue'
import router from './router'
import icons from './components/icons/*.vue'

Vue.config.productionTip = false

const iconComponents = Object.fromEntries(
  Object.entries(icons).map(([name, mod]) => [name, mod.default]),
)

Vue.mixin({ components: iconComponents })

new Vue({
  el: '#root',
  router,
  render: (h) => h(App),
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .catch((err) => console.log('Service Worker konnte nicht registriert werden', err))
}
