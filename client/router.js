import { createRouter, createWebHistory } from 'vue-router'

import Layout from './views/_Layout.vue'
import Device from './views/Device.vue'
import DeviceList from './views/DeviceList.vue'
import Settings from './views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
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
    { path: '/:pathMatch(.*)', redirect: '/' },
  ],
})

export default router
