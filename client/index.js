import Vue from 'vue'
import router from './router'
import IconPlugin from './components/icons/IconPlugin'
import './index.css'
import App from './App.vue'

Vue.use(IconPlugin)

new Vue({ el: '#root', router, render: create => create(App) })
