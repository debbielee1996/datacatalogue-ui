import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '@/components/general/About.vue'

import AllDatasets from '@/components/dataset/AllDatasets.vue'
import AllDataTablesOfDataset from '@/components/dataset/AllDataTablesOfDataset.vue'

import AllDataTables from '@/components/datatable/AllDataTables.vue'

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
  },
  {
    path: '/alldatatables',
    name: 'AllDataTables',
    component: AllDataTables
  },
  {
    path: '/dataset/:datasetId/alldatatables',
    name: 'AllDataTablesOfDataset',
    component: AllDataTablesOfDataset
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
