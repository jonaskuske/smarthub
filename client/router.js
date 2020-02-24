import Vue from 'vue'
import Router from 'vue-router'

import Device from './views/Device'
import DeviceList from './views/DeviceList'
import Settings from './views/Settings'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', component: DeviceList },
    { path: '/devices', redirect: '/' },
    { path: '/devices/:deviceName', component: Device, props: true },
    { path: '/settings', component: Settings },
  ],
})

export default router
