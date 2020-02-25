import Vue from 'vue'
import router from './router'
import IconPlugin from './components/icons/IconPlugin'
import './assets/styles/index.css'

Vue.use(IconPlugin)

new Vue({
  el: '#root',
  router,
  render(h) {
    return h('div', { class: 'flex flex-col h-full', domProps: { id: 'root' } }, [h('router-view')])
  },
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .catch(err => console.log('Service Worker konnte nicht regisriert werden', err))
}
