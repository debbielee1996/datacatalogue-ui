import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '@/components/general/About.vue'
import AllDatasets from '@/components/dataset/AllDatasets.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'About',
    component: About
  },
  {
    path: '/alldatasets',
    name: 'AllDatasets',
    component: AllDatasets
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
