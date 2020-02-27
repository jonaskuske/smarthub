import Vue from 'vue'
import Router from 'vue-router'

import Layout from './views/_Layout'
import Device from './views/Device'
import DeviceList from './views/DeviceList'
import Settings from './views/Settings'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: DeviceList },
        { path: 'devices', redirect: '/' },
        { path: 'devices/:deviceName', component: Device, props: true },
      ],
    },
    { path: '/settings', component: Settings },
  ],
})

export default router
